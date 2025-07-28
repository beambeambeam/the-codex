from typing import Literal

from ..call_llm import call_structured_llm_async
from ..prompts.prompt_manager import render_summary_generate_prompt
from .schemas import document_details


class SummaryGenerator:
    def __init__(
        self,
        text_limit: int = 15000,
    ):
        self.prompt_renderer = render_summary_generate_prompt
        self.text_limit = text_limit

    async def async_generate_summary(
        self,
        full_text: str,
        tone: str = "professional",
        language: Literal["en", "th"] = "en",
        max_length: int = 100,
    ) -> document_details:
        """Generate a summary of the provided text."""
        prompt = self.prompt_renderer(
            full_text=full_text,
            text_limit=self.text_limit,
            tone=tone,
            language=language,
            max_length=max_length,
        )

        try:
            summary = await call_structured_llm_async(
                prompt, response_model=document_details
            )
            return summary
        except Exception as e:
            print(f"Error generating summary: {e}")
            return document_details()
