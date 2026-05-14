# Technical Report  
## Async AI Workflow and Multi-Object Tracking System

Author: KK Sharma

---

# 1. Introduction

This project is a production-oriented asynchronous AI processing platform designed for:

- document workflow orchestration
- real-time progress tracking
- multi-object detection
- persistent ID tracking in sports/event videos
- scalable AI backend processing

The system combines:

- FastAPI
- Celery
- Redis
- PostgreSQL
- YOLOv8
- ByteTrack
- OpenCV

to create a modular and scalable backend architecture capable of handling asynchronous AI workloads efficiently.

---

# 2. Problem Statement

The objective of the tracking pipeline is to:

- detect multiple moving subjects in video footage
- assign unique persistent IDs
- maintain tracking consistency across frames
- handle real-world conditions including:
  - occlusion
  - motion blur
  - camera motion
  - overlapping subjects
  - scale variation

The system also needed to provide:

- asynchronous processing
- realtime progress updates
- analytics generation
- scalable backend orchestration

---

# 3. System Architecture

The backend follows a layered architecture pattern.

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
Realtime SSE Streams
```

---

# 4. Technology Stack

| Component | Technology |
|---|---|
| API Framework | FastAPI |
| Async Workers | Celery |
| Broker | Redis |
| Database | PostgreSQL |
| Detection Model | YOLOv8 |
| Tracking Algorithm | ByteTrack |
| Video Processing | OpenCV |
| ORM | SQLAlchemy |
| Streaming | SSE |
| Validation | Pydantic |

---

# 5. Detection Model Selection

## YOLOv8

YOLOv8 was selected because:

- strong realtime detection performance
- lightweight inference
- efficient GPU/CPU execution
- strong community ecosystem
- optimized inference pipeline
- high-quality object localization

The model was configured specifically for sports/person tracking.

### Advantages

- fast inference speed
- high FPS capability
- good accuracy-performance tradeoff
- production-friendly deployment

---

# 6. Tracking Algorithm Selection

## ByteTrack

ByteTrack was selected because:

- strong ID persistence
- good occlusion handling
- lightweight tracking overhead
- stable performance in crowded scenes
- effective multi-object association

Compared to simpler centroid trackers, ByteTrack performs significantly better in sports footage where players frequently overlap and move rapidly.

---

# 7. Persistent ID Strategy

Persistent IDs are maintained using:

- ByteTrack association logic
- trajectory history tracking
- tracking persistence between frames
- bounded memory trajectory storage

The system stores movement history using:

```python
deque(maxlen=N)
```

instead of unlimited lists to prevent memory growth during long video processing sessions.

---

# 8. Video Processing Pipeline

The video processing workflow is:

1. upload video
2. save metadata
3. queue Celery task
4. initialize tracking pipeline
5. load YOLO model
6. process frames
7. detect subjects
8. assign persistent IDs
9. render trajectories
10. generate analytics
11. save output video

---

# 9. Backend Workflow Design

The backend uses asynchronous task orchestration.

## Why Async Processing?

Video processing is computationally expensive.

Using Celery workers provides:

- non-blocking API responses
- scalable processing
- worker isolation
- retry handling
- distributed execution capability

Redis was used as:

- Celery broker
- pub/sub event layer
- realtime progress transport

---

# 10. Realtime Progress Tracking

Realtime progress updates are implemented using:

- Redis Pub/Sub
- Server-Sent Events (SSE)

This allows clients to receive live updates during long-running tasks.

### Advantages

- lightweight realtime communication
- low frontend polling overhead
- scalable streaming architecture

---

# 11. Performance Optimizations

Several optimizations were implemented to reduce compute cost and improve throughput.

---

## 11.1 Adaptive Frame Skipping

Instead of processing every frame:

```python
if frame_count % FRAME_SKIP_INTERVAL != 0:
    continue
```

This reduces:

- GPU usage
- CPU usage
- processing time

while maintaining acceptable tracking quality.

---

## 11.2 Resize Inference

Frames are resized before inference:

```python
1280x720
```

instead of full-resolution processing.

Benefits:

- lower inference latency
- reduced memory usage
- higher throughput

---

## 11.3 GPU/CPU Auto Selection

The system automatically selects:

- CUDA GPU if available
- CPU fallback otherwise

This improves deployment flexibility.

---

## 11.4 Model Warmup

A warmup inference is executed during initialization to reduce first-frame latency spikes.

---

## 11.5 Trajectory Memory Limits

Trajectory history uses bounded deques:

```python
deque(maxlen=MAX_HISTORY)
```

to prevent memory growth in long videos.

---

# 12. Analytics Generation

The system generates operational analytics including:

- total frames
- processed frames
- skipped frames
- failed frames
- processing duration
- average inference time
- effective processing FPS
- detected object count
- device used

These analytics help evaluate:

- inference efficiency
- throughput
- tracking performance

---

# 13. Failure Handling

The system includes multiple failure-handling mechanisms.

## Frame-Level Recovery

Corrupted frames are skipped instead of crashing the worker.

## Celery Retry Handling

Failed tasks automatically retry using exponential backoff.

## Redis Failure Protection

Redis publishing errors are safely logged.

## Database Protection

Transactions are isolated using SQLAlchemy sessions.

---

# 14. Scalability Considerations

The architecture was designed for scalability.

## Horizontal Scaling

Celery workers can scale independently.

## API Scalability

FastAPI handles lightweight async API requests efficiently.

## Processing Isolation

Heavy inference workloads are separated from API execution.

## Streaming Scalability

SSE reduces repeated frontend polling requests.

---

# 15. Security and Operational Improvements

The system includes:

- filename sanitization
- upload validation
- duplicate detection using SHA256
- controlled export handling
- centralized logging

Internal filesystem paths are not exposed publicly.

---

# 16. Challenges Faced

Several challenges were encountered during implementation.

## ID Switching

Rapid player movement caused occasional ID instability.

### Solution

- ByteTrack persistence
- trajectory history stabilization

---

## Long Video Processing Time

High-resolution videos created slow inference.

### Solution

- adaptive frame skipping
- resized inference
- lightweight YOLO model selection

---

## Memory Usage

Trajectory tracking could grow indefinitely.

### Solution

- bounded deque storage

---

# 17. Failure Cases

Some limitations still exist.

## Current Limitations

- extreme occlusion may still cause ID switches
- similar-looking subjects can occasionally swap IDs
- CPU-only systems process videos slower
- crowded scenes reduce tracking stability

---

# 18. Future Improvements

Potential future enhancements include:

- DeepSORT integration
- TensorRT acceleration
- team classification
- heatmap analytics
- speed estimation
- WebSocket streaming
- Docker deployment
- Kubernetes scaling
- distributed GPU inference
- multi-camera tracking

---

# 19. Conclusion

This project demonstrates a production-oriented AI backend system capable of:

- asynchronous AI orchestration
- scalable task execution
- realtime progress streaming
- multi-object detection
- persistent ID tracking
- analytics generation
- operational monitoring

The architecture emphasizes:

- modularity
- scalability
- performance optimization
- operational robustness
- maintainability

rather than only basic model inference.

The final system is designed to resemble a real-world AI backend workflow.