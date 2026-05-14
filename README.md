## Live Demo

Frontend Deployment:
https://YOUR-VERCEL-URL.vercel.app

# AI Workflow and Multi-Object Tracking System

A production-style AI-powered workflow orchestration platform that combines:

- Real-time multi-object video tracking
- Async document processing pipelines
- Celery-based background task orchestration
- Realtime progress monitoring
- AI-driven analytics workflows

Built using FastAPI, React, PostgreSQL, Redis, Celery, and YOLOv8.

---

# Features

## Video Tracking Pipeline

- YOLOv8 object detection
- Multi-object tracking
- Async video processing
- Realtime tracking progress
- Processed video generation
- Persistent job storage
- Analytics dashboard

---

## Document Workflow Pipeline

- Async document upload
- PDF parsing
- DOCX parsing
- Keyword extraction
- Summary generation
- Category classification
- Realtime workflow stages
- Persistent processing history

---

## Dashboard Features

- Live workflow monitoring
- Queue tracking
- System metrics
- Realtime activity feed
- Job progress tracking
- Processed asset management

---

# Tech Stack

## Backend

- FastAPI
- PostgreSQL
- SQLAlchemy
- Redis
- Celery
- OpenCV
- YOLOv8

---

## Frontend

- React
- TypeScript
- TailwindCSS
- Recharts
- Axios

---

# System Architecture

```text
Frontend (React)
        ↓
FastAPI Backend
        ↓
Redis Queue
        ↓
Celery Workers
        ↓
AI Processing Services
        ↓
PostgreSQL Storage