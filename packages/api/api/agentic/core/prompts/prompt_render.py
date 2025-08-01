# Extraction Prompt
from typing import Literal, Union

from .prompt_manager import get_prompt_manager
from .prompt_utils import create_information_tree
from .schemas import RenderTreeRequest


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


# Collection RAG Agent Prompt
def render_collection_rag_agent_prompt(
    question: str,
    contexts: Union[str, list[str]] = None,
    render_tree: RenderTreeRequest = None,
) -> str:
    """
    Convenience function to render the collection RAG agent prompt.

    Args:
        question: The user's question
        contexts: Context documents to include in the prompt

    Returns:
        Rendered prompt string
    """
    render_tree_context = ""

    if isinstance(contexts, list):
        contexts = "\n\n---\n\n".join(contexts)

    if render_tree:
        render_tree_context = create_information_tree(render_tree)

    manager = get_prompt_manager()
    return manager.render_template(
        "collection_rag_agent.j2",
        question=question,
        contexts=contexts,
        render_tree_context=render_tree_context,
    )


# Summary Generation Prompt
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


# OCR Prompt
def render_ocr_prompt(
    base_text: str,
    task_type: Literal["default", "structured"] = "default",
    text_length: int = 1500,
) -> str:
    """
    Convenience function to render the OCR prompt.

    Args:
        image_base64: Base64-encoded image string
        task_type: Type of OCR task (default, table, etc.)
        text_limit: Maximum characters to include from the text

    Returns:
        Rendered prompt string
    """
    manager = get_prompt_manager()
    if task_type == "structured":
        return manager.render_template(
            "ocr/structured.j2",
            base_text=base_text,
            text_length=text_length,
        )
    else:
        return manager.render_template(
            "ocr/default.j2",
            base_text=base_text,
            text_length=text_length,
        )
