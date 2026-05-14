from contextlib import (
    asynccontextmanager,
)

from app.api.tracking import (
    router as tracking_router,
)

from fastapi import (
    FastAPI,
)

from fastapi.middleware.cors import (
    CORSMiddleware,
)

from app.api.document_routes import (
    router as document_router,
)

from app.api.export_routes import (
    router as export_router,
)

from app.api.progress_routes import (
    router as progress_router,
)

from app.api.video_routes import (
    router as video_router,
)

from app.core.config import (
    settings,
)

from app.core.database import (
    Base,
    engine,
)

from app.api.health import (
    router as health_router,
)

from app.utils.logger import (
    logger,
)

from fastapi.staticfiles import (
    StaticFiles,
)


# =========================
# Application Lifespan
# =========================

@asynccontextmanager
async def lifespan(
    app: FastAPI,
):

    logger.info(
        "Starting application..."
    )

    # =====================
    # Initialize Database
    # =====================

    Base.metadata.create_all(
        bind=engine
    )

    logger.info(
        "Database initialized"
    )

    yield

    logger.info(
        "Shutting down application..."
    )


# =========================
# FastAPI App
# =========================

app = FastAPI(

    
    title=settings.app_name,

    version="1.0.0",

    description=(
        "Production-grade async "
        "AI workflow and "
        "multi-object tracking "
        "platform"
    ),

    lifespan=lifespan,
)


app.mount(

    "/static",

    StaticFiles(
        directory="app/static"
    ),

    name="static",
)


# =========================
# CORS
# =========================

app = FastAPI()

app.add_middleware(

    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# =========================
# Register Routes
# =========================

app.include_router(
    document_router,
    prefix="/api",
)

app.include_router(
    video_router,
    prefix="/api",
)

app.include_router(
    progress_router,
    prefix="/api",
)

app.include_router(
    export_router,
    prefix="/api",
)

app.include_router(
    tracking_router
)

app.include_router(
    health_router
)


# =========================
# Root Endpoint
# =========================

@app.get(
    "/",
    tags=["Health"],
)
def root():

    return {

        "application":
            settings.app_name,

        "environment":
            settings.app_env,

        "status":
            "running",

        "docs":
            "/docs",
    }


# =========================
# Health Check
# =========================

@app.get(
    "/health",
    tags=["Health"],
)
def health_check():

    return {

        "status":
            "healthy",
    }