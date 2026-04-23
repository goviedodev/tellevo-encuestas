# AGENTS.md

## Commands
- **Run server**: `uv run uvicorn main:app --reload --host 0.0.0.0 --port 8001`
- **Setup database**: `uv run python database_setup.py && uv run python create_encuesta_table.py`
- **Sync dependencies**: `uv sync`
- **Run single test**: No test framework configured
- **Format code**: No formatter configured (consider adding black/ruff)
- **Lint code**: No linter configured (consider adding ruff/flake8)

## Code Style
- **Imports**: Standard library → third-party → local imports (blank line between groups)
- **Types**: Use `typing.Optional`, `typing.List` for type hints; prefer Pydantic models for API data
- **Naming**: PascalCase for classes/models, snake_case for functions/variables/constants
- **Error handling**: Use try/except with specific exceptions, HTTPException for API errors
- **Database**: Always close connections in finally blocks; use parameterized queries
- **Formatting**: Use f-strings, 4-space indentation, consistent spacing
- **Documentation**: Include docstrings for public functions and classes
- **API**: Use FastAPI router pattern with prefixes; include response models
