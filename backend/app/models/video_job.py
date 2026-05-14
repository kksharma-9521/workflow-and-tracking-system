from datetime import (
    datetime,
    timezone,
)

from sqlalchemy import (
    DateTime,
    Integer,
    JSON,
    String,
    Text,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
)

from app.core.database import (
    Base,
)

from app.models.enums import (
    VideoJobStatus,
)


# =========================
# UTC Helper
# =========================

def utc_now():

    return datetime.now(
        timezone.utc
    )


# =========================
# Video Job Model
# =========================

class VideoJob(Base):

    __tablename__ = "video_jobs"

    # =====================
    # Identity
    # =====================

    id: Mapped[int] = (
        mapped_column(
            primary_key=True,
            index=True,
        )
    )

    # =====================
    # Video Metadata
    # =====================

    original_filename: (
        Mapped[str]
    ) = mapped_column(
        String(255),
        nullable=False,
    )

    stored_filename: (
        Mapped[str]
    ) = mapped_column(
        String(255),
        nullable=False,
        unique=True,
    )

    input_path: Mapped[
        str
    ] = mapped_column(
        Text,
        nullable=False,
    )

    output_path: Mapped[
        str | None
    ] = mapped_column(
        Text,
        nullable=True,
    )

    file_size_bytes: (
        Mapped[int | None]
    ) = mapped_column(
        Integer,
        nullable=True,
    )

    # =====================
    # Processing State
    # =====================

    status: Mapped[str] = (
        mapped_column(
            String(50),
            default=(
                VideoJobStatus
                .QUEUED
                .value
            ),
            index=True,
        )
    )

    progress: Mapped[int] = (
        mapped_column(
            Integer,
            default=0,
        )
    )

    celery_task_id: (
        Mapped[str | None]
    ) = mapped_column(
        String(255),
        nullable=True,
        index=True,
    )

    retry_count: (
        Mapped[int]
    ) = mapped_column(
        Integer,
        default=0,
    )

    error_message: (
        Mapped[str | None]
    ) = mapped_column(
        Text,
        nullable=True,
    )

    # =====================
    # Analytics
    # =====================

    fps: Mapped[
        int | None
    ] = mapped_column(
        Integer,
        nullable=True,
    )

    frame_count: (
        Mapped[int | None]
    ) = mapped_column(
        Integer,
        nullable=True,
    )

    duration_seconds: (
        Mapped[int | None]
    ) = mapped_column(
        Integer,
        nullable=True,
    )

    detected_object_count: (
        Mapped[int | None]
    ) = mapped_column(
        Integer,
        nullable=True,
    )

    processing_duration_seconds: (
        Mapped[int | None]
    ) = mapped_column(
        Integer,
        nullable=True,
    )

    tracking_summary: (
        Mapped[dict | None]
    ) = mapped_column(
        JSON,
        nullable=True,
    )

    # =====================
    # Audit Timestamps
    # =====================

    created_at: (
        Mapped[datetime]
    ) = mapped_column(
        DateTime(
            timezone=True
        ),
        default=utc_now,
        index=True,
    )

    updated_at: (
        Mapped[datetime]
    ) = mapped_column(
        DateTime(
            timezone=True
        ),
        default=utc_now,
        onupdate=utc_now,
    )

    started_at: (
        Mapped[
            datetime | None
        ]
    ) = mapped_column(
        DateTime(
            timezone=True
        ),
        nullable=True,
    )

    completed_at: (
        Mapped[
            datetime | None
        ]
    ) = mapped_column(
        DateTime(
            timezone=True
        ),
        nullable=True,
    )