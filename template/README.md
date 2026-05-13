# {{project_name}}

{{description}}

## Features

- 🚀 **Modern Python**: Support for Python {{python_version}}+
- 📦 **uv Package Manager**: Fast and reliable package management with [uv](https://github.com/astral-sh/uv)
- 🐳 **Docker Support**: Complete Docker development environment
- 📦 **Devcontainer Support**: VS Code devcontainer for consistent development
- ✨ **AI Editor Support**: [Cursor rules](https://docs.cursor.com/context/rules) and [CLAUDE.md](https://docs.anthropic.com/en/docs/claude-code/overview) included for AI-powered development
- 🛡️ **Probity**: Process discipline for AI coding agents (TDD enforcement and more) — works with Claude Code, Codex, GitHub Copilot, and any agent that reads Claude Code-compatible hooks (e.g. OpenCode)
- 📝 **Type Checking**: [ty](https://github.com/astral-sh/ty), Astral's fast Rust-based type checker (replaced an earlier Zuban integration)
- 🔍 **Code Quality**: Pre-configured Ruff for linting and formatting
- 🧠 **Complexity Limits**: [complexipy](https://github.com/rohaquinlop/complexipy) enforces cognitive complexity ≤ 15 per function
- 📋 **Dependency Audit**: [deptry](https://github.com/fpgmaas/deptry) catches missing/unused/transitive deps
- 🔒 **Secret Scanning**: [gitleaks](https://github.com/gitleaks/gitleaks) pre-commit hook blocks committed credentials
- 🧪 **Testing**: pytest with coverage (pytest-cov), nicer output (pytest-sugar), parallelism (pytest-xdist), mocking (pytest-mock), network isolation (pytest-socket), and **test impact analysis** (pytest-testmon — `just test` only re-runs tests affected by your changes)
- 📊 **Modern Logging**: Loguru for intuitive, zero-config logging
- 🔧 **Pre-commit Hooks**: Automated code quality checks with prek (10x faster than traditional pre-commit)
- 🔄 **Version Sync**: sync-with-uv eliminates version drift between uv.lock and pre-commit config
- 🏷️ **Dynamic Versioning**: Automatic versioning from git tags (no manual version bumping!)
- 📝 **Changelog Generation**: Automated CHANGELOG.md from conventional commits
- 🏗️ **CI Ready**: GitHub Actions workflows with uv-cached installs for fast runs
- ⚡ **justfile**: Modern command runner for common development tasks

## Quick Start

### Pre-Requirements

- [uv](https://docs.astral.sh/uv/): Fast Python package installer
- [just](https://just.systems/): Command runner (optional but recommended)
- [Node.js](https://nodejs.org/) (optional, for Probity): Required for AI agent process discipline (TDD enforcement, command/content guards)

### Development Setup

```bash
# Quick setup (initializes git, installs Probity, dependencies, and pre-commit hooks)
just setup

# Or manually:
# Initialize git repository (required for dynamic versioning)
git init

# Install Probity locally (optional, requires Node.js/npm)
# Local install (vs. global) is required so probity.config.mjs can resolve
# @anthropic-ai/claude-agent-sdk for the Haiku model override.
npm install

# Install dependencies
uv sync --dev

# Install pre-commit hooks
uv run prek install
```

#### Wiring Probity into other agents

Claude Code is wired up out of the box via `.claude/settings.json`. OpenCode reads
the same file, so it works without extra setup. For other agents:

- **OpenAI Codex**: enable `codex_hooks = true` in `~/.codex/config.toml`, then add
  a `PreToolUse` entry to `~/.codex/hooks.json` calling
  `npx @nizos/probity --agent codex` (matcher: `^(Bash|apply_patch|Edit|Write)$`).
- **GitHub Copilot Chat / CLI**: create `.github/hooks/probity.json` with a
  `preToolUse` hook calling `npx @nizos/probity --agent github-copilot-chat`
  (or `--agent github-copilot` for the CLI).

See the [Probity setup docs](https://github.com/nizos/probity/blob/main/docs/setup.md)
for the exact configuration shape per agent.

### Common Commands

```bash
# View all available commands
just --list

# Testing
just test              # Run tests
just test-verbose      # Run tests with verbose output
just test-coverage     # Run tests with coverage report

# Code quality
just format            # Format code with ruff
just lint              # Check code quality
just lint-fix          # Auto-fix linting issues

# Development workflow
just ci                # Run full CI pipeline (format, lint, test)
just changelog         # Generate/update CHANGELOG.md
just clean             # Clean up temporary files and caches
```

### Manual Commands (without justfile)

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

This project was created from [tfriedel/python-copier-template](https://github.com/tfriedel/python-copier-template), a fork of [mjun0812/python-copier-template](https://github.com/mjun0812/python-copier-template) with [Probity](https://github.com/nizos/probity) integration for AI agent process discipline.

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

### What type checker does this use?

This template includes [ty](https://github.com/astral-sh/ty), Astral's Rust-based type checker (10-100× faster than mypy/Pyright). An earlier version of this template integrated [Zuban](https://zubanls.com/) as a mypy-compatible alternative; ty was chosen instead because it fits the rest of the Astral toolchain (uv, ruff). ty is still in beta — if you prefer mypy, pyright, or zuban, you can swap it out by editing `pyproject.toml`, `.pre-commit-config.yaml`, and the `typecheck` recipe in `justfile`.

### How are tests sped up between runs?

The default `just test` uses [pytest-testmon](https://testmon.org/) to run only the tests affected by your recent changes. The dependency database is stored in `.testmondata` (gitignored). If it ever gets stale or corrupted, run `just test-reset` to rebuild it. CI uses `just test-full` to run everything regardless.

### What does deptry do?

[deptry](https://github.com/fpgmaas/deptry) (run via `just deptry`) scans `src/` for missing, unused, or misplaced (e.g. transitive) dependencies — catching the case where you `import` something that isn't in `pyproject.toml`, or carry a dev dep no one uses anymore. Wired into `just check` and `just ci`.

### What does complexipy do?

[complexipy](https://github.com/rohaquinlop/complexipy) enforces a cognitive-complexity ceiling of 15 per function across `src/`. It complements ruff's `PLR0912` (max-branches): together they keep functions readable. Run with `just complexity`.

### How does secret scanning work?

Two layers, only one of which actually *prevents* a leak:

1. **Local pre-commit hook** — [gitleaks](https://github.com/gitleaks/gitleaks) runs as a pre-commit hook and rejects commits containing credentials, API keys, or other secret-shaped strings. Bypassable with `--no-verify`, and only fires if `prek install` has run.
2. **GitHub push protection** — server-side block at GitHub's git transport. Once a secret reaches a commit, `git rm` doesn't unleak it (reflogs, mirrors, cached refs). Push protection is the only layer that prevents the push from being accepted in the first place.

After your first push to a GitHub remote, run:

```bash
just enable-push-protection
```

This enables both secret scanning and push protection on the remote via `gh api`. Free for public repos and (since 2024) for private repos. Configuration of the local gitleaks ruleset lives in the gitleaks defaults — add a project-specific `.gitleaks.toml` if you need to tune it.

### How does versioning work?

This template uses **dynamic versioning** from git tags - no manual version bumping required!

- Version is automatically derived from git tags using `uv-dynamic-versioning`
- Create a git tag (e.g., `v1.0.0`) to set your version
- The version in your built package will match the tag
- No need to manually update `pyproject.toml` for version changes

**Example workflow:**
```bash
# Make your changes and commit them
git commit -m "feat: add new feature"

# Create a version tag
git tag v1.0.0

# Build your package (version will be 1.0.0)
uv build
```

### How do I generate a changelog?

The template includes automated changelog generation from git commits using conventional commits:

```bash
# Generate/update CHANGELOG.md
just changelog
```

**Conventional commit format:**
```
type(scope): description

Examples:
- feat: add user authentication
- fix: resolve login bug
- docs: update installation guide
- chore: update dependencies
```

Supported types: `feat`, `fix`, `docs`, `perf`, `refactor`, `style`, `test`, `chore`

### What does Probity actually do, and how do I extend it?

[Probity](https://github.com/nizos/probity) intercepts every file write and shell
command your AI agent attempts and evaluates it against rules in
`probity.config.mjs` before letting it through. If a rule blocks, the agent
gets a reason it can act on instead of the action.

**What's enabled out of the box:**

- `enforceTdd()` scoped to `src/**` and `tests/**` — production-code writes are
  blocked unless the recent session shows a failing test motivating the change.
  - **Fast-path**: writes that add exactly one new `def test_*` function are
    allowed instantly via AST analysis (`@ast-grep/lang-python`) — no LLM call.
  - **Non-fast-path**: implementation writes fall through to an AI verdict.
    The default validator is overridden in `probity.config.mjs` to use
    `claude-haiku-4-5` instead of the host agent's session model, which is
    typically 10× cheaper. Auth piggybacks on your Claude Code login (or
    `ANTHROPIC_API_KEY` if not logged in).

**What you might add (deterministic, no LLM cost):**

| Rule | Use case |
|---|---|
| `forbidCommandPattern` | Block `pip install` (use `uv add`), `--no-verify` (don't skip hooks), `git push --force` (use `--force-with-lease`), `@latest` syntax |
| `forbidContentPattern` | Block `pdb.set_trace()` / `breakpoint()`, bare `# type: ignore`, `assert False` in production |
| `requireCommand` | Gate `git commit` on a recent `just lint`, gate `git push` on a recent `just test-full` |
| `enforceFilenameCasing({ style: 'snake_case' })` | PEP 8 filenames in `src/**` and `tests/**` |

**What you might add (custom rules, AI-judged):**

The rule contract is `(action, ctx) => Verdict`. With `ctx.agent.reason(prompt)`
you share Haiku with `enforceTdd` for things deterministic checks can't see —
for example, blocking writes to `pyproject.toml` that add dependencies without
a recent `uv add` command, or judging whether a `git commit -m "..."` message
is a valid Conventional Commit.

See the [Probity rules docs](https://github.com/nizos/probity/blob/main/docs/rules.md)
for built-in options and the
[configuration docs](https://github.com/nizos/probity/blob/main/docs/configuration.md)
for the custom-rule API.

### What logging library should I use?

The template includes [Loguru](https://github.com/Delgan/loguru) for modern, zero-config logging:

```python
from loguru import logger

logger.info("Application started")
logger.debug("Debug info: {}", some_var)
logger.error("Something went wrong!")

# Easy file logging with rotation
logger.add("logs/app_{time}.log", rotation="500 MB", retention="10 days")
```

## Support

- 📖 [Copier Documentation](https://copier.readthedocs.io/)
- 🐍 [uv Documentation](https://docs.astral.sh/uv/)
- ⚡ [just Documentation](https://just.systems/)
- 🔍 [Ruff Documentation](https://docs.astral.sh/ruff/)
- 🛡️ [Probity Documentation](https://github.com/nizos/probity/tree/main/docs)
