from fastapi import (
    APIRouter,
    Depends,
    Query,
)

from sqlalchemy.orm import (
    Session,
)

from app.core.database import (
    get_db,
)

from app.services.export_service import (
    export_documents_csv_service,
    export_documents_json_service,
)


router = APIRouter(
    prefix="/exports",
    tags=["Exports"],
)


# =========================
# Export JSON
# =========================

@router.get(
    "/documents/json",
)
def export_documents_json(
    finalized_only: bool = Query(
        default=True,
    ),
    db: Session = Depends(get_db),
):

    return (
        export_documents_json_service(
            finalized_only=(
                finalized_only
            ),
            db=db,
        )
    )


# =========================
# Export CSV
# =========================

@router.get(
    "/documents/csv",
)
def export_documents_csv(
    finalized_only: bool = Query(
        default=True,
    ),
    db: Session = Depends(get_db),
):

    return (
        export_documents_csv_service(
            finalized_only=(
                finalized_only
            ),
            db=db,
        )
    )