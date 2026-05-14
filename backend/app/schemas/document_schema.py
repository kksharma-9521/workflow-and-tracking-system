from datetime import (
    datetime,
)

from typing import (
    Any,
    Dict,
    Optional,
)

from pydantic import (
    BaseModel,
    ConfigDict,
)


# =========================
# Document Response
# =========================

class DocumentResponse(
    BaseModel
):

    id: int

    original_filename: (
        Optional[str]
    )

    stored_filename: (
        Optional[str]
    )

    file_path: Optional[str]

    file_type: Optional[str]

    mime_type: Optional[str]

    file_size_bytes: int

    file_checksum: (
        Optional[str]
    )

    status: str

    progress: int

    current_stage: str

    celery_task_id: (
        Optional[str]
    )

    retry_count: int

    error_message: (
        Optional[str]
    )

    result: Optional[
        Dict[str, Any]
    ]

    reviewed_result: Optional[
        Dict[str, Any]
    ]

    finalized: bool

    finalized_at: Optional[
        datetime
    ]

    created_at: datetime

    updated_at: datetime

    started_at: Optional[
        datetime
    ]

    completed_at: Optional[
        datetime
    ]

    failed_at: Optional[
        datetime
    ]

    model_config = (
        ConfigDict(
            from_attributes=True
        )
    )


# =========================
# Document Progress
# =========================

class DocumentProgressResponse(
    BaseModel
):

    id: int

    status: str

    progress: int

    current_stage: str

    error_message: (
        Optional[str]
    )

    celery_task_id: (
        Optional[str]
    )

    updated_at: datetime

    model_config = (
        ConfigDict(
            from_attributes=True
        )
    )


# =========================
# Review Update Payload
# =========================

class DocumentReviewUpdate(
    BaseModel
):

    reviewed_result: Dict[
        str,
        Any
    ]