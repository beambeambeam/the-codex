from collections.abc import Awaitable
from typing import Callable, Literal

from ..prompts.prompt_manager import render_summary_generate_prompt


class SummaryGenerator:
    def __init__(
        self,
        llm_caller: Callable[[str], Awaitable[str]],
        text_limit: int = 15000,
    ):
        self.llm_caller = llm_caller
        self.prompt_renderer = render_summary_generate_prompt
        self.text_limit = text_limit

    async def async_generate_summary(
        self,
        full_text: str,
        tone: str = "professional",
        language: Literal["en", "th"] = "en",
        max_length: int = 100,
    ) -> str:
        """Generate a summary of the provided text."""
        prompt = self.prompt_renderer(
            full_text=full_text,
            text_limit=self.text_limit,
            tone=tone,
            language=language,
            max_length=max_length,
        )

        try:
            summary = await self.llm_caller(prompt)
            return summary
        except Exception as e:
            print(f"Error generating summary: {e}")
            return ""
