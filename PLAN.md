# Implementation Plan: Template Enhancements

## Overview
This document outlines planned enhancements to the python-copier-template based on analysis of other modern Python templates. These features will be implemented to improve developer experience, automation, and project quality.

---

## 1. Dynamic Versioning from Git Tags

### What
Replace hardcoded version strings in `pyproject.toml` with automatic versioning derived from Git tags using `uv-dynamic-versioning`.

### Why
- **Eliminates manual version bumping**: No more commits just to change version numbers
- **Single source of truth**: Git tags/releases are the authoritative version
- **Streamlined releases**: Create a GitHub release → automatic versioning → automatic PyPI publish
- **Prevents version drift**: Impossible to have mismatched versions between git tags and package metadata
- **Industry standard**: Modern approach used by major Python projects

### Implementation Details
```toml
# In template/pyproject.toml
[build-system]
requires = ["hatchling", "uv-dynamic-versioning"]
build-backend = "hatchling.build"

[project]
# Remove: version = "0.0.1"
# Add: dynamic = ["version"]

[tool.hatch.version]
source = "uv-dynamic-versioning"

[tool.uv-dynamic-versioning]
vcs = "git"
style = "pep440"
bump = true
```

### Changes Required
- Update `template/pyproject.toml` with above configuration
- Add `uv-dynamic-versioning` to build requirements
- Remove hardcoded version string
- Update README with versioning workflow (how to create releases)

### References
- https://github.com/jlevy/simple-modern-uv/ (uses this approach)
- https://github.com/electromanager/uv-dynamic-versioning

---

## 2. Pytest Coverage Integration

### What
Add `pytest-cov` plugin to enable test coverage reporting and analysis.

### Why
- **Visibility into test quality**: See which code paths are tested
- **Track coverage over time**: Monitor coverage improvements/regressions
- **CI/CD integration**: Block PRs with low coverage
- **Identify dead code**: Find untested functions/modules
- **Already referenced**: Template has `just test-coverage` recipe that currently doesn't work!

### Implementation Details
```toml
# In template/pyproject.toml - dependency-groups.dev
"pytest-cov>=6.0.0",
"coverage[toml]>=7.6.0",
```

Add coverage configuration:
```toml
# In template/pyproject.toml
[tool.coverage.run]
source = ["src"]
omit = ["tests/*", "*/__init__.py"]

[tool.coverage.report]
exclude_lines = [
    "pragma: no cover",
    "def __repr__",
    "raise AssertionError",
    "raise NotImplementedError",
    "if __name__ == .__main__.:",
    "if TYPE_CHECKING:",
]
```

### Changes Required
- Add `pytest-cov` and `coverage` to dev dependencies
- Add `[tool.coverage.*]` configuration to `pyproject.toml`
- Update `.github/workflows/ci.yml` to run tests with coverage
- Consider adding coverage badge to README template

### Usage
```bash
just test-coverage  # Already exists in justfile!
uv run pytest --cov=src --cov-report=term-missing
uv run pytest --cov=src --cov-report=html  # HTML report
```

---

## 3. Pytest-Sugar

### What
Enhanced pytest output with better formatting, instant failure reporting, and progress bars.

### Why
- **Better developer experience**: Cleaner, more readable test output
- **Faster feedback**: See failures immediately, not at the end
- **Visual progress bars**: Know how long tests will take
- **No configuration needed**: Drop-in replacement for default pytest output
- **Small dependency**: Minimal overhead for significant UX improvement

### Implementation Details
```toml
# In template/pyproject.toml - dependency-groups.dev
"pytest-sugar>=1.0.0",
```

That's it! No configuration needed - pytest-sugar automatically enhances output.

### Changes Required
- Add `pytest-sugar>=1.0.0` to dev dependencies in `pyproject.toml`

### Benefits
- ✓/✗ symbols instead of dots and F's
- Instant failure output (don't wait until end)
- Progress bar showing test completion percentage
- Colored output for better readability

---

## 4. Loguru - Modern Logging

### What
Add `loguru` as the recommended logging library - a modern, zero-config alternative to Python's stdlib logging.

### Why
- **Better developer experience**: One import, intuitive API
- **No configuration boilerplate**: Works out of the box with sane defaults
- **Structured logging**: Easy JSON output for production
- **Better stack traces**: Automatically captures full context
- **String formatting**: Uses f-string style, not old % formatting
- **Easy file rotation**: Built-in rotation, retention, compression
- **Async support**: Non-blocking logging

### Implementation Details
```toml
# In template/pyproject.toml - dependencies (not dev!)
dependencies = [
    "loguru>=0.7.0",
]
```

Add example usage in template:
```python
# In template/src/{{package_name}}/__init__.py
from loguru import logger

# Example usage (can be in main.py or other files)
logger.info("Application started")
logger.debug("Debug information: {}", some_var)
logger.error("Something went wrong!")

# Easy configuration for production
logger.add("logs/app_{time}.log", rotation="500 MB", retention="10 days")
```

### Changes Required
- Add `loguru>=0.7.0` to main dependencies (not dev dependencies)
- Add example usage in template files or README
- Consider adding to main.py template with basic setup

### Comparison to stdlib logging
```python
# Old way (stdlib)
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
logger.info("User %s logged in", username)

# New way (loguru)
from loguru import logger
logger.info("User {} logged in", username)
```

---

## 5. .python-version File

### What
Generate a `.python-version` file containing the selected Python version from copier prompts.

### Why
- **Tool compatibility**: Read by pyenv, asdf, mise, and other version managers
- **IDE integration**: Some IDEs auto-detect Python version from this file
- **Team consistency**: Everyone uses the same Python version automatically
- **Explicit version**: Clear documentation of required Python version
- **Zero configuration**: Version managers read it automatically

### Implementation Details
Create new file in template:
```
# template/.python-version
{{python_version}}
```

For example, if user selects Python 3.12, the file contains:
```
3.12
```

### Changes Required
- Create `template/.python-version` file with `{{python_version}}` content
- No other changes needed - it's a simple text file

### Tools that use .python-version
- pyenv
- asdf
- mise (formerly rtx)
- Some IDEs (PyCharm, VS Code with extensions)

---

## 6. Git-Based Changelog Generator

### What
Automatically generate CHANGELOG.md from git commit history using conventional commits.

### Why
- **Automated documentation**: No manual changelog maintenance
- **Enforces commit conventions**: Encourages clear, structured commit messages
- **Release notes automation**: Auto-generate release notes from commits
- **Visibility**: Easy to see what changed between versions
- **Professional**: All serious projects should have a changelog

### Implementation Details

Option 1: **git-cliff** (Rust-based, fast, configurable)
```toml
# In template/pyproject.toml - dependency-groups.dev
"git-cliff>=2.8.0",
```

Option 2: **git-changelog** (Python-based, simpler)
```toml
# In template/pyproject.toml - dependency-groups.dev
"git-changelog>=2.5.0",
```

**Recommendation**: Use `git-cliff` - faster, more active development, better formatting.

### Configuration
Create `template/cliff.toml`:
```toml
[changelog]
header = """
# Changelog\n
All notable changes to this project will be documented in this file.\n
"""
body = """
{% for group, commits in commits | group_by(attribute="group") %}
    ### {{ group | upper_first }}
    {% for commit in commits %}
        - {{ commit.message | upper_first }}\
    {% endfor %}
{% endfor %}\n
"""
trim = true

[git]
conventional_commits = true
filter_unconventional = true
commit_parsers = [
  { message = "^feat", group = "Features" },
  { message = "^fix", group = "Bug Fixes" },
  { message = "^doc", group = "Documentation" },
  { message = "^perf", group = "Performance" },
  { message = "^refactor", group = "Refactoring" },
  { message = "^style", group = "Style" },
  { message = "^test", group = "Testing" },
  { message = "^chore", group = "Miscellaneous" },
]
```

### Add to justfile
```just
# Generate/update CHANGELOG.md
changelog:
    @echo "📝 Generating changelog..."
    uv run git-cliff -o CHANGELOG.md
    @echo "✅ CHANGELOG.md updated"
```

### Changes Required
- Add `git-cliff` to dev dependencies
- Create `template/cliff.toml` configuration
- Add `changelog` recipe to `template/justfile`
- Optionally add pre-commit hook to validate conventional commits
- Document conventional commit format in README

### Conventional Commit Format
```
feat: add user authentication
fix: resolve login bug
docs: update installation guide
chore: update dependencies
```

---

## Implementation Order (Recommended)

1. **pytest-cov** (5 min) - Easiest, fixes broken justfile recipe
2. **pytest-sugar** (2 min) - Trivial, immediate UX improvement
3. **.python-version** (2 min) - Single file addition
4. **loguru** (5 min) - Just add dependency + example
5. **Dynamic versioning** (15 min) - Requires pyproject.toml changes + testing
6. **Changelog generator** (20 min) - Needs configuration file + justfile updates

**Total estimated time**: ~50 minutes

---

## Testing Checklist

After implementation, test:
- [ ] Generate new project with copier
- [ ] Run `just test-coverage` (should work with pytest-cov)
- [ ] Run `just test` (should have prettier output with pytest-sugar)
- [ ] Verify `.python-version` file exists with correct version
- [ ] Import loguru in code, verify it works
- [ ] Create a git tag, verify dynamic versioning picks it up
- [ ] Make conventional commits, run `just changelog`, verify CHANGELOG.md
- [ ] Run `just ci` to ensure all quality checks pass
- [ ] Build package with `uv build`, verify version in wheel/sdist

---

## Documentation Updates Needed

Update `template/README.md` with:
- How to use conventional commits for changelog
- How versioning works (git tags → package version)
- Coverage commands and interpretation
- Loguru usage examples

Update main `README.md` with:
- New features in template (add to Features section)

---

## Additional Considerations

### Dynamic Versioning Notes
- Initial projects without tags will use version 0.0.0 or similar
- May want to document: "Create v0.1.0 tag to start versioning"
- Ensure CI/CD workflows have access to git history (fetch-depth: 0)

### Changelog Notes
- Users need to follow conventional commits for best results
- Consider adding a git commit template or pre-commit hook to validate format
- Document the format: `type(scope): description`

### Coverage Notes
- May want to add minimum coverage threshold in CI
- Consider adding coverage badge to README template
- Document coverage commands in README

---

## Out of Scope (For Later Consideration)

Items we explicitly decided NOT to include now:
- ❌ MkDocs documentation tools
- ❌ Codecov integration (no external services yet)
- ❌ PyPI publish workflow (can add later)
- ❌ Tox for multi-version testing (adds complexity)
- ❌ Deptry for dependency checking (nice-to-have)
