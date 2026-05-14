import os
import time

from collections import (
    defaultdict,
    deque,
)

import cv2
import torch
import numpy as np

from ultralytics import YOLO

from app.core.config import (
    settings,
)

from app.utils.logger import (
    logger,
)

from app.core.database import (
    SessionLocal,
)

from app.models.tracking import (
    TrackingFrame,
    TrackedEntity,
)

from app.api.tracking_db import (
    bulk_create_entities,
    bulk_create_tracking_frames,
)


# =========================
# Device Selection
# =========================

DEVICE = (
    "cuda"
    if torch.cuda.is_available()
    else "cpu"
)

logger.info(
    f"Using device: {DEVICE}"
)


# =========================
# Load YOLO Model
# =========================

logger.info(
    "Loading YOLO model..."
)

model = YOLO(
    settings.yolo_model_name
)

model.to(DEVICE)

logger.info(
    "YOLO model loaded"
)


# =========================
# Warmup Inference
# =========================

try:

    dummy_frame = np.zeros(
        (
            settings.video_resize_height,
            settings.video_resize_width,
            3,
        ),
        dtype=np.uint8,
    )

    logger.info(
        "Running model warmup..."
    )

    model.predict(
        dummy_frame,
        verbose=False,
    )

    logger.info(
        "Model warmup completed"
    )

except Exception as exc:

    logger.warning(
        f"Warmup failed: {str(exc)}"
    )


# =========================
# Video Processing
# =========================

def process_video(
    input_path: str,
    output_path: str,
    job_id: int,
):

    processing_start_time = (
        time.time()
    )

    logger.info(
        f"Opening video: "
        f"{input_path}"
    )

    cap = cv2.VideoCapture(
        input_path
    )

    if not cap.isOpened():

        logger.error(
            "Failed to open video"
        )

        raise RuntimeError(
            "Could not open video"
        )

    os.makedirs(
        os.path.dirname(
            output_path
        ),
        exist_ok=True,
    )

    # =====================
    # Video Metadata
    # =====================

    original_width = int(
        cap.get(
            cv2.CAP_PROP_FRAME_WIDTH
        )
    )

    original_height = int(
        cap.get(
            cv2.CAP_PROP_FRAME_HEIGHT
        )
    )

    fps = int(
        cap.get(
            cv2.CAP_PROP_FPS
        )
    )

    if fps <= 0:
        fps = 30

    total_frames = int(
        cap.get(
            cv2.CAP_PROP_FRAME_COUNT
        )
    )

    duration_seconds = int(
        total_frames / fps
    )

    logger.info(
        f"Video metadata "
        f"width={original_width} "
        f"height={original_height} "
        f"fps={fps} "
        f"frames={total_frames}"
    )

    # =====================
    # Output Video
    # =====================

    output_width = (
        settings.video_resize_width
    )

    output_height = (
        settings.video_resize_height
    )

    fourcc = cv2.VideoWriter_fourcc(  # pyright: ignore[reportAttributeAccessIssue]
        *"mp4v"
    )

    out = cv2.VideoWriter(
        output_path,
        fourcc,
        fps,
        (
            output_width,
            output_height,
        ),
    )

    # =====================
    # Tracking State
    # =====================

    trajectory_history = (
        defaultdict(
            lambda: deque(
                maxlen=settings
                .max_tracking_history
            )
        )
    )

    unique_track_ids = set()

    frame_count = 0

    processed_frames = 0

    skipped_frames = 0

    failed_frames = 0

    inference_times = []

    tracking_frame_batch = []

    entity_batch = []

    seen_tracking_ids = set()

    # =====================
    # Main Processing Loop
    # =====================

    try:

        while True:

            success, frame = (
                cap.read()
            )

            if not success:
                break

            frame_count += 1

            # =================
            # Adaptive Skip
            # =================

            if (
                frame_count
                % settings
                .frame_skip_interval
                != 0
            ):

                skipped_frames += 1

                continue

            processed_frames += 1

            try:

                # ============
                # Resize
                # ============

                frame = cv2.resize(
                    frame,
                    (
                        output_width,
                        output_height,
                    ),
                )

                # ============
                # Inference
                # ============

                inference_start = (
                    time.time()
                )

                results = model.track(

                    frame,

                    persist=True,

                    tracker="bytetrack.yaml",

                    conf=0.35,

                    iou=0.5,

                    verbose=False,
                )

                inference_duration = (
                    time.time()
                    - inference_start
                )

                inference_times.append(
                    inference_duration
                )

                result = results[0]

                annotated_frame = (
                    result.plot()
                )

                # ============
                # Tracking
                # ============

                if (
                    result.boxes is not None
                    and result.boxes.id is not None
                ):

                    boxes = (
                        result.boxes.xyxy
                        .cpu()
                        .numpy()
                    )

                    track_ids = (
                        result.boxes.id
                        .cpu()
                        .numpy()
                        .astype(int)
                    )

                    confidences = (
                        result.boxes.conf
                        .cpu()
                        .numpy()
                    )

                    for (
                        box,
                        track_id,
                        confidence,
                    ) in zip(
                        boxes,
                        track_ids,
                        confidences,
                    ):

                        unique_track_ids.add(
                            int(track_id)
                        )

                        x1, y1, x2, y2 = box

                        x1 = float(x1)
                        y1 = float(y1)
                        x2 = float(x2)
                        y2 = float(y2)

                        width = x2 - x1
                        height = y2 - y1

                        current_time = (
                            frame_count / fps
                        )

                        center_x = int(
                            (x1 + x2) / 2
                        )

                        center_y = int(
                            (y1 + y2) / 2
                        )

                        trajectory = (
                            trajectory_history[
                                int(track_id)
                            ]
                        )

                        trajectory.append(
                            (
                                center_x,
                                center_y,
                            )
                        )

                        # ============
                        # Save Frame
                        # ============

                        frame_record = (
                            TrackingFrame(

                                job_id=int(
                                    job_id
                                ),

                                timestamp=float(
                                    current_time
                                ),

                                tracking_id=int(
                                    track_id
                                ),

                                x=float(x1),

                                y=float(y1),

                                width=float(width),

                                height=float(height),

                                confidence=float(
                                    confidence
                                ),
                            )
                        )

                        tracking_frame_batch.append(
                            frame_record
                        )

                        # ============
                        # Save Entity
                        # ============

                        if (
                            int(track_id)
                            not in seen_tracking_ids
                        ):

                            entity = (
                                TrackedEntity(

                                    job_id=int(
                                        job_id
                                    ),

                                    tracking_id=int(
                                        track_id
                                    ),

                                    first_seen=str(
                                        round(
                                            current_time,
                                            2,
                                        )
                                    ),

                                    confidence=float(
                                        confidence
                                    ),

                                    status="active",
                                )
                            )

                            entity_batch.append(
                                entity
                            )

                            seen_tracking_ids.add(
                                int(track_id)
                            )

                        # =========
                        # Draw Path
                        # =========

                        if (
                            len(trajectory)
                            > 1
                        ):

                            points = list(
                                trajectory
                            )

                            for i in range(
                                1,
                                len(points),
                            ):

                                cv2.line(

                                    annotated_frame,

                                    points[
                                        i - 1
                                    ],

                                    points[i],

                                    (
                                        0,
                                        255,
                                        0,
                                    ),

                                    2,
                                )

                        # =========
                        # Draw Center
                        # =========

                        cv2.circle(

                            annotated_frame,

                            (
                                center_x,
                                center_y,
                            ),

                            4,

                            (
                                0,
                                255,
                                0,
                            ),

                            -1,
                        )

                out.write(
                    annotated_frame
                )

                # =====================
                # Progress Logs
                # =====================

                if (
                    processed_frames % 20 == 0
                ):

                    progress = int(

                        (
                            frame_count
                            / total_frames
                        ) * 100
                    )

                    logger.info(
                        f"Tracking progress "
                        f"{progress}% "
                        f"processed="
                        f"{processed_frames}"
                    )

                    try:

                        from app.models.video_job import (
                            VideoJob,
                        )

                        progress_db = (
                            SessionLocal()
                        )

                        job = (
                            progress_db.query(
                                VideoJob
                            )
                            .filter(
                                VideoJob.id
                                == int(job_id)
                            )
                            .first()
                        )

                        if job:

                            job.progress = (
                                progress
                            )

                            job.status = (
                                "processing"
                            )

                            progress_db.commit()

                    except Exception as exc:

                        logger.warning(
                            f"Progress update failed: "
                            f"{str(exc)}"
                        )

                    finally:

                        progress_db.close()

            except Exception as frame_exc:

                failed_frames += 1

                logger.warning(
                    f"Frame processing "
                    f"failed "
                    f"frame={frame_count} "
                    f"error={str(frame_exc)}"
                )

                continue

    finally:

        cap.release()

        out.release()

        cv2.destroyAllWindows()

    # =====================
    # Save Tracking Data
    # =====================

    db = SessionLocal()

    try:

        bulk_create_tracking_frames(
            db,
            tracking_frame_batch,
        )

        bulk_create_entities(
            db,
            entity_batch,
        )

    finally:

        db.close()

    # =====================
    # Final Analytics
    # =====================

    processing_duration = int(
        time.time()
        - processing_start_time
    )

    avg_inference_time = (
        (
            sum(inference_times)
            / len(inference_times)
        )
        if inference_times
        else 0
    )

    effective_fps = (
        (
            processed_frames
            / processing_duration
        )
        if processing_duration > 0
        else 0
    )

    logger.info(
        f"Tracking completed "
        f"in {processing_duration}s"
    )

    return {

        "fps":
            fps,

        "frame_count":
            total_frames,

        "processed_frames":
            processed_frames,

        "skipped_frames":
            skipped_frames,

        "failed_frames":
            failed_frames,

        "duration_seconds":
            duration_seconds,

        "detected_object_count":
            len(unique_track_ids),

        "processing_duration_seconds":
            processing_duration,

        "average_inference_time":
            round(
                avg_inference_time,
                4,
            ),

        "effective_processing_fps":
            round(
                effective_fps,
                2,
            ),

        "frame_skip_interval":
            settings
            .frame_skip_interval,

        "resize_resolution":
            (
                f"{output_width}x"
                f"{output_height}"
            ),

        "device":
            DEVICE,
    }