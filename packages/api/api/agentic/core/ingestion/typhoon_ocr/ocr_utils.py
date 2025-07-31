# Modified from Typhoon OCR Utils https://github.com/scb-10x/typhoon-ocr/blob/master/packages/typhoon_ocr/typhoon_ocr/ocr_utils.py

import base64
import io
import json
import os
from dataclasses import dataclass
from typing import Any, Union

from PIL import Image

from ...call_llm import call_vlm_async
from ...prompts.prompt_manager import render_ocr_prompt

# -----------------------------
# OCR Types & Data Structures
# -----------------------------


@dataclass(frozen=True)
class TextElement:
    text: str
    x: float
    y: float


@dataclass(frozen=True)
class BoundingBox:
    x0: float
    y0: float
    x1: float
    y1: float


@dataclass(frozen=True)
class ImageElement:
    name: str
    bbox: BoundingBox


@dataclass(frozen=True)
class PageReport:
    mediabox: BoundingBox
    text_elements: list[TextElement]
    image_elements: list[ImageElement]


# -----------------------------
# Utility Functions
# -----------------------------


def image_to_base64png(img: Image.Image):
    buffered = io.BytesIO()
    img = img.convert("RGB")
    img.save(buffered, format="JPEG")
    return base64.b64encode(buffered.getvalue()).decode("utf-8")


def get_anchor_text_from_image(img: Image.Image):
    width = float(img.width)
    height = float(img.height)
    text = f"""Page dimensions: {width:.1f}x{height:.1f}\n[Image 0x0 to {width:.0f}x{height:.0f}]\n"""
    return text


def is_base64_string(input_string: str) -> bool:
    try:
        return (
            base64.b64encode(base64.b64decode(input_string))[:10]
            == input_string.encode()[:10]
        )
    except Exception:
        return False


def ensure_image_bytes(input_data: Union[str, bytes]) -> bytes:
    if isinstance(input_data, bytes):
        return input_data
    elif isinstance(input_data, str) and is_base64_string(input_data):
        return base64.b64decode(input_data)
    elif isinstance(input_data, str) and os.path.isfile(input_data):
        with open(input_data, "rb") as f:
            return f.read()
    raise ValueError("Input must be a path, bytes, or base64-encoded image string.")


# -----------------------------
# Main OCR Function
# -----------------------------


async def ocr_image_document(
    image_input: Union[str, bytes],
    task_type: str = "default",
    litellm_params: dict[str, Any] = None,
) -> str:
    # Ensure image data is in bytes
    image_data = ensure_image_bytes(image_input)
    img = Image.open(io.BytesIO(image_data))
    image_base64 = image_to_base64png(img)
    anchor_text = get_anchor_text_from_image(img)
    prompt_text = render_ocr_prompt(anchor_text, task_type=task_type, text_length=1500)

    # Call the VLM with the image and prompt
    response = await call_vlm_async(
        prompt_text,
        image_base64=image_base64,
        litellm_params=litellm_params,
    )

    try:
        parsed = json.loads(response)
        if isinstance(parsed, dict) and "natural_text" in parsed:
            return str(parsed["natural_text"]).strip()
    except json.JSONDecodeError:
        pass

    # Fallback: return raw stripped response
    return response.strip()
