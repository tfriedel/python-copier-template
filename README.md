# Python Copier Template

[![Copier](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/copier-org/copier/master/img/badge/badge-black.json)](https://github.com/copier-org/copier)
[![Test](https://github.com/tfriedel/python-copier-template/actions/workflows/test.yml/badge.svg)](https://github.com/tfriedel/python-copier-template/actions/workflows/test.yml)

A modern Python project template powered by [Copier](https://copier.readthedocs.io/) with [Probity](https://github.com/nizos/probity) integration for AI coding agents.

> **Note**: This is a fork of [mjun0812/python-copier-template](https://github.com/mjun0812/python-copier-template) with enhanced TDD workflow support (via Probity) and additional tooling.
>
> Original template by Junya Morioka - [Article](https://mjunya.com/en/posts/2025-06-15-python-template/) | [日本語記事](https://zenn.dev/mjun0812/articles/0ae2325d40ed20)

## Features

- 🚀 **Modern Python**: Support for Python 3.10-3.13
- 📦 **uv Package Manager**: Fast and reliable package management with [uv](https://github.com/astral-sh/uv)
- ⚡ **just Command Runner**: Clean, modern task runner with intuitive syntax
- 🐳 **Docker Support**: Complete Docker development environment
- 📦 **Devcontainer Support**: VS Code devcontainer for consistent development
- ✨ **AI Editor Support**: [AGENTS.md](https://agents.md) and
  [CLAUDE.md](https://docs.anthropic.com/en/docs/claude-code/overview) included for AI-powered development
- 📝 **Type Checking**: [ty](https://github.com/astral-sh/ty), Astral's fast Rust-based type checker (replaced an earlier Zuban integration)
- 🔍 **Code Quality**: Pre-configured Ruff for linting and formatting
- 🧠 **Complexity Limits**: [complexipy](https://github.com/rohaquinlop/complexipy) enforces cognitive complexity ≤ 15 per function
- 📋 **Dependency Audit**: [deptry](https://github.com/fpgmaas/deptry) catches missing/unused/transitive deps
- 🔒 **Secret Scanning**: [gitleaks](https://github.com/gitleaks/gitleaks) pre-commit hook blocks committed credentials
- 🧪 **Testing**: pytest with coverage, parallelism (xdist), mocking, network isolation (pytest-socket), and test impact analysis (pytest-testmon — only re-runs affected tests)
- 🛡️ **AI Agent Process Discipline**: [Probity](https://github.com/nizos/probity) enforces TDD and other rules across Claude Code, Codex, GitHub Copilot, and OpenCode
- 📊 **Modern Logging**: Loguru for intuitive, zero-config logging
- 🔧 **Pre-commit Hooks**: Automated code quality checks with prek (10x faster than traditional pre-commit) and sync-with-uv to eliminate version drift
- 🏷️ **Dynamic Versioning**: Automatic versioning from git tags (no manual version bumping!)
- 📝 **Changelog Generation**: Automated CHANGELOG.md from conventional commits
- 🏗️ **CI Ready**: GitHub Actions workflows with uv-cached installs for fast runs

## Quick Start

### Pre-Requirements

- [uv](https://docs.astral.sh/uv/): Fast Python package installer
- [just](https://just.systems/): Command runner (optional but recommended)

### Generate a New Project

```bash
uvx copier copy gh:tfriedel/python-copier-template your-project-name
```

Follow the interactive prompts to configure your project:

- **Project name**: Your project's name
- **Python version**: Choose from 3.10, 3.11, 3.12, or 3.13
- **Package name**: The name used for importing your package (e.g., `import package_name`)
- **Description**: A short description of your project
- **Author name**: Your name
- **Author email**: Your email address

### Development Setup

After generating your project:

```bash
cd your-project-name

# Quick setup (installs dependencies and pre-commit hooks)
just setup

# Or manually:
uv sync                    # Install dependencies
uv run prek install        # Install pre-commit hooks

# Run tests
just test                  # or: uv run pytest

# Run formatting, linting, and type checking
just format                # or: uv run ruff format .
just lint                  # or: uv run ruff check .
just typecheck             # or: uv run ty check

# Auto-fix linting issues
just lint-fix              # or: uv run ruff check . --fix

# See all available commands
just --list
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
Devcontainer will automatically install uv, Claude Code, and pre-commit hooks.

### Update Template

```bash
cd your-project-name
uvx copier update -A
```

## Project Structure

```text
your-project/
├── src/
│   └── your_project/          # Main package
├── tests/                     # Test files
├── docker/                    # Docker configuration
├── compose.yml               # Docker Compose setup
├── pyproject.toml            # Project configuration
└── README.md                 # Project documentation
```

## AI Editor Support

- [AGENTS.md(`./template/AGENTS.md`)](https://agents.md)
- [CLAUDE.md(`./template/CLAUDE.md`)](https://docs.claude.com/en/docs/claude-code/memory#claude-md-imports)

## Q&A

### Why just instead of make?

[just](https://just.systems/) is a modern command runner designed specifically for developer tasks, not build systems. It offers:
- Cleaner, more intuitive syntax without Make's quirks (no tab sensitivity, better error messages)
- Written in Rust, aligning with the modern toolchain (prek, ruff, ty, uv)
- Better cross-platform compatibility
- Developer-friendly features like recipe parameters and clear command listing

### Why ty instead of mypy, pyright, or zuban?

[ty](https://github.com/astral-sh/ty) is a Rust-based Python type checker from Astral (the makers of `uv` and `ruff`) that's 10-100× faster than mypy and Pyright. It fits naturally with the rest of the Astral toolchain used here. An earlier version of this template integrated [Zuban](https://zubanls.com/) (a mypy-compatible Rust checker) — ty won out because of the Astral integration. ty is currently in beta — see the [version policy](https://github.com/astral-sh/ty#version-policy) for details. If you prefer mypy, pyright, or zuban, swap it out by editing `pyproject.toml`, `.pre-commit-config.yaml`, and the `typecheck` recipe in the generated project's `justfile`.

## Support

- 📖 [Copier Documentation](https://copier.readthedocs.io/)
- 🐍 [uv Documentation](https://docs.astral.sh/uv/)
- ⚡ [just Documentation](https://just.systems/)
- 🔍 [Ruff Documentation](https://docs.astral.sh/ruff/)
