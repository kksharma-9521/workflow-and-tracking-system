import asyncio
import json

from fastapi import (
    Request,
)

from app.core.config import (
    settings,
)

from app.core.redis_client import (
    redis_client,
)

from app.models.document import (
    Document,
)

from app.utils.logger import (
    logger,
)


# =========================
# SSE Event Generator
# =========================

async def progress_event_stream(
    *,
    request: Request,
    document: Document | None,
):

    pubsub = (
        redis_client.pubsub()
    )

    pubsub.subscribe(
        settings.progress_channel
    )

    logger.info(
        "Client subscribed to "
        "progress stream"
    )

    try:

        while True:

            # =================
            # Client Disconnect
            # =================

            if await (
                request
                .is_disconnected()
            ):

                logger.info(
                    "Client disconnected "
                    "from stream"
                )

                break

            message = (
                pubsub.get_message(
                    ignore_subscribe_messages=True,
                )
            )

            if message:

                try:

                    payload = json.loads(
                        message["data"]
                    )

                    # ============
                    # Filter Single
                    # Document Stream
                    # ============

                    if (
                        document
                        and payload.get(
                            "document_id"
                        )
                        != document.id
                    ):

                        await asyncio.sleep(
                            0.1
                        )

                        continue

                    yield (
                        f"data: "
                        f"{json.dumps(payload)}"
                        f"\n\n"
                    )

                except Exception as exc:

                    logger.error(
                        f"SSE payload error: "
                        f"{str(exc)}"
                    )

            await asyncio.sleep(
                0.1
            )

    finally:

        pubsub.close()

        logger.info(
            "Progress stream closed"
        )