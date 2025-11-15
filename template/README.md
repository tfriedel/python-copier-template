# {{project_name}}

{{description}}

## Features

- 🚀 **Modern Python**: Support for Python {{python_version}}+
- 📦 **uv Package Manager**: Fast and reliable package management
- 🐳 **Docker Support**: Complete Docker development environment
- 📦 **Devcontainer Support**: VS Code devcontainer for consistent development
- ✨ **AI Editor Support**: CLAUDE.md included for AI-powered development
- 🛡️ **TDD-Guard**: Automated TDD enforcement for Claude Code
- 📝 **Type Hints**: Full type annotation support
- 🔍 **Code Quality**: Pre-configured Ruff for linting and formatting
- 🧪 **Testing**: pytest setup with example tests
- 🔧 **Pre-commit Hooks**: Automated code quality checks
- 🔨 **Makefile**: Convenient commands for common development tasks

## Development Setup

### Pre-Requirements

- [uv](https://docs.astral.sh/uv/): Fast Python package installer
- [TDD-Guard](https://github.com/nizos/tdd-guard) (optional, for TDD enforcement with Claude Code): `npm install -g tdd-guard`

### Quick Setup

```bash
# Quick setup (installs dependencies and pre-commit hooks)
make setup

# Or manually:
# Install dependencies
uv sync

# Install pre-commit hooks
uv run pre-commit install
```

### Common Commands

```bash
# View all available commands
make help

# Testing
make test              # Run tests
make test-verbose      # Run tests with verbose output
make test-coverage     # Run tests with coverage report

# Code quality
make format            # Format code with ruff
make lint              # Check code quality
make lint-fix          # Auto-fix linting issues

# Development workflow
make ci                # Run full CI pipeline (format, lint, test)
make clean             # Clean up temporary files and caches
```

### Manual Commands (without Makefile)

```bash
# Run tests
uv run pytest

# Run formatting and linting (automatically runs on commit)
uv run ruff format .
uv run ruff check .
# Auto Fix
uv run ruff check . --fix
```

### Docker Development

The template includes a complete Docker setup:

```bash
# create uv.lock file
uv sync

# use the provided scripts
./docker/build.sh
./docker/run.sh # or./docker/run.sh (Command)

# Build and run with Docker Compose
docker compose build
docker compose up
```

### VS Code Devcontainer

Open the project in VS Code and use the "Reopen in Container" command for a fully configured development environment.
