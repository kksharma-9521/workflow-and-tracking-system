from pathlib import Path

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    Query,
    UploadFile,
)

from fastapi.responses import (
    FileResponse,
)

from sqlalchemy.orm import (
    Session,
)

from app.core.database import (
    get_db,
)

from app.models.video_job import (
    VideoJob,
)

from app.schemas.video_schema import (
    VideoJobResponse,
)

from app.services.video_service import (
    create_video_job_service,
)

from app.utils.logger import (
    logger,
)

from app.workers.video_tasks import (
    process_video_task,
)


router = APIRouter(
    prefix="/videos",
    tags=["Videos"],
)


# =========================
# Helper
# =========================

def normalize_output_path(
    output_path: str | None,
):

    if not output_path:
        return None

    normalized = (
        output_path
        .replace("\\", "/")
    )

    if "static/" in normalized:

        normalized = (
            normalized[
                normalized.index(
                    "static/"
                ):
            ]
        )

    return normalized


# =========================
# Upload Video
# =========================

@router.post(
    "/upload",
    response_model=(
        VideoJobResponse
    ),
)
def upload_video(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):

    logger.info(
        f"Uploading video "
        f"filename={file.filename}"
    )

    video_job = (
        create_video_job_service(
            file=file,
            db=db,
        )
    )

    celery_task = (
        process_video_task.delay(
            video_job.id
        )
    )

    video_job.celery_task_id = (
        celery_task.id
    )

    db.commit()

    db.refresh(video_job)

    logger.info(
        f"Queued video job "
        f"id={video_job.id}"
    )

    return video_job


# =========================
# Get Video Job
# =========================

@router.get(
    "/{video_job_id}",
    response_model=(
        VideoJobResponse
    ),
)
def get_video_job(
    video_job_id: int,
    db: Session = Depends(get_db),
):

    video_job = (
        db.query(VideoJob)
        .filter(
            VideoJob.id
            == video_job_id
        )
        .first()
    )

    if not video_job:

        raise HTTPException(
            status_code=404,
            detail=(
                "Video job "
                "not found"
            ),
        )

    if video_job.output_path:

        video_job.output_path = (
            normalize_output_path(
                video_job.output_path
            )
        )

    return video_job


# =========================
# List Video Jobs
# =========================

@router.get(
    "/",
    response_model=list[
        VideoJobResponse
    ],
)
def list_video_jobs(
    limit: int = Query(
        default=20,
        ge=1,
        le=100,
    ),

    offset: int = Query(
        default=0,
        ge=0,
    ),

    db: Session = Depends(get_db),
):

    jobs = (
        db.query(VideoJob)
        .order_by(
            VideoJob.created_at
            .desc()
        )
        .offset(offset)
        .limit(limit)
        .all()
    )

    for job in jobs:

        if job.output_path:

            job.output_path = (
                normalize_output_path(
                    job.output_path
                )
            )

    return jobs


# =========================
# Download Output Video
# =========================

@router.get(
    "/{video_job_id}/download",
)
def download_processed_video(
    video_job_id: int,
    db: Session = Depends(get_db),
):

    video_job = (
        db.query(VideoJob)
        .filter(
            VideoJob.id
            == video_job_id
        )
        .first()
    )

    if not video_job:

        raise HTTPException(
            status_code=404,
            detail=(
                "Video job "
                "not found"
            ),
        )

    if not video_job.output_path:

        raise HTTPException(
            status_code=400,
            detail=(
                "Processed video "
                "not available"
            ),
        )

    file_path = Path(
        video_job.output_path
    )

    if not file_path.exists():

        raise HTTPException(
            status_code=404,
            detail=(
                "Processed file "
                "missing on disk"
            ),
        )

    return FileResponse(
        path=str(file_path),
        media_type="video/mp4",
        filename=(
            f"tracked_"
            f"{video_job.id}.mp4"
        ),
    )


# =========================
# Get Tracking Analytics
# =========================

@router.get(
    "/{video_job_id}/analytics",
)
def get_tracking_analytics(
    video_job_id: int,
    db: Session = Depends(get_db),
):

    video_job = (
        db.query(VideoJob)
        .filter(
            VideoJob.id
            == video_job_id
        )
        .first()
    )

    if not video_job:

        raise HTTPException(
            status_code=404,
            detail=(
                "Video job "
                "not found"
            ),
        )

    return {

        "video_job_id":
            video_job.id,

        "status":
            video_job.status,

        "fps":
            video_job.fps,

        "frame_count":
            video_job.frame_count,

        "duration_seconds":
            video_job.duration_seconds,

        "detected_object_count":
            video_job
            .detected_object_count,

        "processing_duration_seconds":
            video_job
            .processing_duration_seconds,

        "tracking_summary":
            video_job
            .tracking_summary,

        "output_path":
            normalize_output_path(
                video_job.output_path
            ),
    }