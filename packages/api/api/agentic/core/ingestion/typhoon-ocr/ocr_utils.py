# Modified from Typhoon OCR Utils https://github.com/scb-10x/typhoon-ocr/blob/master/packages/typhoon_ocr/typhoon_ocr/ocr_utils.py

import base64
import io
import json
import os
import tempfile
from dataclasses import dataclass
from typing import Any, Callable

from litellm import acompletion, completion
from PIL import Image

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
# Prompt Templates
# -----------------------------

PROMPTS_SYS = {
    "default": lambda base_text: (
        f"Below is an image of a document page along with its dimensions.\n"
        f"Simply return the markdown representation of this document, presenting tables in markdown format as they naturally appear.\n"
        f"If the document contains images, use a placeholder like dummy.png for each image.\n"
        f"Your final output must be in JSON format with a single key `natural_text` containing the response.\n"
        f"RAW_TEXT_START\n{base_text}\nRAW_TEXT_END"
    ),
    "structure": lambda base_text: (
        f"Below is an image of a document page, along with its dimensions and possibly some raw textual content previously extracted from it.\n"
        f"Note that the text extraction may be incomplete or partially missing. Carefully consider both the layout and any available text to reconstruct the document accurately.\n"
        f"Your task is to return the markdown representation of this document, presenting tables in HTML format as they naturally appear.\n"
        f"If the document contains images or figures, analyze them and include the tag <figure>IMAGE_ANALYSIS</figure> in the appropriate location.\n"
        f"Your final output must be in JSON format with a single key `natural_text` containing the response.\n"
        f"RAW_TEXT_START\n{base_text}\nRAW_TEXT_END"
    ),
}


def get_prompt(prompt_name: str) -> Callable[[str], str]:
    return PROMPTS_SYS.get(prompt_name, lambda x: "Invalid PROMPT_NAME provided.")


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


def ensure_image_in_path(input_string: str) -> str:
    if (
        input_string.endswith(".png")
        or input_string.endswith(".jpg")
        or input_string.endswith(".jpeg")
    ):
        return input_string
    elif is_base64_string(input_string):
        try:
            image_data = base64.b64decode(input_string)
            image = Image.open(io.BytesIO(image_data))
            image_format = image.format.lower()
            with tempfile.NamedTemporaryFile(
                delete=False, suffix=f".{image_format}"
            ) as temp_file:
                image.save(temp_file.name, format=image_format)
                return temp_file.name
        except Exception:
            return input_string
    return input_string


# -----------------------------
# Main OCR Function
# -----------------------------


async def ocr_image_document(
    image_path_or_base64: str,
    task_type: str = "default",
    base_url: str = os.getenv("TYPHOON_BASE_URL", "https://api.opentyphoon.ai/v1"),
    api_key: str = None,
    model: str = "typhoon-ocr-preview",
    litellm_params: dict[str, Any] = None,
) -> str:
    image_path = ensure_image_in_path(image_path_or_base64)
    img = Image.open(image_path)
    image_base64 = image_to_base64png(img)
    anchor_text = get_anchor_text_from_image(img)
    prompt_fn = get_prompt(task_type)
    prompt_text = prompt_fn(anchor_text)

    messages = [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": prompt_text},
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/png;base64,{image_base64}"},
                },
            ],
        }
    ]

    litellm_args = {
        "model": model,
        "base_url": base_url,
        "messages": messages,
        "api_key": api_key
        or os.getenv("TYPHOON_API_KEY")
        or os.getenv("OPENAI_API_KEY"),
        "max_tokens": 16384,
        "temperature": 0.1,
        "top_p": 0.6,
        "repetition_penalty": 1.2,
    }
    if litellm_params:
        litellm_args.update(litellm_params)

    response = await acompletion(**litellm_args)
    text_output = response["choices"][0]["message"]["content"]
    return json.loads(text_output)["natural_text"]
