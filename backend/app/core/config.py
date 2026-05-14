import os
from dataclasses import (
    dataclass,
)

from pathlib import (
    Path,
)

from typing import (
    List,
)

from dotenv import (
    load_dotenv,
)


# =========================
# Base Directory
# =========================

BASE_DIR = (
    Path(__file__)
    .resolve()
    .parent
    .parent
    .parent
)

ENV_FILE = (
    BASE_DIR / ".env"
)

load_dotenv(
    ENV_FILE
)


# =========================
# Required Env Loader
# =========================

def require_env(
    name: str,
) -> str:

    value = os.getenv(
        name
    )

    if (
        value is None
        or value.strip() == ""
    ):

        raise RuntimeError(
            f"Missing required "
            f"environment variable: "
            f"{name}"
        )

    return value


# =========================
# Settings
# =========================

@dataclass
class Settings:

    # =====================
    # App
    # =====================

    app_name: str

    app_env: str

    debug: bool

    # =====================
    # Database
    # =====================

    database_url: str

    # =====================
    # Redis
    # =====================

    redis_url: str

    progress_channel: str

    # =====================
    # Celery
    # =====================

    celery_app_name: str

    celery_broker_url: str

    celery_result_backend: str

    # =====================
    # Uploads
    # =====================

    upload_dir: Path

    # =====================
    # CORS
    # =====================

    allowed_origins: List[
        str
    ]

    # =====================
    # Video Processing
    # =====================

    video_resize_width: int

    video_resize_height: int

    frame_skip_interval: int

    max_tracking_history: int

    tracking_confidence: float

    tracking_iou_threshold: float

    yolo_model_name: str


# =========================
# Load Settings
# =========================

settings = Settings(

    # =====================
    # App
    # =====================

    app_name=require_env(
        "APP_NAME"
    ),

    app_env=require_env(
        "APP_ENV"
    ),

    debug=(
        require_env(
            "DEBUG"
        ).lower()
        == "true"
    ),

    # =====================
    # Database
    # =====================

    database_url=require_env(
        "DATABASE_URL"
    ),

    # =====================
    # Redis
    # =====================

    redis_url=require_env(
        "REDIS_URL"
    ),

    progress_channel=require_env(
        "PROGRESS_CHANNEL"
    ),

    # =====================
    # Celery
    # =====================

    celery_app_name=require_env(
        "CELERY_APP_NAME"
    ),

    celery_broker_url=require_env(
        "CELERY_BROKER_URL"
    ),

    celery_result_backend=require_env(
        "CELERY_RESULT_BACKEND"
    ),

    # =====================
    # Uploads
    # =====================

    upload_dir=Path(
        require_env(
            "UPLOAD_DIR"
        )
    ),

    # =====================
    # CORS
    # =====================

    allowed_origins=(
        require_env(
            "ALLOWED_ORIGINS"
        ).split(",")
    ),

    # =====================
    # Video Processing
    # =====================

    video_resize_width=int(
        require_env(
            "VIDEO_RESIZE_WIDTH"
        )
    ),

    video_resize_height=int(
        require_env(
            "VIDEO_RESIZE_HEIGHT"
        )
    ),

    frame_skip_interval=int(
        require_env(
            "FRAME_SKIP_INTERVAL"
        )
    ),

    max_tracking_history=int(
        require_env(
            "MAX_TRACKING_HISTORY"
        )
    ),

    tracking_confidence=float(
        require_env(
            "TRACKING_CONFIDENCE"
        )
    ),

    tracking_iou_threshold=float(
        require_env(
            "TRACKING_IOU_THRESHOLD"
        )
    ),

    yolo_model_name=require_env(
        "YOLO_MODEL_NAME"
    ),
)