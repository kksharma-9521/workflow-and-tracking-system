from collections import defaultdict

from fastapi import (
    APIRouter,
    Depends,
)

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.models.tracking import (
    TrackedEntity,
    TrackingFrame,
)


router = APIRouter(
    prefix="/jobs",
    tags=["Tracking"],
)


@router.get(
    "/{job_id}/tracking"
)
async def get_tracking_frames(
    job_id: str,
    db: Session = Depends(get_db),
):

    """
    Database-backed
    tracking frame retrieval
    """

    frames = (
        db.query(
            TrackingFrame
        )
        .filter(
            TrackingFrame.job_id
            == job_id
        )
        .all()
    )

    grouped_frames = defaultdict(
        list
    )

    for frame in frames:

        grouped_frames[
            frame.timestamp
        ].append({

            "id":
                frame.tracking_id,

            "x":
                frame.x,

            "y":
                frame.y,

            "width":
                frame.width,

            "height":
                frame.height,

            "confidence":
                frame.confidence,
        })

    response = []

    for (
        timestamp,
        boxes
    ) in grouped_frames.items():

        response.append({

            "timestamp":
                timestamp,

            "boxes":
                boxes,
        })

    return response


@router.get(
    "/{job_id}/identities"
)
async def get_identities(
    job_id: str,
    db: Session = Depends(get_db),
):

    """
    Database-backed
    persistent identity retrieval
    """

    identities = (
        db.query(
            TrackedEntity
        )
        .filter(
            TrackedEntity.job_id
            == job_id
        )
        .all()
    )

    return [

        {
            "id":
                identity.id,

            "tracking_id":
                identity.tracking_id,

            "first_seen":
                identity.first_seen,

            "confidence":
                identity.confidence,

            "status":
                identity.status,
        }

        for identity
        in identities
    ]