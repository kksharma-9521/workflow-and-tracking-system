from fastapi import (
    APIRouter,
    Depends,
    Request,
)

from fastapi.responses import (
    StreamingResponse,
)

from sqlalchemy.orm import (
    Session,
)

from app.core.database import (
    get_db,
)

from app.services.document_service import (
    get_document_or_404,
)

from app.services.stream_service import (
    progress_event_stream,
)


router = APIRouter(
    prefix="/progress",
    tags=["Progress"],
)


# =========================
# Stream All Progress Events
# =========================

@router.get(
    "/stream",
)
async def stream_all_progress(
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
# Stream Single Document
# =========================

@router.get(
    "/documents/{doc_id}",
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