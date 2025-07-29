# Modified from Typhoon OCR Utils https://github.com/scb-10x/typhoon-ocr/blob/master/packages/typhoon_ocr/typhoon_ocr/ocr_utils.py

import base64
import io
import json
import os
from dataclasses import dataclass
from typing import Any, Callable, Union

from litellm import acompletion
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
    "default": lambda base_text, text_length: (
        f"You are provided with a document image and its dimensions. "
        f"The image may contain printed text, tables, figures, or visual layout elements.\n\n"
        f"Based on the image (and any text provided below), produce a descriptive markdown explanation of what appears on the page. "
        f"If no text is available, infer the content and describe it naturally based on the layout, fonts, and visible elements.\n\n"
        f"- Use **markdown** for structure (e.g., headings, lists, tables). "
        f"- Format tables using **markdown tables** if present. "
        f"- Insert `![Image](dummy.png)` wherever images or figures occur.\n\n"
        f"The description should be roughly **{text_length} words** in length. You may use judgment to stay within a reasonable range.\n\n"
        f"Return your final output in **JSON format** with a single key `natural_text` containing the markdown string.\n\n"
        f"RAW_TEXT_START\n{base_text}\nRAW_TEXT_END"
    ),
    "structure": lambda base_text, text_length: (
        f"You are provided with a document image and its dimensions. "
        f"The document may contain structured content such as tables, forms, diagrams, or headings. "
        f"Some raw text may be available, but could be partial or missing entirely.\n\n"
        f"Reconstruct and describe the document in markdown format:\n"
        f"- Use **HTML tables** for any detected tabular content.\n"
        f"- Use markdown for section titles, paragraphs, and structural layout.\n"
        f"- Insert `<figure>IMAGE_ANALYSIS</figure>` where visual diagrams or non-text elements appear.\n"
        f"- If no readable text exists, describe what is visually present.\n\n"
        f"The final description should be approximately **{text_length} words**. Focus on clarity and accuracy.\n\n"
        f"Return your output as a **JSON object** with one key: `natural_text`, containing the markdown string.\n\n"
        f"RAW_TEXT_START\n{base_text}\nRAW_TEXT_END"
    ),
}


def get_prompt(prompt_name: str, text_length: int = 250) -> Callable[[str], str]:
    return lambda base_text: PROMPTS_SYS.get(prompt_name)(base_text, text_length)


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


def prepare_image_ocr_messages(
    image_data: bytes, task_type: str = "default"
) -> list[dict[str, Any]]:
    img = Image.open(io.BytesIO(image_data))
    image_base64 = image_to_base64png(img)
    anchor_text = get_anchor_text_from_image(img)
    prompt_fn = get_prompt(task_type, text_length=250)
    prompt_text = prompt_fn(anchor_text)

    return [
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


# -----------------------------
# Main OCR Function
# -----------------------------


async def ocr_image_document(
    image_input: Union[str, bytes],
    task_type: str = "default",
    base_url: str = os.getenv("TYPHOON_BASE_URL", "https://api.opentyphoon.ai/v1"),
    api_key: str = None,
    model: str = "typhoon-ocr-preview",
    litellm_params: dict[str, Any] = None,
) -> str:
    image_data = ensure_image_bytes(image_input)
    messages = prepare_image_ocr_messages(image_data, task_type=task_type)

    litellm_args = {
        "model": "openai/" + model,
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
