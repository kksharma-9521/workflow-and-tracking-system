from enum import (
    Enum,
)


# =========================
# Document Status
# =========================

class DocumentStatus(
    str,
    Enum,
):

    QUEUED = "queued"

    PROCESSING = "processing"

    COMPLETED = "completed"

    FAILED = "failed"

    CANCELLED = "cancelled"


# =========================
# Document Processing Stages
# =========================

class ProcessingStage(
    str,
    Enum,
):

    DOCUMENT_RECEIVED = (
        "document_received"
    )

    JOB_QUEUED = (
        "job_queued"
    )

    JOB_STARTED = (
        "job_started"
    )

    DOCUMENT_PARSING_STARTED = (
        "document_parsing_started"
    )

    DOCUMENT_PARSING_COMPLETED = (
        "document_parsing_completed"
    )

    FIELD_EXTRACTION_STARTED = (
        "field_extraction_started"
    )

    FIELD_EXTRACTION_COMPLETED = (
        "field_extraction_completed"
    )

    FINAL_RESULT_STORED = (
        "final_result_stored"
    )

    JOB_COMPLETED = (
        "job_completed"
    )

    JOB_FAILED = (
        "job_failed"
    )


# =========================
# Video Job Status
# =========================

class VideoJobStatus(
    str,
    Enum,
):

    QUEUED = "queued"

    PROCESSING = "processing"

    COMPLETED = "completed"

    FAILED = "failed"

    CANCELLED = "cancelled"