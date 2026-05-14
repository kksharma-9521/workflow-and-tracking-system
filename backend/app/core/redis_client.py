import redis

from app.core.config import (
    settings,
)

from app.utils.logger import (
    logger,
)


# =========================
# Redis Client
# =========================

try:

    redis_client = (
        redis.Redis.from_url(
            settings.redis_url,
            decode_responses=True,
        )
    )

    redis_client.ping()

    logger.info(
        "Redis connected"
    )

except Exception as exc:

    logger.error(
        f"Redis connection "
        f"failed: {str(exc)}"
    )

    raise exc