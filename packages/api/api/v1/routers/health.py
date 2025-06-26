from fastapi import APIRouter

router = APIRouter(
    prefix="/v1/health",
    tags=["health"],
)


@router.get("/")
async def health_check():
    return {"status": "healthy"}
