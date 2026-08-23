import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile

UPLOAD_ROOT = Path(__file__).resolve().parents[2] / "uploads"

DESIGNS_DIR = UPLOAD_ROOT / "designs"
WATERMARKS_DIR = UPLOAD_ROOT / "watermarks"
PAYMENT_SLIPS_DIR = UPLOAD_ROOT / "payment_slips"
INVOICES_DIR = UPLOAD_ROOT / "invoices"

for directory in (DESIGNS_DIR, WATERMARKS_DIR, PAYMENT_SLIPS_DIR, INVOICES_DIR):
    directory.mkdir(parents=True, exist_ok=True)

MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024  # 15 MB

DESIGN_ALLOWED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".pdf"}
DESIGN_IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}
DOCUMENT_ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg"}


def _validate_and_read(file: UploadFile, allowed_extensions: set[str]) -> tuple[bytes, str]:
    suffix = Path(file.filename or "").suffix.lower()

    if suffix not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{suffix or 'unknown'}'.",
        )

    contents = file.file.read()

    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    if len(contents) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=400, detail="File exceeds the 15 MB limit.")

    return contents, suffix


def save_file(file: UploadFile, directory: Path, allowed_extensions: set[str]) -> str:
    contents, suffix = _validate_and_read(file, allowed_extensions)

    filename = f"{uuid.uuid4().hex}{suffix}"
    destination = directory / filename
    destination.write_bytes(contents)

    return str(destination.relative_to(UPLOAD_ROOT))


def save_design_file(file: UploadFile, apply_watermark: bool = True) -> tuple[str, str]:
    """Save the original design upload and produce a watermarked preview.

    Returns (original_relative_path, watermarked_relative_path).
    Watermarking (pixel overlay) is applied to raster images only, and only
    when ``apply_watermark`` is True; PDFs (and images uploaded with
    watermarking turned off) are stored as-is and rely entirely on
    access-control gating (never exposed to a client before payment
    verification).
    """

    contents, suffix = _validate_and_read(file, DESIGN_ALLOWED_EXTENSIONS)

    filename = f"{uuid.uuid4().hex}{suffix}"
    original_path = DESIGNS_DIR / filename
    original_path.write_bytes(contents)

    if apply_watermark and suffix in DESIGN_IMAGE_EXTENSIONS:
        watermarked_relative = _create_image_watermark(original_path, filename)
    else:
        watermarked_relative = str(original_path.relative_to(UPLOAD_ROOT))

    return str(original_path.relative_to(UPLOAD_ROOT)), watermarked_relative


def _create_image_watermark(original_path: Path, filename: str) -> str:
    from PIL import Image, ImageDraw, ImageFont

    watermark_path = WATERMARKS_DIR / filename

    with Image.open(original_path) as base_image:
        base_image = base_image.convert("RGBA")
        overlay = Image.new("RGBA", base_image.size, (0, 0, 0, 0))
        draw = ImageDraw.Draw(overlay)

        text = "JOBQUANT PREVIEW"

        try:
            font_size = max(18, base_image.width // 18)
            font = ImageFont.truetype("arial.ttf", font_size)
        except OSError:
            font = ImageFont.load_default()

        text_bbox = draw.textbbox((0, 0), text, font=font)
        text_width = text_bbox[2] - text_bbox[0]
        text_height = text_bbox[3] - text_bbox[1]

        step_x = text_width + 60
        step_y = text_height + 60

        for y in range(-base_image.height, base_image.height * 2, step_y):
            for x in range(-base_image.width, base_image.width * 2, step_x):
                draw.text((x, y), text, font=font, fill=(255, 255, 255, 110))

        rotated_overlay = overlay.rotate(30, expand=False)
        watermarked = Image.alpha_composite(base_image, rotated_overlay)
        watermarked.convert("RGB").save(watermark_path, quality=85)

    return str(watermark_path.relative_to(UPLOAD_ROOT))


def resolve_path(relative_path: str) -> Path:
    full_path = (UPLOAD_ROOT / relative_path).resolve()

    if UPLOAD_ROOT.resolve() not in full_path.parents and full_path != UPLOAD_ROOT.resolve():
        raise HTTPException(status_code=400, detail="Invalid file path.")

    if not full_path.exists():
        raise HTTPException(status_code=404, detail="File not found.")

    return full_path
