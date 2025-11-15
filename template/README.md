# {{project_name}}

{{description}}

## Features

- 🚀 **Modern Python**: Support for Python {{python_version}}+
- 📦 **uv Package Manager**: Fast and reliable package management with [uv](https://github.com/astral-sh/uv)
- 🐳 **Docker Support**: Complete Docker development environment
- 📦 **Devcontainer Support**: VS Code devcontainer for consistent development
- ✨ **AI Editor Support**: [Cursor rules](https://docs.cursor.com/context/rules) and [CLAUDE.md](https://docs.anthropic.com/en/docs/claude-code/overview) included for AI-powered development
- 🛡️ **TDD-Guard**: Automated TDD enforcement for Claude Code with real-time test-driven development validation
- 📝 **Type Hints**: Full type annotation support with modern Python features
- 🔍 **Code Quality**: Pre-configured Ruff for linting and formatting
- 🧪 **Testing**: pytest setup with example tests
- 🔧 **Pre-commit Hooks**: Automated code quality checks
- 🏗️ **CI Ready**: GitHub Actions workflows included
- 🔨 **Makefile**: Convenient commands for common development tasks

## Quick Start

### Pre-Requirements

- [uv](https://docs.astral.sh/uv/): Fast Python package installer
- [TDD-Guard](https://github.com/nizos/tdd-guard) (optional, for TDD enforcement with Claude Code): `npm install -g tdd-guard`

### Development Setup

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

### Docker Development Setup

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

### Update Template

This project was created from [python-copier-template](https://github.com/mjun0812/python-copier-template).
You can apply updates from the template using:

```bash
cd {{project_name}}
uvx copier update -A
```

## Project Structure

```text
{{project_name}}/
├── src/
│   └── {{package_name}}/          # Main package
├── tests/                          # Test files
├── docker/                         # Docker configuration
├── compose.yml                     # Docker Compose setup
├── pyproject.toml                  # Project configuration
└── README.md                       # Project documentation
```

## Q&A

### Why don't you use a type checker?

I'm waiting for stable release of [`ty`](https://github.com/astral-sh/ty).
You can install and use your preferred type checker.

## Support

- 📖 [Copier Documentation](https://copier.readthedocs.io/)
- 🐍 [uv Documentation](https://docs.astral.sh/uv/)
- 🔍 [Ruff Documentation](https://docs.astral.sh/ruff/)
