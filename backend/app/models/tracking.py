from sqlalchemy import (
    Column,
    Float,
    ForeignKey,
    Integer,
    String,
)

from app.core.database import Base


class TrackedEntity(Base):

    __tablename__ = (
        "tracked_entities"
    )

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    job_id = Column(
    Integer,
        ForeignKey(
            "video_jobs.id"
        ),
    )

    tracking_id = Column(
        Integer,
        index=True,
    )

    first_seen = Column(
        String
    )

    confidence = Column(
        Float
    )

    status = Column(
        String
    )


class TrackingFrame(Base):

    __tablename__ = (
        "tracking_frames"
    )

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    job_id = Column(
        Integer,
        ForeignKey(
            "video_jobs.id"
        ),
    )

    timestamp = Column(
        Float,
        index=True,
    )

    tracking_id = Column(
        Integer
    )

    x = Column(Float)

    y = Column(Float)

    width = Column(Float)

    height = Column(Float)

    confidence = Column(
        Float
    )