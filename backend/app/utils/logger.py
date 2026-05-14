import logging
import sys
from pathlib import (
    Path,
)


# =========================
# Log Directory
# =========================

LOG_DIR = Path("logs")

LOG_DIR.mkdir(
    parents=True,
    exist_ok=True,
)

LOG_FILE = (
    LOG_DIR / "application.log"
)


# =========================
# Logging Configuration
# =========================

logging.basicConfig(

    level=logging.INFO,

    format=(
        "%(asctime)s | "
        "%(levelname)s | "
        "%(name)s | "
        "%(message)s"
    ),

    handlers=[

        logging.StreamHandler(
            sys.stdout
        ),

        logging.FileHandler(
            LOG_FILE,
            encoding="utf-8",
        ),
    ],
)


# =========================
# Global Logger
# =========================

logger = logging.getLogger(
    "workflow_system"
)

logger.setLevel(
    logging.INFO
)