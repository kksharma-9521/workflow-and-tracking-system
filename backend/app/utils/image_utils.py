import cv2
import numpy as np


# =========================
# Draw Bounding Box
# =========================

def draw_bounding_box(
    frame,
    *,
    x1: int,
    y1: int,
    x2: int,
    y2: int,
    label: str,
    color=(0, 255, 0),
):

    cv2.rectangle(
        frame,
        (x1, y1),
        (x2, y2),
        color,
        2,
    )

    cv2.putText(
        frame,
        label,
        (x1, y1 - 10),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.6,
        color,
        2,
    )

    return frame


# =========================
# Draw Center Point
# =========================

def draw_center_point(
    frame,
    *,
    center_x: int,
    center_y: int,
    color=(0, 255, 0),
):

    cv2.circle(
        frame,
        (center_x, center_y),
        4,
        color,
        -1,
    )

    return frame


# =========================
# Draw Trajectory
# =========================

def draw_trajectory(
    frame,
    *,
    points: list,
    color=(0, 255, 0),
):

    if len(points) < 2:
        return frame

    for i in range(
        1,
        len(points),
    ):

        cv2.line(
            frame,
            points[i - 1],
            points[i],
            color,
            2,
        )

    return frame


# =========================
# Generate Heatmap
# =========================

def generate_heatmap(
    *,
    frame_shape,
    tracking_points: list,
):

    heatmap = np.zeros(
        frame_shape[:2],
        dtype=np.float32,
    )

    for (
        x,
        y,
    ) in tracking_points:

        cv2.circle(
            heatmap,
            (x, y),
            20,
            1,
            -1,
        )

    heatmap = cv2.GaussianBlur(
        heatmap,
        (51, 51),
        0,
    )

    normalized = cv2.normalize(
        heatmap,
        None,
        0,
        255,
        cv2.NORM_MINMAX,
    )

    return normalized.astype(
        np.uint8
    )