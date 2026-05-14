import hashlib
import shutil
import uuid
from pathlib import (
    Path,
)

from fastapi import (
    HTTPException,
    UploadFile,
)

from sqlalchemy.orm import (
    Session,
)

from app.core.config import (
    settings,
)

from app.models.video_job import (
    VideoJob,
    VideoJobStatus,
)

from app.utils.logger import (
    logger,
)


# =========================
# Allowed Video Types
# =========================

ALLOWED_VIDEO_EXTENSIONS = {
    ".mp4",
    ".mov",
    ".avi",
    ".mkv",
}


# =========================
# Upload Directory
# =========================

VIDEO_UPLOAD_DIR = (
    settings.upload_dir
    / "videos"
)

VIDEO_UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


# =========================
# Generate Safe Filename
# =========================

def generate_safe_filename(
    filename: str,
):

    extension = (
        Path(filename)
        .suffix
        .lower()
    )

    safe_name = (
        "".join(
            char
            if char.isalnum()
            else "_"
            for char in Path(
                filename
            ).stem
        )
        .strip("_")
    )

    return (
        f"{uuid.uuid4().hex}"
        f"_{safe_name}"
        f"{extension}"
    )


# =========================
# Calculate SHA256
# =========================

def calculate_checksum(
    file_path: Path,
):

    sha256 = hashlib.sha256()

    with file_path.open(
        "rb"
    ) as file:

        for chunk in iter(
            lambda:
            file.read(
                1024 * 1024
            ),
            b"",
        ):

            sha256.update(
                chunk
            )

    return sha256.hexdigest()


# =========================
# Create Video Job
# =========================

def create_video_job_service(
    *,
    file: UploadFile,
    db: Session,
):

    if not file.filename:

        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid "
                "filename"
            ),
        )

    extension = (
        Path(file.filename)
        .suffix
        .lower()
    )

    if (
        extension
        not in
        ALLOWED_VIDEO_EXTENSIONS
    ):

        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported "
                "video format"
            ),
        )

    stored_filename = (
        generate_safe_filename(
            file.filename
        )
    )

    file_path = (
        VIDEO_UPLOAD_DIR
        / stored_filename
    )

    with file_path.open(
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            file.file,
            buffer,
        )

    file_size_bytes = (
        file_path.stat()
        .st_size
    )

    logger.info(
        f"Saved uploaded video "
        f"filename={stored_filename}"
    )

    video_job = VideoJob(

        original_filename=(
            file.filename
        ),

        stored_filename=(
            stored_filename
        ),

        input_path=str(
            file_path
        ),

        file_size_bytes=(
            file_size_bytes
        ),

        status=(
            VideoJobStatus
            .QUEUED
            .value
        ),

        progress=0,
    )

    db.add(video_job)

    db.commit()

    db.refresh(video_job)

    logger.info(
        f"Created video job "
        f"id={video_job.id}"
    )

    return video_job