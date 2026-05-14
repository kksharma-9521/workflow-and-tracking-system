from datetime import (
    datetime,
)

from typing import (
    Optional,
)

from pydantic import (
    BaseModel,
    ConfigDict,
)


class VideoJobResponse(
    BaseModel
):

    id: int

    original_filename: str

    stored_filename: str

    status: str

    progress: int

    input_path: str

    output_path: Optional[str]

    celery_task_id: Optional[str]

    error_message: Optional[str]

    retry_count: int

    fps: Optional[int]

    frame_count: Optional[int]

    duration_seconds: Optional[int]

    detected_object_count: (
        Optional[int]
    )

    processing_duration_seconds: (
        Optional[int]
    )

    tracking_summary: Optional[
        dict
    ]

    created_at: datetime

    updated_at: datetime

    started_at: Optional[
        datetime
    ]

    completed_at: Optional[
        datetime
    ]

    model_config = ConfigDict(
        from_attributes=True
    )