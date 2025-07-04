# The Codex

A full-stack application built with FastAPI (Python) backend and Next.js (React) frontend.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (package manager)
- **Python** (3.9 or higher)
- **uv** (Python package manager)
- **Docker** and **Docker Compose** (for database and storage)

## Quick Start

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd the-codex

# Install Node.js dependencies
pnpm install
```

### 2. Start Services

```bash
# Start PostgreSQL and MinIO services
docker compose up -d
```

### 3. Setup Python API

```bash
# Navigate to the API package
cd packages/api

# Install Python dependencies
uv sync

# Run database migrations
uv run alembic upgrade head

# Start the API server
cd ../../
pnpm dlx nx dev api
```

### 4. Start the Web Frontend

```bash
# In a new terminal, start the Next.js frontend
pnpm dlx nx dev web
```

## Available Scripts

- `pnpm dev` - Start all development servers
- `pnpm lint` - Run linting across all packages
- `pnpm dlx nx dev api` - Start only the API server
- `pnpm dlx nx dev web` - Start only the web frontend

## Project Structure

```
the-codex/
├── packages/
│   ├── api/          # FastAPI backend
│   └── web/          # Next.js frontend
├── compose.yml       # Docker services
└── package.json      # Root package configuration
```

## Development URLs

- **Frontend**: http://localhost:4200
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Database**: localhost:3002 (PostgreSQL)
- **MinIO Console**: http://localhost:9001 (Object Storage Admin)
- **MinIO API**: http://localhost:9000 (S3-compatible API)
- **RabbitMQ Management**: http://localhost:15672 (Message Queue Admin)

## Environment Setup

Make sure to configure your environment variables as needed for each package. Check the individual package README files for specific configuration requirements.
