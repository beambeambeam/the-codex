from fastapi import APIRouter

from ...auth.router import router as auth_router
from ...collection.router import router as collection_router
from .health import router as health_router

api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(collection_router)
