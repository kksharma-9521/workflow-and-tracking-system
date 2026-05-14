# =========================
# Create Virtual Environment
# =========================

python -m venv venv


# =========================
# Activate Virtual Environment
# =========================

# Windows
venv\Scripts\activate

# Linux / Mac
source venv/bin/activate


# =========================
# Install Dependencies
# =========================

pip install -r requirements.txt


# =========================
# Start Redis
# =========================

docker run -d -p 6380:6379 redis


# =========================
# Start FastAPI
# =========================

npm run dev


# =========================
# Start Celery Worker
# =========================

celery -A app.core.celery_app worker --pool=solo --loglevel=info