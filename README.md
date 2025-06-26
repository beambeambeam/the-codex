# The Codex

A modern full-stack application built with **Next.js** (frontend) and **FastAPI** (backend), managed as a monorepo using **Nx**.

## 🚀 Tech Stack

### Frontend (`packages/web`)

- **Next.js 15.2** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **PostCSS & Autoprefixer** - CSS processing

### Backend (`packages/api`)

- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **Alembic** - Database migration tool
- **psycopg** - PostgreSQL adapter
- **pgvector** - Vector similarity search
- **Python 3.9+** - Programming language

### DevOps & Tooling

- **Nx 21.2** - Build system and monorepo tools
- **pnpm** - Fast, disk space efficient package manager
- **Docker & Docker Compose** - Containerization
- **Jest** - JavaScript testing framework
- **pytest** - Python testing framework
- **ESLint & Prettier** - Code linting and formatting
- **Commitlint & Husky** - Git hooks and commit conventions
- **TypeScript ESLint** - TypeScript-specific linting

## 📁 Project Structure

```
the-codex/
├── packages/
│   ├── web/                    # Next.js frontend application
│   │   ├── src/
│   │   │   ├── app/           # App Router pages
│   │   │   └── ...
│   │   ├── public/            # Static assets
│   │   └── package.json
│   └── api/                   # FastAPI backend application
│       ├── api/               # Source code
│       │   ├── models/        # SQLAlchemy models
│       │   ├── v1/           # API routes
│       │   └── main.py       # FastAPI app entry point
│       ├── alembic/          # Database migrations
│       ├── tests/            # Test files
│       └── pyproject.toml    # Python dependencies
├── .github/                  # GitHub workflows (if added)
├── compose.yml              # Docker Compose configuration
├── nx.json                  # Nx workspace configuration
├── package.json             # Root dependencies and scripts
└── pnpm-workspace.yaml      # pnpm workspace configuration
```

## 🏗️ Getting Started

### Prerequisites

- **Node.js** (18.x or later)
- **pnpm** (8.x or later)
- **Python** (3.9 or later)
- **uv** (Python package installer)
- **Docker** & **Docker Compose** (optional, for containerized development)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd the-codex
   ```

2. **Install dependencies**

   ```bash
   # Install Node.js dependencies
   pnpm install

   # Install Python dependencies
   nx run api:install
   # or manually:
   cd packages/api && uv sync
   ```

3. **Set up environment variables**

   ```bash
   # Copy environment template (when available)
   cp .env.example .env

   # Edit .env with your configuration
   # Database URL, API keys, etc.
   ```

### Development

#### Start All Services

```bash
# Start both frontend and backend in development mode
pnpm dev
# or
nx run-many -t dev
```

#### Individual Services

**Frontend (Next.js)**

```bash
nx dev web
# or
cd packages/web && npm run dev
```

**Backend (FastAPI)**

```bash
nx dev api
# or
cd packages/api && uv run fastapi dev api/main.py
```

### Database Setup (API)

```bash
# Run database migrations
cd packages/api
uv run alembic upgrade head

# Create a new migration (when needed)
uv run alembic revision --autogenerate -m "description"
```

## 🧪 Testing

### Run All Tests

```bash
nx run-many -t test
```

### Individual Test Suites

**Frontend Tests**

```bash
nx test web
```

**Backend Tests**

```bash
nx test api
# or
cd packages/api && uv run pytest
```

## 🔍 Code Quality

### Linting

```bash
# Lint all projects
pnpm lint
# or
nx run-many -t lint

# Lint specific project
nx lint web
nx lint api
```

### Formatting

```bash
# Format backend code
nx format api

# Format frontend code (via ESLint)
nx lint web --fix
```

## 🏗️ Building

### Build All Projects

```bash
nx run-many -t build
```

### Individual Builds

**Frontend**

```bash
nx build web
```

**Backend**

```bash
nx build api
```

## 🐳 Docker Development

### Using Docker Compose

```bash
# Start all services with Docker
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🤝 Contributing

1. **Commit Convention**: This project uses [Conventional Commits](https://www.conventionalcommits.org/)

   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `style:` for formatting
   - `refactor:` for code refactoring
   - `test:` for adding tests

2. **Pre-commit Hooks**: Husky runs linting and formatting on commit

3. **Development Workflow**:

   ```bash
   # Create feature branch
   git checkout -b feature/your-feature

   # Make changes and commit
   git add .
   git commit -m "feat: add new feature"

   # Push and create PR
   git push origin feature/your-feature
   ```

## 🔧 API Documentation

When running the FastAPI backend, visit:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

**Built with ❤️**
