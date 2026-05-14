from datetime import (
    datetime,
    timezone,
)

from sqlalchemy import (
    Boolean,
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
    DocumentStatus,
    ProcessingStage,
)


# =========================
# UTC Helper
# =========================

def utc_now():

    return datetime.now(
        timezone.utc
    )


# =========================
# Document Model
# =========================

class Document(Base):

    __tablename__ = "documents"

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
    # File Metadata
    # =====================

    original_filename: (
        Mapped[str | None]
    ) = mapped_column(
        String(255),
        nullable=True,
    )

    stored_filename: (
        Mapped[str | None]
    ) = mapped_column(
        String(255),
        nullable=True,
        unique=True,
    )

    file_path: Mapped[
        str | None
    ] = mapped_column(
        Text,
        nullable=True,
    )

    file_type: Mapped[
        str | None
    ] = mapped_column(
        String(50),
        nullable=True,
    )

    mime_type: Mapped[
        str | None
    ] = mapped_column(
        String(255),
        nullable=True,
    )

    file_size_bytes: (
        Mapped[int]
    ) = mapped_column(
        Integer,
        default=0,
    )

    file_checksum: (
        Mapped[str | None]
    ) = mapped_column(
        String(64),
        nullable=True,
        unique=True,
        index=True,
    )

    # =====================
    # Workflow State
    # =====================

    status: Mapped[str] = (
        mapped_column(
            String(50),
            default=(
                DocumentStatus
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

    current_stage: (
        Mapped[str]
    ) = mapped_column(
        String(100),
        default=(
            ProcessingStage
            .DOCUMENT_RECEIVED
            .value
        ),
    )

    celery_task_id: (
        Mapped[str | None]
    ) = mapped_column(
        String(255),
        nullable=True,
        index=True,
    )

    retry_count: Mapped[
        int
    ] = mapped_column(
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
    # AI Results
    # =====================

    result: Mapped[
        dict | None
    ] = mapped_column(
        JSON,
        nullable=True,
    )

    reviewed_result: (
        Mapped[dict | None]
    ) = mapped_column(
        JSON,
        nullable=True,
    )

    finalized: Mapped[
        bool
    ] = mapped_column(
        Boolean,
        default=False,
        index=True,
    )

    finalized_at: (
        Mapped[datetime | None]
    ) = mapped_column(
        DateTime(
            timezone=True
        ),
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

    failed_at: (
        Mapped[
            datetime | None
        ]
    ) = mapped_column(
        DateTime(
            timezone=True
        ),
        nullable=True,
    )