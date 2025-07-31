"""FastAPI application."""

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.v1.routers import api_router

# Load environment variables
load_dotenv()

app = FastAPI(
    title="The Codex API",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:4200",
    ],  # Add your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(api_router)


def main():
    import argparse

    import uvicorn

    parser = argparse.ArgumentParser(description="Agentic RAG API and Flows")
    parser.add_argument("command", choices=["serve"], help="Command to run.")
    parser.add_argument(
        "--host", type=str, default="127.0.0.1", help="Host for the API server."
    )
    parser.add_argument(
        "--port", type=int, default=8000, help="Port for the API server."
    )
    parser.add_argument(
        "--reload",
        default=True,
        action="store_true",
        help="Enable auto-reloading for development.",
    )

    args = parser.parse_args()

    if args.command == "serve":
        print(f"Starting API server on {args.host}:{args.port}")

        uvicorn.run("api.main:app", host=args.host, port=args.port, reload=args.reload)


if __name__ == "__main__":
    main()
