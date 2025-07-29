import os
from typing import Any, TypeVar, Union

import instructor
import litellm
from dotenv import load_dotenv
from pydantic import BaseModel

from ..schemas import ChatHistory

# utils/call_llm.py
# litellm._turn_on_debug()

T = TypeVar("T", bound=BaseModel)

load_dotenv()
api_key = os.getenv("OPENROUTER_API_KEY")
model = os.getenv("LITELLM_MODEL", "openrouter/meta-llama/llama-3.3-70b-instruct")
structured_model = os.getenv(
    "LITELLM_STRUCTURED_MODEL", "openrouter/meta-llama/llama-3.3-70b-instruct"
)

client = instructor.from_litellm(litellm.completion, mode=instructor.Mode.JSON_SCHEMA)
async_client = instructor.from_litellm(
    litellm.acompletion, mode=instructor.Mode.JSON_SCHEMA
)


def call_llm(prompt: Union[str, ChatHistory], api_key=api_key) -> str:
    """Calls the LLM with the provided prompt and returns the response."""
    response = litellm.completion(
        model=model,
        messages=[{"role": "user", "content": prompt}]
        if isinstance(prompt, str)
        else [
            {"role": msg.role.value, "content": msg.content} for msg in prompt.messages
        ],
        api_key=api_key,
    )

    if response.choices[0].message.content:
        return response.choices[0].message.content
    else:
        return f"Error: Could not extract message content from LLM response. Response: {response}"  # noqa: E501


async def call_llm_async(prompt: Union[str, ChatHistory], api_key=api_key) -> str:
    """Asynchronously calls the LLM with the provided prompt and returns the response."""
    response = await litellm.acompletion(
        model=model,
        messages=[{"role": "user", "content": prompt}]
        if isinstance(prompt, str)
        else [
            {"role": msg.role.value, "content": msg.content} for msg in prompt.messages
        ],
        api_key=api_key,
    )

    if response.choices[0].message.content:
        return response.choices[0].message.content
    else:
        return f"Error: Could not extract message content from LLM response. Response: {response}"  # noqa: E501


def call_structured_llm(
    prompt: Union[str, ChatHistory], response_model: type[T], max_retries: int = 3
) -> T:
    """Calls the LLM with a structured prompt and returns the response."""
    response = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}]
        if isinstance(prompt, str)
        else [
            {"role": msg.role.value, "content": msg.content} for msg in prompt.messages
        ],
        model=structured_model,
        api_key=api_key,
        response_model=response_model,
        max_retries=max_retries,
    )

    if response:
        return response

    else:
        raise ValueError(
            f"Error: Could not extract message content from LLM response. Response: {response}"
        )


async def call_structured_llm_async(
    prompt: Union[str, ChatHistory], response_model: type[T], max_retries: int = 3
) -> T:
    """Asynchronously calls the LLM with a structured prompt and returns the response."""
    response = await async_client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}]
        if isinstance(prompt, str)
        else [
            {"role": msg.role.value, "content": msg.content} for msg in prompt.messages
        ],
        model=structured_model,
        api_key=api_key,
        response_model=response_model,
        max_retries=max_retries,
    )

    if response:
        return response

    else:
        raise ValueError(
            f"Error: Could not extract message content from LLM response. Response: {response}"
        )


async def call_vlm_async(
    prompt_text: Union[str, ChatHistory],
    image_base64: str,
    api_key: str = os.getenv("TYPHOON_API_KEY", "your-typhoon-api-key"),
    *,
    model: str = "openai/typhoon-ocr-preview",
    litellm_params: dict[str, Any] = None,
) -> str:
    """Calls the unstructured VLM with the provided prompt and returns the response."""

    litellm_args = {
        "model": model,
        "base_url": os.getenv("TYPHOON_BASE_URL", "https://api.opentyphoon.ai/v1"),
        "messages": [
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
        ],
        "api_key": api_key,
        "max_tokens": 16384,
        "temperature": 0.1,
        "top_p": 0.6,
        "presence_penalty": 1.2,
    }
    if litellm_params:
        litellm_args.update(litellm_params)

    response = await litellm.acompletion(**litellm_args)

    if response:
        return response.choices[0].message.content.strip()

    else:
        raise ValueError(
            f"Error: Could not extract message content from VLM response. Response: {response}"
        )
