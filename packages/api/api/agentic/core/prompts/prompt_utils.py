# Function to render a structured document tree for LLM prompts
from api.agentic.core.prompts.schemas import RenderTreeRequest

# Example output:

# [Collection: AI Research Notes | ID: col-123]
# ├─ Viewed & Asked by: guntee
# ├─ Desc: A collection of internal research documents on general AI alignment strategies.
# ├─ Created by: alice on 2025-07-01
# ├─ Updated by: bob on 2025-07-29
# ├─ Documents:
# ├── AGI Alignment Final Report (pdf, 510KB)
#     ├─ ID: doc-001
#     ├─ Path: /uploads/alignment_report.pdf
#     ├─ Status: complete, Vec: ✅, Graph: ✅
#     ├─ By: alice, On: 2025-07-02
#     └─ Desc: A 25-page summary of AGI alignment techniques including corrigibility and reward modeling.
# └── notes.txt (txt, 11KB)
#     ├─ ID: doc-002
#     ├─ Path: /uploads/notes.txt
#     ├─ Status: processing, Vec: ❌, Graph: ❌
#     ├─ By: bob, On: 2025-07-27


def create_information_tree(request: RenderTreeRequest) -> str:
    """
    Create a structured, token-efficient document tree string for LLM prompts.

    Args:
        documents: List of DocumentResponse objects
        collection: CollectionResponse object
        username: The username of the person requesting/viewing the tree

    Returns:
        str: A structured string representing the collection and its documents.
    """
    documents = request.documents
    collection = request.collection
    username = request.username

    lines = [
        f"[Collection: {collection.name} | ID: {collection.id}]",
        f"├─ Viewed & Asked by: {username}",
        f"├─ Desc: {collection.description.strip()[:150] if collection.description else '—'}",
        f"├─ Created by: {collection.created_by} on {collection.created_at.strftime('%Y-%m-%d')}",
        f"├─ Updated by: {collection.updated_by} on {collection.updated_at.strftime('%Y-%m-%d')}",
        "├─ Documents:",
    ]

    if not documents:
        lines.append("│   └─ (No documents available)")
        return "\n".join(lines)

    for i, doc in enumerate(documents):
        size_kb = f"{(doc.file_size or 0) // 1024}KB"
        title = doc.title or doc.file_name
        branch = "└──" if i == len(documents) - 1 else "├──"
        lines.append(f"{branch} {title} ({doc.file_type}, {size_kb})")
        lines.append(f"    ├─ ID: {doc.id}")
        lines.append(f"    ├─ Path: {doc.source_file_path}")
        lines.append(
            f"    ├─ Status: {doc.status}, Vec: {'✅' if doc.is_vectorized else '❌'}, Graph: {'✅' if doc.is_graph_extracted else '❌'}"
        )
        if doc.created_by and doc.created_at:
            lines.append(
                f"    ├─ By: {doc.created_by}, On: {doc.created_at.strftime('%Y-%m-%d')}"
            )
        if doc.description:
            short_desc = doc.description.strip().replace("\n", " ")[:100]
            lines.append(f"    └─ Desc: {short_desc}")

    return "\n".join(lines)
