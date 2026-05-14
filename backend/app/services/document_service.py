import hashlib
import shutil
import uuid
from datetime import (
    datetime,
    timezone,
)

from pathlib import (
    Path,
)

from fastapi import (
    HTTPException,
    UploadFile,
)

from sqlalchemy import (
    or_,
)

from sqlalchemy.orm import (
    Session,
)

from app.core.config import (
    settings,
)

from app.models.document import (
    Document,
)

from app.models.enums import (
    DocumentStatus,
    ProcessingStage,
)

from app.schemas.document_schema import (
    DocumentReviewUpdate,
)

from app.utils.file_utils import (
    ALLOWED_DOCUMENT_EXTENSIONS,
    calculate_file_checksum,
    generate_safe_filename,
    validate_file_extension,
)

from app.utils.logger import (
    logger,
)

from app.workers.document_tasks import (
    process_document,
)


# =========================
# Upload Directory
# =========================

DOCUMENT_UPLOAD_DIR = (
    settings.upload_dir
    / "documents"
)

DOCUMENT_UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


# =========================
# UTC Time
# =========================

def utc_now():

    return datetime.now(
        timezone.utc
    )


# =========================
# Create Document Upload
# =========================

def create_document_from_upload(
    *,
    file: UploadFile,
    db: Session,
):

    if not file.filename:

        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid filename"
            ),
        )

    extension = (
        validate_file_extension(
            filename=file.filename,
            allowed_extensions=(
                ALLOWED_DOCUMENT_EXTENSIONS
            ),
        )
    )

    stored_filename = (
        f"{uuid.uuid4().hex}_"
        f"{generate_safe_filename(file.filename)}"
    )

    file_path = (
        DOCUMENT_UPLOAD_DIR
        / stored_filename
    )

    with file_path.open(
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            file.file,
            buffer,
        )

    file_checksum = (
        calculate_file_checksum(
            file_path
        )
    )

    existing_document = (
        db.query(Document)
        .filter(
            Document.file_checksum
            == file_checksum
        )
        .first()
    )

    if existing_document:

        file_path.unlink(
            missing_ok=True
        )

        raise HTTPException(
            status_code=409,
            detail=(
                "Duplicate document "
                "already exists"
            ),
        )

    file_size_bytes = (
        file_path.stat()
        .st_size
    )

    document = Document(

        original_filename=(
            file.filename
        ),

        stored_filename=(
            stored_filename
        ),

        file_path=str(
            file_path
        ),

        file_type=(
            extension.replace(
                ".",
                "",
            )
        ),

        mime_type=file.content_type,

        file_size_bytes=(
            file_size_bytes
        ),

        file_checksum=(
            file_checksum
        ),

        status=(
            DocumentStatus
            .QUEUED
            .value
        ),

        current_stage=(
            ProcessingStage
            .JOB_QUEUED
            .value
        ),

        progress=0,
    )

    db.add(document)

    db.commit()

    db.refresh(document)

    celery_task = (
        process_document.delay(
            document.id
        )
    )

    document.celery_task_id = (
        celery_task.id
    )

    db.commit()

    db.refresh(document)

    logger.info(
        f"Created document "
        f"id={document.id}"
    )

    return document


# =========================
# Get Document
# =========================

def get_document_or_404(
    *,
    doc_id: int,
    db: Session,
):

    document = (
        db.query(Document)
        .filter(
            Document.id == doc_id
        )
        .first()
    )

    if not document:

        raise HTTPException(
            status_code=404,
            detail=(
                "Document not found"
            ),
        )

    return document


# =========================
# Get Documents
# =========================

def get_documents_service(
    *,
    db: Session,
    search: str | None,
    status: str | None,
    finalized: bool | None,
    sort_by: str,
    sort_order: str,
    limit: int,
    offset: int,
):

    query = db.query(Document)

    if search:

        query = query.filter(
            or_(
                Document.original_filename
                .ilike(
                    f"%{search}%"
                ),

                Document.status
                .ilike(
                    f"%{search}%"
                ),
            )
        )

    if status:

        query = query.filter(
            Document.status
            == status
        )

    if finalized is not None:

        query = query.filter(
            Document.finalized
            == finalized
        )

    sortable_columns = {

        "created_at":
            Document.created_at,

        "updated_at":
            Document.updated_at,

        "progress":
            Document.progress,
    }

    sort_column = (
        sortable_columns.get(
            sort_by,
            Document.created_at,
        )
    )

    if (
        sort_order.lower()
        == "asc"
    ):

        query = query.order_by(
            sort_column.asc()
        )

    else:

        query = query.order_by(
            sort_column.desc()
        )

    total = query.count()

    documents = (
        query
        .offset(offset)
        .limit(limit)
        .all()
    )

    return {

        "total":
            total,

        "limit":
            limit,

        "offset":
            offset,

        "items":
            documents,
    }


# =========================
# Retry Document
# =========================

def retry_document_service(
    *,
    doc_id: int,
    db: Session,
):

    document = (
        get_document_or_404(
            doc_id=doc_id,
            db=db,
        )
    )

    document.status = (
        DocumentStatus
        .QUEUED
        .value
    )

    document.current_stage = (
        ProcessingStage
        .JOB_QUEUED
        .value
    )

    document.progress = 0

    document.error_message = None

    document.retry_count += 1

    document.updated_at = (
        utc_now()
    )

    db.commit()

    db.refresh(document)

    celery_task = (
        process_document.delay(
            document.id
        )
    )

    document.celery_task_id = (
        celery_task.id
    )

    db.commit()

    db.refresh(document)

    logger.info(
        f"Retried document "
        f"id={document.id}"
    )

    return document


# =========================
# Review Result
# =========================

def update_reviewed_result_service(
    *,
    doc_id: int,
    payload: (
        DocumentReviewUpdate
    ),
    db: Session,
):

    document = (
        get_document_or_404(
            doc_id=doc_id,
            db=db,
        )
    )

    document.reviewed_result = (
        payload.reviewed_result
    )

    document.updated_at = (
        utc_now()
    )

    db.commit()

    db.refresh(document)

    return document


# =========================
# Finalize Document
# =========================

def finalize_document_service(
    *,
    doc_id: int,
    db: Session,
):

    document = (
        get_document_or_404(
            doc_id=doc_id,
            db=db,
        )
    )

    document.finalized = True

    document.finalized_at = (
        utc_now()
    )

    document.updated_at = (
        utc_now()
    )

    db.commit()

    db.refresh(document)

    logger.info(
        f"Finalized document "
        f"id={document.id}"
    )

    return document