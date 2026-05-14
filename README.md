# Async AI Workflow and Multi-Object Tracking System

Production-grade backend system for:

- asynchronous document processing
- real-time progress tracking
- multi-object detection and persistent ID tracking
- AI-powered video analytics
- scalable workflow orchestration

Built using:

- FastAPI
- Celery
- Redis
- PostgreSQL
- YOLOv8
- ByteTrack
- OpenCV

---

# Features

## Document Processing Pipeline

- asynchronous background processing
- Redis pub/sub progress updates
- Server-Sent Events (SSE)
- retry workflow support
- duplicate detection using SHA256 checksum
- finalized/reviewed workflow
- CSV and JSON exports
- pagination and filtering
- centralized service architecture

---

## Multi-Object Tracking Pipeline

- YOLOv8 object detection
- ByteTrack persistent ID tracking
- trajectory visualization
- adaptive frame skipping
- GPU/CPU auto device selection
- analytics generation
- optimized inference pipeline
- processing metrics collection
- robust frame failure handling

---

# System Architecture

```text
Client
   |
   v
FastAPI API Layer
   |
   +----------------------+
   |                      |
   v                      v
Document Services     Video Services
   |                      |
   v                      v
Celery Workers       YOLO Tracking Pipeline
   |                      |
   v                      v
Redis Pub/Sub        OpenCV + ByteTrack
   |
   v
SSE Streaming
```

---

# Project Structure

```text
backend/
│
├── app/
│   ├── api/
│   │   ├── document_routes.py
│   │   ├── export_routes.py
│   │   ├── progress_routes.py
│   │   └── video_routes.py
│   │
│   ├── core/
│   │   ├── celery_app.py
│   │   ├── config.py
│   │   ├── database.py
│   │   └── redis_client.py
│   │
│   ├── models/
│   │   ├── document.py
│   │   ├── enums.py
│   │   └── video_job.py
│   │
│   ├── schemas/
│   │   ├── document_schema.py
│   │   ├── video_schema.py
│   │   └── common_schema.py
│   │
│   ├── services/
│   │   ├── document_service.py
│   │   ├── export_service.py
│   │   ├── progress_service.py
│   │   ├── stream_service.py
│   │   ├── tracking_service.py
│   │   └── video_service.py
│   │
│   ├── workers/
│   │   ├── document_tasks.py
│   │   └── video_tasks.py
│   │
│   ├── utils/
│   │   ├── logger.py
│   │   ├── file_utils.py
│   │   ├── video_utils.py
│   │   └── image_utils.py
│   │
│   └── main.py
│
├── uploads/
├── outputs/
├── logs/
├── tests/
├── requirements.txt
├── README.md
└── TECHNICAL_REPORT.md
```

---

# Technology Stack

| Layer | Technology |
|---|---|
| API Framework | FastAPI |
| Background Workers | Celery |
| Message Broker | Redis |
| Database | PostgreSQL |
| AI Detection | YOLOv8 |
| Tracking | ByteTrack |
| Video Processing | OpenCV |
| ORM | SQLAlchemy |
| Realtime Streaming | SSE |
| Validation | Pydantic |

---

# Installation

## 1. Clone Repository

```bash
git clone <repository_url>
cd workflow-and-tracking-system/backend
```

---

## 2. Create Virtual Environment

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### Linux / Mac

```bash
python3 -m venv venv
source venv/bin/activate
```

---

## 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

# Environment Variables

Create `.env`

```env
APP_NAME=Async Document Processing Workflow System
APP_ENV=development
DEBUG=true

POSTGRES_USER=postgres
POSTGRES_PASSWORD=1722
POSTGRES_DB=doc_db
POSTGRES_PORT=5432

DATABASE_URL=postgresql://postgres:1722@localhost:5432/doc_db

REDIS_HOST=localhost
REDIS_PORT=6380
REDIS_DB=0

REDIS_URL=redis://localhost:6380/0

CELERY_APP_NAME=document_processor
CELERY_BROKER_URL=redis://localhost:6380/0
CELERY_RESULT_BACKEND=redis://localhost:6380/0

UPLOAD_DIR=uploads
PROGRESS_CHANNEL=progress

ALLOWED_ORIGINS=http://localhost:3000

VIDEO_RESIZE_WIDTH=1280
VIDEO_RESIZE_HEIGHT=720

FRAME_SKIP_INTERVAL=2

YOLO_MODEL_NAME=yolov8n.pt
```

---

# Run Redis

```bash
docker run -d -p 6380:6379 redis
```

---

# Run FastAPI

```bash
uvicorn app.main:app --reload
```

API:

```text
http://127.0.0.1:8000
```

Swagger Docs:

```text
http://127.0.0.1:8000/docs
```

---

# Run Celery Worker

```bash
celery -A app.core.celery_app worker --pool=solo --loglevel=info
```

---

# Document Workflow

## Upload Document

```http
POST /api/documents/upload
```

Features:

- async processing
- duplicate detection
- realtime progress events
- retry workflow
- export support

---

## Progress Streaming

```http
GET /api/progress/stream
```

Uses:

- Redis Pub/Sub
- Server-Sent Events

---

## Export Data

### JSON Export

```http
GET /api/export/documents/json
```

### CSV Export

```http
GET /api/export/documents/csv
```

---

# Video Tracking Workflow

## Upload Video

```http
POST /api/videos/upload
```

Pipeline:

1. Upload video
2. Queue Celery task
3. YOLO detection
4. ByteTrack tracking
5. Persistent ID assignment
6. Trajectory rendering
7. Analytics generation
8. Output video generation

---

# Tracking Optimizations

## Inference Optimizations

- adaptive frame skipping
- resized inference resolution
- GPU auto-detection
- model warmup
- ByteTrack persistence
- trajectory memory limits

---

## Stability Improvements

- corrupted frame recovery
- bounded trajectory history
- retry-safe task handling
- processing analytics logging
- structured failure handling

---

# Tracking Analytics

Generated analytics include:

- total frames
- processed frames
- skipped frames
- failed frames
- average inference time
- effective processing FPS
- detected object count
- processing duration
- device used (CPU/GPU)

---

# Example Output

Annotated video includes:

- bounding boxes
- persistent tracking IDs
- movement trajectories
- tracked player movement

---

# Design Decisions

## Why YOLOv8?

Selected because:

- strong realtime performance
- excellent community support
- optimized inference
- robust object detection

---

## Why ByteTrack?

Selected because:

- stable ID persistence
- strong occlusion handling
- good performance in sports footage
- lightweight tracking overhead

---

## Why Celery + Redis?

Selected because:

- asynchronous scalability
- distributed task execution
- realtime progress updates
- worker isolation

---

# Performance Optimizations

| Optimization | Benefit |
|---|---|
| Frame skipping | lower compute cost |
| Resize inference | faster processing |
| Trajectory memory limits | reduced RAM usage |
| SSE streaming | realtime UX |
| Duplicate detection | prevents wasted processing |
| Async workers | scalable processing |
| Retry workflows | operational stability |

---

# Failure Handling

The system supports:

- retry-safe Celery tasks
- frame-level error recovery
- Redis publish protection
- database rollback protection
- worker crash resilience

---

# Future Improvements

Potential future enhancements:

- DeepSORT integration
- TensorRT acceleration
- WebSocket streaming
- multi-camera tracking
- team classification
- heatmap analytics
- speed estimation
- Docker deployment
- Kubernetes scaling

---

# Public Video Source

Example public sports footage used:

```text
https://www.youtube.com/
```

---

# Demo

The demo includes:

- API walkthrough
- async processing pipeline
- realtime SSE updates
- tracking workflow
- analytics generation
- processed output video

---

# Author

Krishna Kant Sharma