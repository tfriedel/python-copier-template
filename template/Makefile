# Makefile for Python Project Template
# Usage: make <target>
# Use 'make help' to see all available targets

.PHONY: help setup install-dev install-hooks format lint lint-fix test test-verbose test-coverage clean build check ci pre-commit update-deps lock sync info deps

# Default target
.DEFAULT_GOAL := help

## Setup and Installation

help: ## Show this help message
	@echo "Available targets:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

setup: ## Initialize a newly checked out repository
	@echo "🚀 Setting up development environment..."
	@$(MAKE) install-dev
	@$(MAKE) install-hooks
	@echo "✅ Setup complete! You're ready to develop."

install-dev: ## Install development dependencies
	@echo "📦 Installing development dependencies..."
	uv sync --dev

install-hooks: ## Install pre-commit hooks
	@echo "🪝 Installing pre-commit hooks..."
	uv run pre-commit install
	@echo "✅ Pre-commit hooks installed"

## Code Quality

format: ## Format code with ruff
	@echo "🎨 Formatting code..."
	uv run --frozen ruff format .
	@echo "✅ Code formatted"

lint: ## Lint code with ruff
	@echo "🔍 Linting code..."
	uv run --frozen ruff check .

lint-fix: ## Lint code and auto-fix issues
	@echo "🔧 Linting code with auto-fix..."
	uv run --frozen ruff check . --fix

## Testing

test: ## Run tests
	@echo "🧪 Running tests..."
	uv run --frozen pytest

test-verbose: ## Run tests with verbose output
	@echo "🧪 Running tests (verbose)..."
	uv run --frozen pytest -v

test-coverage: ## Run tests with coverage report
	@echo "🧪 Running tests with coverage..."
	uv run --frozen pytest --cov=src --cov-report=term-missing

## Build and Clean

build: ## Build the package
	@echo "🔨 Building package..."
	uv build

clean: ## Clean up temporary files and caches
	@echo "🧹 Cleaning up..."
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} +
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	find . -type d -name ".ruff_cache" -exec rm -rf {} +
	rm -rf dist/
	rm -rf build/
	@echo "✅ Cleanup complete"

## CI/Development Workflow

check: ## Run all code quality checks (lint + test)
	@echo "🔍 Running all checks..."
	@$(MAKE) lint
	@$(MAKE) test
	@echo "✅ All checks passed"

ci: ## Run full CI pipeline (format, lint, test)
	@echo "🤖 Running CI pipeline..."
	@$(MAKE) format
	@$(MAKE) lint
	@$(MAKE) test
	@echo "✅ CI pipeline complete"

pre-commit: ## Run pre-commit hooks on all files
	@echo "🪝 Running pre-commit hooks..."
	uv run pre-commit run --all-files

## Development Utilities

update-deps: ## Update all dependencies to latest versions
	@echo "📦 Updating dependencies..."
	uv lock --upgrade

lock: ## Generate/update lockfile
	@echo "🔒 Updating lockfile..."
	uv lock

sync: ## Sync environment with lockfile
	@echo "🔄 Syncing environment..."
	uv sync

## Project Info

info: ## Show project information
	@echo "📊 Project Information:"
	@echo "  Name: {{project_name}}"
	@echo "  Python: $$(uv run python --version)"
	@echo "  UV: $$(uv --version)"
	@echo "  Git branch: $$(git branch --show-current)"
	@echo "  Git status: $$(git status --porcelain | wc -l) changed files"
	@echo "  Pre-commit: $$(if [ -f .git/hooks/pre-commit ]; then echo 'installed'; else echo 'not installed'; fi)"

deps: ## Show dependency tree
	@echo "📋 Dependency tree:"
	uv tree
