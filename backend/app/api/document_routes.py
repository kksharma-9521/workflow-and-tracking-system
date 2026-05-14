from fastapi import (
    APIRouter,
    Depends,
    File,
    Query,
    Request,
    UploadFile,
)

from fastapi.responses import (
    StreamingResponse,
)

from sqlalchemy.orm import Session

from app.core.database import (
    get_db,
)

from app.schemas.document_schema import (
    DocumentProgressResponse,
    DocumentResponse,
    DocumentReviewUpdate,
)

from app.services.document_service import (
    create_document_from_upload,
    finalize_document_service,
    get_document_or_404,
    get_documents_service,
    retry_document_service,
    update_reviewed_result_service,
)

from app.services.export_service import (
    export_documents_csv_service,
    export_documents_json_service,
)

from app.services.stream_service import (
    progress_event_stream,
)

from app.utils.logger import (
    logger,
)


router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)


# =========================
# Upload Single Document
# =========================

@router.post(
    "/upload",
    response_model=DocumentResponse,
)
def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):

    logger.info(
        f"Uploading document "
        f"filename={file.filename}"
    )

    return create_document_from_upload(
        file=file,
        db=db,
    )


# =========================
# Upload Multiple Documents
# =========================

@router.post(
    "/uploads",
    response_model=list[
        DocumentResponse
    ],
)
def upload_documents(
    files: list[UploadFile] = File(...),
    db: Session = Depends(get_db),
):

    documents = []

    for file in files:

        document = (
            create_document_from_upload(
                file=file,
                db=db,
            )
        )

        documents.append(
            document
        )

    return documents


# =========================
# Get Documents
# =========================

@router.get(
    "/",
)
def get_documents(
    search: str | None = Query(
        default=None,
    ),

    status: str | None = Query(
        default=None,
    ),

    finalized: bool | None = Query(
        default=None,
    ),

    sort_by: str = Query(
        default="created_at",
    ),

    sort_order: str = Query(
        default="desc",
    ),

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

    return get_documents_service(
        db=db,
        search=search,
        status=status,
        finalized=finalized,
        sort_by=sort_by,
        sort_order=sort_order,
        limit=limit,
        offset=offset,
    )


# =========================
# Get Single Document
# =========================

@router.get(
    "/{doc_id}",
    response_model=(
        DocumentResponse
    ),
)
def get_document(
    doc_id: int,
    db: Session = Depends(get_db),
):

    return get_document_or_404(
        doc_id=doc_id,
        db=db,
    )


# =========================
# Get Document Progress
# =========================

@router.get(
    "/{doc_id}/progress",
    response_model=(
        DocumentProgressResponse
    ),
)
def get_document_progress(
    doc_id: int,
    db: Session = Depends(get_db),
):

    return get_document_or_404(
        doc_id=doc_id,
        db=db,
    )


# =========================
# Stream Single Document
# =========================

@router.get(
    "/{doc_id}/progress/stream",
)
async def stream_document_progress(
    doc_id: int,
    request: Request,
    db: Session = Depends(get_db),
):

    document = (
        get_document_or_404(
            doc_id=doc_id,
            db=db,
        )
    )

    return StreamingResponse(
        progress_event_stream(
            request=request,
            document=document,
        ),
        media_type=(
            "text/event-stream"
        ),
        headers={
            "Cache-Control":
                "no-cache",

            "Connection":
                "keep-alive",

            "X-Accel-Buffering":
                "no",
        },
    )


# =========================
# Stream All Documents
# =========================

@router.get(
    "/progress/stream",
)
async def stream_all_documents(
    request: Request,
):

    return StreamingResponse(
        progress_event_stream(
            request=request,
            document=None,
        ),
        media_type=(
            "text/event-stream"
        ),
        headers={
            "Cache-Control":
                "no-cache",

            "Connection":
                "keep-alive",

            "X-Accel-Buffering":
                "no",
        },
    )


# =========================
# Retry Failed Document
# =========================

@router.post(
    "/{doc_id}/retry",
    response_model=(
        DocumentResponse
    ),
)
def retry_document(
    doc_id: int,
    db: Session = Depends(get_db),
):

    return retry_document_service(
        doc_id=doc_id,
        db=db,
    )


# =========================
# Review Result
# =========================

@router.patch(
    "/{doc_id}/review",
    response_model=(
        DocumentResponse
    ),
)
def update_reviewed_result(
    doc_id: int,
    payload: (
        DocumentReviewUpdate
    ),
    db: Session = Depends(get_db),
):

    return (
        update_reviewed_result_service(
            doc_id=doc_id,
            payload=payload,
            db=db,
        )
    )


# =========================
# Finalize Document
# =========================

@router.post(
    "/{doc_id}/finalize",
    response_model=(
        DocumentResponse
    ),
)
def finalize_document(
    doc_id: int,
    db: Session = Depends(get_db),
):

    return finalize_document_service(
        doc_id=doc_id,
        db=db,
    )


# =========================
# Export JSON
# =========================

@router.get(
    "/exports/json",
)
def export_documents_json(
    finalized_only: bool = Query(
        default=True,
    ),
    db: Session = Depends(get_db),
):

    return (
        export_documents_json_service(
            finalized_only=(
                finalized_only
            ),
            db=db,
        )
    )


# =========================
# Export CSV
# =========================

@router.get(
    "/exports/csv",
)
def export_documents_csv(
    finalized_only: bool = Query(
        default=True,
    ),
    db: Session = Depends(get_db),
):

    return (
        export_documents_csv_service(
            finalized_only=(
                finalized_only
            ),
            db=db,
        )
    )