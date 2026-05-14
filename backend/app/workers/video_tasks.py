import time

from datetime import (
    datetime,
    timezone,
)

from celery import shared_task

from sqlalchemy.orm import (
    Session,
)

from app.core.database import (
    SessionLocal,
)

from app.models.video_job import (
    VideoJob,
    VideoJobStatus,
)

from app.services.tracking_service import (
    process_video,
)

from app.utils.logger import (
    logger,
)


# =========================
# Time Helper
# =========================

def utc_now():

    return datetime.now(
        timezone.utc
    )


# =========================
# Fetch Video Job
# =========================

def get_video_job(
    *,
    db: Session,
    video_job_id: int,
):

    return (
        db.query(VideoJob)
        .filter(
            VideoJob.id
            == video_job_id
        )
        .first()
    )


# =========================
# Celery Task
# =========================

@shared_task(
    name="process_video_task",

    autoretry_for=(Exception,),

    retry_backoff=True,

    retry_jitter=True,

    retry_kwargs={
        "max_retries": 2,
    },
)
def process_video_task(
    video_job_id: int,
):

    db: Session = SessionLocal()

    processing_start_time = (
        time.time()
    )

    video_job = None

    try:

        # =====================
        # Fetch Job
        # =====================

        video_job = get_video_job(
            db=db,
            video_job_id=(
                video_job_id
            ),
        )

        if not video_job:

            logger.error(
                f"Video job not found "
                f"id={video_job_id}"
            )

            return

        # =====================
        # Update Processing State
        # =====================

        video_job.status = (
            VideoJobStatus
            .PROCESSING
            .value
        )

        video_job.progress = 5

        video_job.started_at = (
            utc_now()
        )

        video_job.error_message = None

        db.commit()

        logger.info(
            f"Started video "
            f"processing "
            f"id={video_job.id}"
        )

        # =====================
        # Output Path
        # =====================

        output_path = (
            f"outputs/"
            f"tracked_"
            f"{video_job.id}.mp4"
        )

        # =====================
        # Run Tracking Pipeline
        # =====================

        processing_summary = (
            process_video(

                input_path=(
                    video_job.input_path
                ),

                output_path=(
                    output_path
                ),

                job_id=str(
                    video_job.id
                ),
            )
        )

        # =====================
        # Save Analytics
        # =====================

        video_job.output_path = (
            output_path
        )

        video_job.status = (
            VideoJobStatus
            .COMPLETED
            .value
        )

        video_job.progress = 100

        video_job.completed_at = (
            utc_now()
        )

        video_job.processing_duration_seconds = int(
            time.time()
            - processing_start_time
        )

        if processing_summary:

            video_job.fps = (
                processing_summary.get(
                    "fps"
                )
            )

            video_job.frame_count = (
                processing_summary.get(
                    "frame_count"
                )
            )

            video_job.duration_seconds = (
                processing_summary.get(
                    "duration_seconds"
                )
            )

            video_job.detected_object_count = (
                processing_summary.get(
                    "detected_object_count"
                )
            )

            video_job.tracking_summary = (
                processing_summary
            )

        db.commit()

        logger.info(
            f"Video processing "
            f"completed "
            f"id={video_job.id}"
        )

    except Exception as exc:

        logger.exception(
            f"Video processing failed "
            f"id={video_job_id}"
        )

        try:

            if video_job:

                video_job.status = (
                    VideoJobStatus
                    .FAILED
                    .value
                )

                video_job.progress = 0

                video_job.error_message = (
                    str(exc)
                )

                video_job.retry_count = (
                    video_job.retry_count
                    + 1
                )

                db.commit()

        except Exception as db_exc:

            logger.error(
                f"Failed to update "
                f"video job failure state: "
                f"{str(db_exc)}"
            )

        raise exc

    finally:

        db.close()