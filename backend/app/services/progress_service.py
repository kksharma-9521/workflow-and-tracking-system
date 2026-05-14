import json
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.redis_client import (
    redis_client,
)
from app.models.document import (
    Document,
)
from app.utils.logger import logger


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def build_progress_payload(
    document: Document,
    event: str,
) -> dict:

    return {
        "event": event,
        "document_id": document.id,
        "status": document.status,
        "progress": document.progress,
        "current_stage": (
            document.current_stage
        ),
        "error_message": (
            document.error_message
        ),
        "updated_at": utc_now().isoformat(),
    }


def publish_progress_event(
    payload: dict,
):

    try:

        redis_client.publish(
            settings.progress_channel,
            json.dumps(payload),
        )

    except Exception as exc:

        logger.error(
            f"Failed to publish "
            f"progress event: {str(exc)}"
        )


def update_document_progress(
    db: Session,
    document: Document,
    *,
    status=None,
    stage=None,
    progress=None,
    event=None,
    commit: bool = True,
):

    if status is not None:
        document.status = status

    if stage is not None:
        document.current_stage = stage

    if progress is not None:
        document.progress = progress

    document.updated_at = utc_now()

    if commit:
        db.commit()
        db.refresh(document)

    if event:

        payload = build_progress_payload(
            document=document,
            event=event,
        )

        publish_progress_event(
            payload,
        )

    logger.info(
        f"Document progress updated "
        f"document_id={document.id} "
        f"progress={document.progress}"
    )