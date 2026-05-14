import hashlib
from pathlib import (
    Path,
)

from fastapi import (
    HTTPException,
    UploadFile,
)


# =========================
# Allowed Extensions
# =========================

ALLOWED_DOCUMENT_EXTENSIONS = {
    ".pdf",
    ".txt",
    ".doc",
    ".docx",
    ".csv",
    ".json",
}

ALLOWED_VIDEO_EXTENSIONS = {
    ".mp4",
    ".mov",
    ".avi",
    ".mkv",
}


# =========================
# Validate Extension
# =========================

def validate_file_extension(
    *,
    filename: str,
    allowed_extensions: set,
):

    extension = (
        Path(filename)
        .suffix
        .lower()
    )

    if (
        extension
        not in
        allowed_extensions
    ):

        raise HTTPException(
            status_code=400,
            detail=(
                f"Unsupported "
                f"file type: "
                f"{extension}"
            ),
        )

    return extension


# =========================
# Generate SHA256
# =========================

def calculate_file_checksum(
    file_path: Path,
):

    sha256 = hashlib.sha256()

    with file_path.open(
        "rb"
    ) as file:

        for chunk in iter(
            lambda:
            file.read(
                1024 * 1024
            ),
            b"",
        ):

            sha256.update(
                chunk
            )

    return sha256.hexdigest()


# =========================
# Generate Safe Filename
# =========================

def generate_safe_filename(
    filename: str,
):

    path = Path(filename)

    extension = (
        path.suffix
        .lower()
    )

    safe_name = (
        "".join(
            char
            if char.isalnum()
            else "_"
            for char in path.stem
        )
        .strip("_")
    )

    safe_name = (
        safe_name[:80]
        or "file"
    )

    checksum = hashlib.md5(
        filename.encode()
    ).hexdigest()[:8]

    return (
        f"{checksum}_"
        f"{safe_name}"
        f"{extension}"
    )


# =========================
# Validate Upload File
# =========================

def validate_upload_file(
    file: UploadFile,
):

    if not file.filename:

        raise HTTPException(
            status_code=400,
            detail=(
                "Filename "
                "missing"
            ),
        )

    if file.size == 0:

        raise HTTPException(
            status_code=400,
            detail=(
                "Empty file "
                "uploaded"
            ),
        )