from api.agentic.dependencies import (
    get_document_ingestor,
    get_document_service,
    get_knowledge_graph_extractor,
    get_text_embedder,
)
from api.auth.dependencies import get_auth_service
from api.collection.dependencies import get_collection_service
from api.collection.schemas import CollectionCreate
from api.database import get_db


def main():
    """
    Main function to run the document ingestion example.
    This function initializes the DocumentIngestor instance and runs it with a sample file path.
    """
    db = next(get_db())
    new_user = get_auth_service(db=db).create_user(
        username="testuser", password="testpassword", email="piang@gmail.com"
    )
    document_collection_service = get_document_service(db=db)

    document_ingestor_instance = get_document_ingestor(
        user=new_user,  # Assuming user is not needed for this example
        document_service=document_collection_service,
        text_embedder=get_text_embedder(),  # Assuming text embedder is not needed for this example
        graph_extractor=get_knowledge_graph_extractor(),  # Assuming graph extractor is not needed for this example
    )

    # Example file path to ingest
    file_path = "tests\pdf\Lecture+13+Modeling+Computation.pdf"

    # Run the ingestion process
    collection = get_collection_service(db=db).create_collection(
        collection_data=CollectionCreate(
            name="Test Collection",
            description="This is a test collection for document ingestion example.",
        ),
        user=new_user,
    )

    document_ingestor_instance.ingest_file(
        input_file=file_path, collection_id=collection.id
    )


if __name__ == "__main__":
    main()
