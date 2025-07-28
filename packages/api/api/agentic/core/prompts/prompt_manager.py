"""
Prompt template management using Jinja2.
"""

import os
from typing import Any, Literal, Union

from jinja2 import Environment, FileSystemLoader, Template, TemplateNotFound


class PromptManager:
    """
    Manages prompt templates using Jinja2 for rendering dynamic content.
    """

    def __init__(self, templates_dir: str = None):
        """
        Initialize the PromptManager with the templates directory.

        Args:
            templates_dir: Path to the templates directory. If None, uses default location.
        """
        if templates_dir is None:
            # Get the directory of this file and construct the templates path
            current_dir = os.path.dirname(os.path.abspath(__file__))
            templates_dir = os.path.join(current_dir, "templates")

        self.templates_dir = templates_dir
        self.env = Environment(
            loader=FileSystemLoader(templates_dir),
            trim_blocks=True,
            lstrip_blocks=True,
        )

    def render_template(self, template_name: str, **kwargs: Any) -> str:
        """
        Render a template with the provided variables.

        Args:
            template_name: Name of the template file (with extension)
            **kwargs: Variables to pass to the template

        Returns:
            Rendered template as a string

        Raises:
            TemplateNotFound: If the template file doesn't exist
            Exception: If there's an error during template rendering
        """
        try:
            template = self.env.get_template(template_name)
            return template.render(**kwargs)
        except TemplateNotFound as e:
            raise TemplateNotFound(
                f"Template '{template_name}' not found in {self.templates_dir}"
            ) from e
        except Exception as e:
            raise Exception(
                f"Error rendering template '{template_name}': {str(e)}"
            ) from e

    def get_template(self, template_name: str) -> Template:
        """
        Get a template object for direct manipulation.

        Args:
            template_name: Name of the template file (with extension)

        Returns:
            Jinja2 Template object

        Raises:
            TemplateNotFound: If the template file doesn't exist
        """
        return self.env.get_template(template_name)

    def list_templates(self) -> list[str]:
        """
        List all available template files.

        Returns:
            List of template filenames
        """
        try:
            return self.env.list_templates()
        except Exception:
            return []


# Global instance for easy access
_prompt_manager = None


def get_prompt_manager() -> PromptManager:
    """
    Get the global PromptManager instance (singleton pattern).

    Returns:
        PromptManager instance
    """
    global _prompt_manager
    if _prompt_manager is None:
        _prompt_manager = PromptManager()
    return _prompt_manager


def render_knowledge_graph_extraction_prompt(
    full_text: str, text_limit: int = 15000
) -> str:
    """
    Convenience function to render the knowledge graph extraction prompt.

    Args:
        full_text: The text to extract knowledge graph from
        text_limit: Maximum characters to include from the text

    Returns:
        Rendered prompt string
    """
    manager = get_prompt_manager()
    return manager.render_template(
        "knowledge_graph_extraction.j2", full_text=full_text, text_limit=text_limit
    )


def render_keyword_to_topic_extraction(keywords: Union[str, list[str]]) -> str:
    """
    Convenience function to render the keyword to topic extraction prompt.

    Args:
        full_text: The text to extract keywords and topics from
        text_limit: Maximum characters to include from the text

    Returns:
        Rendered prompt string
    """
    if isinstance(keywords, list):
        keywords = ", ".join(keywords)

    manager = get_prompt_manager()
    return manager.render_template("keyword_to_topic_extraction.j2", keywords=keywords)


def render_summary_to_topic_extraction(
    summaries: Union[str, list[str]], text_limit: int = 15000
) -> str:
    """
    Convenience function to render the summary to topic extraction prompt.

    Args:
        summaries: The summaries to extract topics from
        text_limit: Maximum characters to include from the text

    Returns:
        Rendered prompt string
    """
    if isinstance(summaries, list):
        summaries = "\n\n---\n\n".join(summaries)
    manager = get_prompt_manager()
    return manager.render_template(
        "summary_to_topic_extraction.j2", summaries=summaries, text_limit=text_limit
    )


def render_collection_rag_agent_prompt(
    question: str, contexts: Union[str, list[str]] = None
) -> str:
    """
    Convenience function to render the collection RAG agent prompt.

    Args:
        question: The user's question
        contexts: Context documents to include in the prompt

    Returns:
        Rendered prompt string
    """
    if isinstance(contexts, list):
        contexts = "\n\n---\n\n".join(contexts)

    manager = get_prompt_manager()
    return manager.render_template(
        "collection_rag_agent.j2", question=question, contexts=contexts
    )


def render_summary_generate_prompt(
    full_text: str,
    text_limit: int = 15000,
    tone: str = "professional",
    language: Literal["en", "th"] = "en",
    max_length: int = 100,
) -> str:
    """
    Convenience function to render the summary generation prompt.

    Args:
        full_text: The text to summarize
        text_limit: Maximum characters to include from the text

    Returns:
        Rendered prompt string
    """
    # Normalize language input make it better for rendering

    manager = get_prompt_manager()
    return manager.render_template(
        "summary_generate.j2",
        full_text=full_text,
        text_limit=text_limit,
        tone=tone,
        language=language,
        max_length=max_length,
    )
