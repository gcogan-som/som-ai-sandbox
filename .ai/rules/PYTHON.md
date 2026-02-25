# SOM Standard — Python Standards

> **Last Updated**: 2026-02-18
> **Applies To**: ML Models, Data Scripts, Backend Services

---

## 1. Project Structure
```
project/
├── src/
│   ├── __init__.py
│   └── main.py
├── tests/
├── pyproject.toml
└── README.md
```

## 2. Style Guide (PEP 8+)
- **Linter**: `ruff` (fast replacement for flake8/isort/black).
- **Formatter**: `ruff format` (Black compatible).
- **Type Checking**: `mypy --strict`.

## 3. Virtual Environments
- Always use a virtual environment (`.venv`).
- Track dependencies in `pyproject.toml` (using Poetry or Hatch) or `requirements.txt`.

## 4. Testing
- Use **pytest**.
- Place tests in `tests/` directory.
- Name files `test_*.py`.

## 5. ML/Data Security
- Never commit data files (`.csv`, `.parquet`) -> Use `.gitignore`.
- use `dvc` (Data Version Control) if tracking large datasets.
