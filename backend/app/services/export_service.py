import csv
import io
import json

from fastapi.responses import (
    Response,
    StreamingResponse,
)

from sqlalchemy.orm import (
    Session,
)

from app.models.document import (
    Document,
)


# =========================
# Get Export Query
# =========================

def get_export_documents_query(
    *,
    db: Session,
    finalized_only: bool,
):

    query = db.query(Document)

    if finalized_only:

        query = query.filter(
            Document.finalized
            == True
        )

    return query.order_by(
        Document.created_at.desc()
    )


# =========================
# Export JSON
# =========================

def export_documents_json_service(
    *,
    finalized_only: bool,
    db: Session,
):

    documents = (
        get_export_documents_query(
            db=db,
            finalized_only=(
                finalized_only
            ),
        )
        .all()
    )

    export_data = []

    for document in documents:

        export_data.append({

            "id":
                document.id,

            "original_filename":
                document.original_filename,

            "status":
                document.status,

            "progress":
                document.progress,

            "current_stage":
                document.current_stage,

            "result":
                document.result,

            "reviewed_result":
                document.reviewed_result,

            "finalized":
                document.finalized,

            "created_at":
                str(
                    document.created_at
                ),

            "completed_at":
                str(
                    document.completed_at
                )
                if (
                    document
                    .completed_at
                )
                else None,
        })

    return Response(
        content=json.dumps(
            export_data,
            indent=2,
            default=str,
        ),
        media_type=(
            "application/json"
        ),
        headers={
            "Content-Disposition":
                (
                    "attachment; "
                    "filename="
                    "documents.json"
                )
        },
    )


# =========================
# Export CSV
# =========================

def export_documents_csv_service(
    *,
    finalized_only: bool,
    db: Session,
):

    documents = (
        get_export_documents_query(
            db=db,
            finalized_only=(
                finalized_only
            ),
        )
        .all()
    )

    output = io.StringIO()

    writer = csv.writer(
        output
    )

    writer.writerow([
        "id",
        "original_filename",
        "status",
        "progress",
        "current_stage",
        "finalized",
        "created_at",
        "completed_at",
    ])

    for document in documents:

        writer.writerow([

            document.id,

            document.original_filename,

            document.status,

            document.progress,

            document.current_stage,

            document.finalized,

            document.created_at,

            document.completed_at,
        ])

    output.seek(0)

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={
            "Content-Disposition":
                (
                    "attachment; "
                    "filename="
                    "documents.csv"
                )
        },
    )