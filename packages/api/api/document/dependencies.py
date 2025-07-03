"""Document dependencies for dependency injection."""

from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..auth.dependencies import get_current_user
from ..database import get_db
from ..models.document import Document, DocumentChat, DocumentRelation
from ..models.user import User
from .service import DocumentServiceSearch as DocumentService


def get_document_service(db: Session = Depends(get_db)) -> DocumentService:
    """Get document service instance."""
    return DocumentService(db)


def get_document_or_404(
    document_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Document:
    """Get document by ID or raise 404."""
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Document not found"
        )

    # Check if user has permission to view document
    if document.created_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this document",
        )

    return document


def get_document_with_modify_permission(
    document_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Document:
    """Get document with modify permission or raise 403."""
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Document not found"
        )

    # Check if user has permission to modify document
    if document.created_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this document",
        )

    return document


def get_document_chat_or_404(
    chat_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DocumentChat:
    """Get document chat by ID or raise 404."""
    chat = db.query(DocumentChat).filter(DocumentChat.id == chat_id).first()
    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Document chat not found"
        )

    # Check if user has permission to view chat
    if chat.created_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this chat",
        )

    return chat


def get_document_chat_with_modify_permission(
    chat_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DocumentChat:
    """Get document chat with modify permission or raise 403."""
    chat = db.query(DocumentChat).filter(DocumentChat.id == chat_id).first()
    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Document chat not found"
        )

    # Check if user has permission to modify chat
    if chat.created_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this chat",
        )

    return chat


def get_document_relation_or_404(
    relation_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DocumentRelation:
    """Get document relation by ID or raise 404."""
    relation = (
        db.query(DocumentRelation).filter(DocumentRelation.id == relation_id).first()
    )
    if not relation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document relation not found",
        )

    # Check if user has permission to view relation
    if relation.created_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this relation",
        )

    return relation


def get_document_relation_with_modify_permission(
    relation_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DocumentRelation:
    """Get document relation with modify permission or raise 403."""
    relation = (
        db.query(DocumentRelation).filter(DocumentRelation.id == relation_id).first()
    )
    if not relation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document relation not found",
        )

    # Check if user has permission to modify relation
    if relation.created_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this relation",
        )

    return relation
