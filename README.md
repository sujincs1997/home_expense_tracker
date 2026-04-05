# Home Expense Tracker

A simple household expense tracker built with FastAPI.

## Installation

You can install the package using pip:

```bash
pip install .
```

Or for development:

```bash
pip install -e .
```

## Usage

After installation, you can run the application with:

```bash
expense-tracker
```

This will start the FastAPI server on http://localhost:8000

Alternatively, you can run it directly with uvicorn:

```bash
uvicorn expense_tracker.main:app --reload
```

## Features

- Track household expenses
- REST API for expense management
- Web interface for easy access 
