from sqlalchemy import (
    create_engine,
)

from sqlalchemy.orm import (
    declarative_base,
    sessionmaker,
)

from app.core.config import (
    settings,
)

DATABASE_URL = (
    settings.database_url
)

engine = create_engine(
    DATABASE_URL
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()


# IMPORTANT:
# register models

import app.models.video_job  # noqa

import app.models.tracking  # noqa


Base.metadata.create_all(
    bind=engine
)