import os

from app.services.tracking_service import (
    process_video,
)


# =========================
# Input / Output
# =========================

INPUT_VIDEO = (
    "uploads/videos/sample.mp4"
)

OUTPUT_VIDEO = (
    "outputs/test_output.mp4"
)


# =========================
# Ensure Output Directory
# =========================

os.makedirs(
    "outputs",
    exist_ok=True,
)


# =========================
# Run Tracking
# =========================

summary = process_video(
    input_path=INPUT_VIDEO,
    output_path=OUTPUT_VIDEO,
)


# =========================
# Print Analytics
# =========================

print("\nTracking Summary\n")

for (
    key,
    value,
) in summary.items():

    print(
        f"{key}: {value}"
    )