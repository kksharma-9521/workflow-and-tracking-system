FROM python:3.11-slim

# =========================
# Environment
# =========================

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1


# =========================
# System Dependencies
# =========================

RUN apt-get update && apt-get install -y \
    ffmpeg \
    libsm6 \
    libxext6 \
    && rm -rf /var/lib/apt/lists/*


# =========================
# Working Directory
# =========================

WORKDIR /app


# =========================
# Copy Requirements
# =========================

COPY requirements.txt .


# =========================
# Install Dependencies
# =========================

RUN pip install --no-cache-dir -r requirements.txt


# =========================
# Copy Project
# =========================

COPY . .


# =========================
# Expose Port
# =========================

EXPOSE 8000


# =========================
# Start Application
# =========================

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]