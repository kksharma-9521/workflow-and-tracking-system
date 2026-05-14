from celery import Celery

from .config import settings

celery = Celery(
    settings.celery_app_name,
    broker=settings.celery_broker_url,
    backend=settings.celery_result_backend,
    include=["app.tasks"],
)
