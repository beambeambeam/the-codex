import os

import litellm
from dotenv import load_dotenv

# utils/call_llm.py

load_dotenv()
api_key = os.getenv("OPENROUTER_API_KEY")


def call_llm(prompt: str, api_key=api_key) -> str:
    """Calls the LLM with the provided prompt and returns the response."""
    try:
        response = litellm.completion(
            model="openrouter/meta-llama/llama-3.3-70b-instruct",
            messages=[{"role": "user", "content": prompt}],
            api_key=api_key,
        )

        if response.choices[0].message.content:
            return response.choices[0].message.content
        else:
            return f"Error: Could not extract message content from LLM response. Response: {response}"  # noqa: E501

    except Exception as e:
        return f"Error calling LLM: {e}"
