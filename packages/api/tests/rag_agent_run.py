from api.agentic.rag_agent import rag_agent
from api.agentic.core.dependencies import (
    get_document_service,
    get_knowledge_graph_extractor,
    get_text_embedder,
)
from api.database import get_db


def main():
    """
    Main function to run the RAG agent.
    This function initializes the rag_agent instance and runs it with a sample question.
    """
    collection_id = "e4e99dc1-2ed4-4fb2-94fe-6aaa7ba00805"

    rag_agent_instance = rag_agent(
        collection_id=collection_id,
        document_service=get_document_service(db=next(get_db())),
        embedding_model=get_text_embedder(),
        kg_extractor=get_knowledge_graph_extractor(),
    )

    docs_in_collection = rag_agent_instance.document_service.get_collection_documents(
        collection_id=rag_agent_instance.shared_data.collection_id
    )
    print(f"Found {len(docs_in_collection)} documents in collection {collection_id}")
    for doc in docs_in_collection:
        print(
            f"  - Document ID: {doc.id}, File Name: {doc.file_name}, Vectorized: {doc.is_vectorized}"
        )
        chunks = rag_agent_instance.document_service.get_document_chunks(doc.id)
        print(f"    - Found {len(chunks)} chunks for this document.")

    print(f"Online RAG flow created: {rag_agent_instance.flow.name}")

    print("\nProcessing your question...")
    rag_agent_instance.run(
        "Tell me does chunk provided have correlation with my question: Show me significant place in transformer architecture"
    )

    print("Retrieved Contexts: ", rag_agent_instance.shared_data.retrieved_contexts)
    print(f"\nAnswer: {rag_agent_instance.shared_data.llm_answer}")
    print("-" * 50)


if __name__ == "__main__":
    main()
