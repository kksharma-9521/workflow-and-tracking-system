from sqlalchemy.orm import Session

from app.models.tracking import (
    TrackedEntity,
    TrackingFrame,
)


def create_tracking_frame(
    db: Session,

    *,
    job_id: str,

    timestamp: float,

    tracking_id: int,

    x: float,

    y: float,

    width: float,

    height: float,

    confidence: float,
):

    frame = TrackingFrame(

        job_id=job_id,

        timestamp=timestamp,

        tracking_id=tracking_id,

        x=x,

        y=y,

        width=width,

        height=height,

        confidence=confidence,
    )

    db.add(frame)

    return frame


def create_tracked_entity(
    db: Session,

    *,
    job_id: str,

    tracking_id: int,

    first_seen: str,

    confidence: float,

    status: str,
):

    entity = TrackedEntity(

        job_id=job_id,

        tracking_id=tracking_id,

        first_seen=first_seen,

        confidence=confidence,

        status=status,
    )

    db.add(entity)

    return entity

def bulk_create_tracking_frames(
    db: Session,
    frames: list,
):

    db.bulk_save_objects(
        frames
    )

    db.commit()


def bulk_create_entities(
    db: Session,
    entities: list,
):

    db.bulk_save_objects(
        entities
    )

    db.commit()
