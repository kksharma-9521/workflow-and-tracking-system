from app.core.database import (
    Base,
    engine,
)

from app.models.document import (
    Document,
)

from app.models.video_job import (
    VideoJob,
)


# =========================
# Create Tables
# =========================

def init_database():

    Base.metadata.create_all(
        bind=engine
    )

    print(
        "Database tables created"
    )


if __name__ == "__main__":

    init_database()