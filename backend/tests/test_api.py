import requests
import time


BASE_URL = (
    "http://127.0.0.1:8000"
)


# =========================
# Health Check
# =========================

response = requests.get(
    f"{BASE_URL}/health"
)

print(
    "Health Check:",
    response.status_code,
)

print(response.json())


# =========================
# List Video Jobs
# =========================

response = requests.get(
    f"{BASE_URL}/api/videos/"
)

print(
    "\nVideo Jobs:",
    response.status_code,
)

print(response.json())


# =========================
# List Documents
# =========================

response = requests.get(
    f"{BASE_URL}/api/documents/"
)

print(
    "\nDocuments:",
    response.status_code,
)

print(response.json())


# =========================
# Poll Example
# =========================

print(
    "\nPolling example..."
)

for _ in range(5):

    response = requests.get(
        f"{BASE_URL}/health"
    )

    print(
        response.json()
    )

    time.sleep(1)