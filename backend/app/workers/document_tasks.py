import os
import time
from datetime import datetime, timezone

import docx
import pdfplumber
from celery import shared_task
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.document import (
    Document,
    DocumentStatus,
    ProcessingStage,
)
from app.services.progress_service import (
    update_document_progress,
)
from app.utils.logger import logger


# =========================
# UTC Helper
# =========================


def utc_now():

    return datetime.now(timezone.utc)


# =========================
# Text Extraction
# =========================


def extract_text_from_pdf(
    file_path: str,
) -> str:

    extracted_text = ""

    with pdfplumber.open(
        file_path
    ) as pdf:

        for page in pdf.pages:

            text = (
                page.extract_text()
                or ""
            )

            extracted_text += (
                text + "\n"
            )

    return extracted_text.strip()



def extract_text_from_docx(
    file_path: str,
) -> str:

    document = docx.Document(
        file_path
    )

    paragraphs = [
        paragraph.text
        for paragraph in document.paragraphs
    ]

    return "\n".join(
        paragraphs
    )


# =========================
# AI Style Parsing
# =========================


def parse_document_content(
    text: str,
):

    words = text.split()

    summary = (
        " ".join(words[:80])
        if words
        else "No content extracted"
    )

    keyword_candidates = []

    for word in words:

        cleaned = (
            word.lower()
            .replace(",", "")
            .replace(".", "")
            .replace(":", "")
        )

        if (
            len(cleaned) > 5
            and cleaned.isalpha()
        ):

            keyword_candidates.append(
                cleaned
            )

    keywords = list(
        dict.fromkeys(
            keyword_candidates
        )
    )[:10]

    category = "general"

    lowered = text.lower()

    if (
        "invoice" in lowered
        or "payment" in lowered
    ):

        category = "finance"

    elif (
        "resume" in lowered
        or "education" in lowered
        or "experience" in lowered
    ):

        category = "resume"

    elif (
        "passport" in lowered
        or "government" in lowered
    ):

        category = "identity"

    return {
        "summary": summary,
        "keywords": keywords,
        "category": category,
        "character_count": len(text),
        "word_count": len(words),
    }


# =========================
# Processing Pipeline
# =========================


PROCESSING_PIPELINE = [
    (
        ProcessingStage.JOB_STARTED,
        10,
        "job_started",
    ),
    (
        ProcessingStage
        .DOCUMENT_PARSING_STARTED,
        30,
        "document_parsing_started",
    ),
    (
        ProcessingStage
        .FIELD_EXTRACTION_STARTED,
        60,
        "field_extraction_started",
    ),
    (
        ProcessingStage
        .FIELD_EXTRACTION_COMPLETED,
        90,
        "field_extraction_completed",
    ),
]


# =========================
# Celery Task
# =========================


@shared_task(
    name="process_document",
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_kwargs={"max_retries": 3},
)
def process_document(
    document_id: int,
):

    db: Session = SessionLocal()

    processing_start_time = (
        time.time()
    )

    try:

        document = (
            db.query(Document)
            .filter(
                Document.id == document_id
            )
            .first()
        )

        if not document:

            logger.error(
                f"Document not found id={document_id}"
            )

            return

        document.started_at = (
            utc_now()
        )

        document.status = (
            DocumentStatus.PROCESSING
        )

        db.commit()

        for (
            stage,
            progress,
            event,
        ) in PROCESSING_PIPELINE:

            update_document_progress(
                db=db,
                document=document,
                stage=stage.value,
                progress=progress,
                event=event,
            )

            logger.info(
                f"Stage completed: {event}"
            )

            time.sleep(1)

        # =====================
        # File Parsing
        # =====================

        extracted_text = ""

        if (
            document.file_path
            and os.path.exists(
                document.file_path
            )
        ):

            if (
                document.file_path.endswith(
                    ".pdf"
                )
            ):

                extracted_text = (
                    extract_text_from_pdf(
                        document.file_path
                    )
                )

            elif (
                document.file_path.endswith(
                    ".docx"
                )
            ):

                extracted_text = (
                    extract_text_from_docx(
                        document.file_path
                    )
                )

        parsed_data = (
            parse_document_content(
                extracted_text
            )
        )
        print(extracted_text)

        document.result = {
            "title": (
                document.original_filename
            ),
            "category": (
                parsed_data[
                    "category"
                ]
            ),
            "summary": (
                parsed_data[
                    "summary"
                ]
            ),
            "keywords": (
                parsed_data[
                    "keywords"
                ]
            ),
            "word_count": (
                parsed_data[
                    "word_count"
                ]
            ),
            "character_count": (
                parsed_data[
                    "character_count"
                ]
            ),
            "preview_text": (
                extracted_text[:1000]
            ),
        }

        document.completed_at = (
            utc_now()
        )

        document.processing_duration_seconds = int(
            time.time()
            - processing_start_time
        )

        update_document_progress(
            db=db,
            document=document,
            status=(
                DocumentStatus
                .COMPLETED
            ),
            stage=(
                ProcessingStage
                .JOB_COMPLETED
                .value
            ),
            progress=100,
            event="job_completed",
        )

        logger.info(
            f"Document completed id={document.id}"
        )

    except Exception as exc:

        logger.error(
            f"Document processing failed: {str(exc)}"
        )

        document = (
            db.query(Document)
            .filter(
                Document.id == document_id
            )
            .first()
        )

        if document:

            document.failed_at = (
                utc_now()
            )

            document.error_message = (
                str(exc)
            )

            update_document_progress(
                db=db,
                document=document,
                status=(
                    DocumentStatus
                    .FAILED
                ),
                stage=(
                    ProcessingStage
                    .JOB_FAILED
                    .value
                ),
                event="job_failed",
            )

        raise exc

    finally:

        db.close()
