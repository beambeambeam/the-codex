from fastapi import APIRouter

from ...agentic.router import router as agentic_router
from ...auth.router import router as auth_router
from ...chat.router import router as chat_router
from ...clustering.router import router as clustering_router
from ...collection.router import router as collection_router
from ...document.router import router as document_router
from ...message_queue.router import router as queue_router
from ...sse.router import router as sse_router
from .health import router as health_router

api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(collection_router)
api_router.include_router(document_router)
api_router.include_router(agentic_router)
api_router.include_router(queue_router)
api_router.include_router(sse_router)
api_router.include_router(chat_router)
api_router.include_router(clustering_router)
