import cv2
from pathlib import (
    Path,
)


# =========================
# Extract Video Metadata
# =========================

def extract_video_metadata(
    video_path: str,
):

    cap = cv2.VideoCapture(
        video_path
    )

    if not cap.isOpened():

        raise RuntimeError(
            "Could not open video"
        )

    width = int(
        cap.get(
            cv2.CAP_PROP_FRAME_WIDTH
        )
    )

    height = int(
        cap.get(
            cv2.CAP_PROP_FRAME_HEIGHT
        )
    )

    fps = int(
        cap.get(
            cv2.CAP_PROP_FPS
        )
    )

    frame_count = int(
        cap.get(
            cv2.CAP_PROP_FRAME_COUNT
        )
    )

    duration_seconds = (
        int(frame_count / fps)
        if fps > 0
        else 0
    )

    cap.release()

    return {
        "width": width,
        "height": height,
        "fps": fps,
        "frame_count": frame_count,
        "duration_seconds":
            duration_seconds,
    }


# =========================
# Validate Video File
# =========================

def validate_video_file(
    video_path: str,
):

    path = Path(video_path)

    if not path.exists():

        raise FileNotFoundError(
            f"Video not found: "
            f"{video_path}"
        )

    cap = cv2.VideoCapture(
        str(path)
    )

    if not cap.isOpened():

        raise RuntimeError(
            "Invalid video file"
        )

    cap.release()

    return True


# =========================
# Resize Frame
# =========================

def resize_frame(
    frame,
    *,
    width: int,
    height: int,
):

    return cv2.resize(
        frame,
        (width, height),
    )


# =========================
# Calculate Progress
# =========================

def calculate_progress(
    *,
    current_frame: int,
    total_frames: int,
):

    if total_frames <= 0:
        return 0

    return int(
        (
            current_frame
            / total_frames
        ) * 100
    )