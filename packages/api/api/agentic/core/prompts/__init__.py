"""
Prompt templates and management for agentic components.
"""

from .prompt_manager import (
    PromptManager,
    render_collection_rag_agent_prompt,
    render_keyword_to_topic_extraction,
    render_knowledge_graph_extraction_prompt,
    render_ocr_prompt,
    render_summary_generate_prompt,
    render_summary_to_topic_extraction,
)

__all__ = [
    "PromptManager",
    "render_knowledge_graph_extraction_prompt",
    "render_keyword_to_topic_extraction",
    "render_collection_rag_agent_prompt",
    "render_summary_to_topic_extraction",
    "render_summary_generate_prompt",
    "render_ocr_prompt",
]
