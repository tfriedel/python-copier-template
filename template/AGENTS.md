# Development Guidelines

This document contains critical information about working with this codebase.
Follow these guidelines precisely with a focus on maintainability and clear separation of concerns.

## Quick Start

For new repository setup, use justfile:

```bash
just setup  # Installs dependencies and pre-commit hooks
```

Common development commands:

```bash
just --list      # Show all available commands
just format      # Format code
just lint        # Check code quality
just typecheck   # Type check with ty
just complexity  # Check cognitive complexity (≤ 15)
just test        # Run tests
just ci          # Run full CI pipeline
```

## Core Development Principles

### Fundamental Philosophy

- **Business behavior first**: Focus on what the system does for users, not technical implementation
- **Emergent design**: Let architecture evolve based on real needs, not speculation
- **Simplicity over complexity**: Choose the simplest solution that delivers value
- **Clear boundaries**: Separate business logic from infrastructure
- **Function composition**: Build complex behavior by composing simple, focused functions
- **Continuous improvement**: Each development cycle is an opportunity to improve both tests and implementation

### Package Management

- ONLY use uv, NEVER pip
- Installation: `uv add package`
- Upgrading: `uv add --dev package --upgrade-package package`
- FORBIDDEN: `uv pip install`, `@latest` syntax

### Pre-commit Hooks (prek)

This template uses `prek`, a Rust-based drop-in replacement for pre-commit that runs **10x faster** while using half the disk space.

**Why prek:**
- Dramatically faster hook execution for faster commits
- Reduced disk usage compared to Python-based pre-commit
- Full compatibility with existing pre-commit hooks
- Used by major projects like Apache Airflow and PDM

**Configuration:** `.pre-commit-config.yaml` (same as traditional pre-commit)

### Version Drift Prevention

This template uses `sync-with-uv` to eliminate version drift between `uv.lock` and `.pre-commit-config.yaml`.

**How it works:**
- `uv.lock` is the single source of truth for all tool versions
- The `sync-with-uv` pre-commit hook runs before all other hooks
- It automatically updates tool versions in `.pre-commit-config.yaml` to match `uv.lock`
- No manual synchronization needed when upgrading dependencies

**Benefits:**
- Consistent tool behavior between local development and CI
- Eliminates unexpected pre-commit failures from version mismatches
- Reduces manual maintenance of configuration files

**Usage:**
When you upgrade a tool with `uv add --dev tool --upgrade-package tool`, the next commit automatically syncs the version to `.pre-commit-config.yaml`.

### Code Quality Standards

- Type hints required for all code
- Follow existing patterns exactly
- Use Google style for docstrings
- Business-focused naming: Names should describe business value, not technical details
- **Complexity enforcement**: Two tools work together:
  - **Ruff PLR0912**: Catches functions with too many branches (>12)
  - **complexipy**: Enforces cognitive complexity ≤ 15 for all functions. Run `just complexity` to check

## Test-Driven Development (TDD)

### The TDD Mindset

- **Red-Green-Refactor cycle**: Write failing test → Make it pass → Improve the code
- **Tests define behavior**: Each test documents a specific business requirement
- **Design emergence**: Let the tests guide you to discover the right abstractions
- **Refactor when valuable**: Actively and frequently look for opportunities to make meaningful refactorings

### Critical TDD Rules

- **ONE TEST AT A TIME**: Add only a single test, see it fail (RED), implement minimal code to pass (GREEN), refactor (REFACTOR), repeat
- **MINIMAL IMPLEMENTATION**: Fix only the immediate test failure - do not implement complete functionality until tests demand it
- **NO BULK TEST ADDITION**: Never add multiple tests simultaneously - Probity will block this
- **FAIL FIRST**: Always run the new test to confirm it fails before writing implementation code
- **INCREMENTAL PROGRESS**: Each test should drive one small increment of functionality

### Refactoring Triggers

After each green test, look for:

- **Duplication to extract**: Shared logic that can be centralized
- **Complex expressions to simplify**: Break down complicated logic into clear steps
- **Emerging patterns**: Abstractions suggested by repeated structures
- **Better names**: Clarify intent through descriptive naming
- **Code smells to eliminate**:
  - Logic crammed together without clear purpose
  - Mixed concerns (business logic, calculations, data handling in one place)
  - Hard-coded values that should be configurable
  - Similar operations repeated inline instead of abstracted
  - High coupling between components
  - Poor extensibility requiring core logic changes

### Testing Best Practices

- Framework: `uv run --frozen pytest`
- **Shared code reuse**: Import shared logic from production code, never duplicate in tests
- **Test data factories**: Create functions that generate test data with sensible defaults
- **Business-focused tests**: Test names describe business value, not technical details
- Coverage: test edge cases and errors
- New features require tests
- Bug fixes require regression tests

### Test Impact Analysis (testmon)

`just test` (the default) uses pytest-testmon to run only tests affected by your changes:

- First run builds the dependency database (slower)
- Subsequent runs only execute affected tests
- Database stored in `.testmondata` (gitignored, per-worktree)
- Use `just test-full` to run all tests (used by `just check` and CI)
- Run `just test-reset` if the database gets corrupted

### Common TDD Violations to Avoid

- Adding 4+ tests at once (blocked by Probity)
- Over-implementing when test only needs imports or basic structure
- Writing implementation code before seeing test fail
- Implementing features not yet demanded by tests

## Version Control & Security

### Git Practices

- Follow the Conventional Commits style on commit messages
- When making changes, always make sure you are on a feature branch

### Security Requirements

- API keys MUST be in .env files
- .env files MUST be in .gitignore
- Never commit secrets to version control
- The repo's pre-commit hooks include gitleaks; do NOT use `git commit --no-verify` to bypass it
- After first push to GitHub, run `just enable-push-protection` to enable server-side push protection (the only layer that prevents secrets from reaching the remote once the local hook is bypassed)

## Code Formatting and Linting

Use justfile for all formatting and linting:

```bash
just format      # Format code with ruff
just lint        # Check code quality
just lint-fix    # Auto-fix linting issues
just pre-commit  # Run pre-commit hooks manually
```

Manual commands (if needed):

1. Ruff
   - Format: `uv run --frozen ruff format .`
   - Check: `uv run --frozen ruff check .`
   - Fix: `uv run --frozen ruff check . --fix`
2. Prek (pre-commit hooks)
   - Config: `.pre-commit-config.yaml`
   - Install: `just install-hooks` (or `uv run prek install`)
   - Runs: automatically on git commit
   - Tools: sync-with-uv, uv-lock, Ruff, ty

## Development Workflow Best Practices

**TDD Development Cycle:**

1. Write ONE test that fails (RED)
2. Run test to confirm failure: `uv run --frozen pytest path/to/test.py::test_name -v`
3. Write minimal code to make test pass (GREEN)
4. Run test to confirm it passes
5. Refactor if needed while keeping tests green (REFACTOR)
6. Run `just lint` to catch issues like unused imports
7. Repeat with next single test

**Code Quality Workflow:**

- Run `just lint` frequently during development (not just at the end)
- Use code-reviewer agent proactively after implementing significant features
- Consider error scenarios during initial design, not as afterthoughts
- Test both happy paths and error paths for every feature

**Agent Usage:**

- Use `code-reviewer` agent after completing features or before PRs
- Use `debugger` agent when encountering unexpected test failures or errors
- Use specialized agents early in development, not just for final review

## Release Workflow

```bash
just release v0.5.0          # Specify version (interactive)
just release v0.5.0 --yes    # Skip confirmation (for automation)
just release-auto            # Auto-bump from conventional commits
just release-auto --yes      # Auto-bump, skip confirmation
```

The `release` command will:

1. Validate version format and check for uncommitted changes
2. Generate CHANGELOG.md for the new version using git-cliff
3. Show a preview of the changelog changes
4. Ask for confirmation (unless `--yes` flag is used)
5. Commit the changelog with message "docs: update changelog for vX.Y.Z"
6. Create an annotated git tag on that commit
7. Show instructions for pushing

**Version numbering:**

- Version is derived from git tags (via uv-dynamic-versioning)
- Use semantic versioning: vMAJOR.MINOR.PATCH
- `release-auto` determines the bump from conventional commits:
  - `feat:` → **MINOR** bump
  - `fix:` → **PATCH** bump
  - `BREAKING CHANGE` or `feat!:`/`fix!:` → **MAJOR** bump

**After releasing:**

```bash
git push origin <branch-name>  # Push commits
git push origin <version-tag>  # Push tag
```
