import os
from typing import Union

import litellm
from dotenv import load_dotenv

from ..schemas import ChatHistory, ChatMessage

# utils/call_llm.py
# litellm._turn_on_debug()

load_dotenv()
api_key = os.getenv("OPENROUTER_API_KEY")


def call_llm(prompt: Union[str, ChatHistory], api_key=api_key) -> str:
    """Calls the LLM with the provided prompt and returns the response."""
    try:
        response = litellm.completion(
            model="openrouter/meta-llama/llama-3.3-70b-instruct",
            messages=[{"role": "user", "content": prompt}]
            if isinstance(prompt, str)
            else [
                {"role": msg.role.value, "content": msg.content}
                for msg in prompt.messages
            ],
            api_key=api_key,
        )

        if response.choices[0].message.content:
            return response.choices[0].message.content
        else:
            return f"Error: Could not extract message content from LLM response. Response: {response}"  # noqa: E501

    except Exception as e:
        return f"Error calling LLM: {e}"


async def call_llm_async(prompt: Union[str, ChatHistory], api_key=api_key) -> str:
    """Asynchronously calls the LLM with the provided prompt and returns the response."""
    try:
        response = await litellm.acompletion(
            model="openrouter/meta-llama/llama-3.3-70b-instruct",
            messages=[{"role": "user", "content": prompt}]
            if isinstance(prompt, str)
            else [
                {"role": msg.role.value, "content": msg.content}
                for msg in prompt.messages
            ],
            api_key=api_key,
        )

        if response.choices[0].message.content:
            return response.choices[0].message.content
        else:
            return f"Error: Could not extract message content from LLM response. Response: {response}"  # noqa: E501

    except Exception as e:
        return f"Error calling LLM: {e}"
