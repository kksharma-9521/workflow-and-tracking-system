from celery import (
    Celery,
)

from app.core.config import (
    settings,
)

from app.api.tracking_db import (
    bulk_create_entities,
    bulk_create_tracking_frames,
)


celery_app = Celery(

    settings.celery_app_name,

    broker=(
        settings
        .celery_broker_url
    ),

    backend=(
        settings
        .celery_result_backend
    ),

    include=[

        "app.workers.document_tasks",

        "app.workers.video_tasks",
    ],
)


# =========================
# Celery Configuration
# =========================

celery_app.conf.update(

    task_serializer="json",

    accept_content=["json"],

    result_serializer="json",

    timezone="UTC",

    enable_utc=True,

    task_track_started=True,

    task_time_limit=3600,

    task_soft_time_limit=3300,

    worker_prefetch_multiplier=1,

    task_acks_late=True,

    broker_connection_retry_on_startup=True,
)