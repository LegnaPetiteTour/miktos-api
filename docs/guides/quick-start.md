# Quick Start Guide

## Introduction

This guide will help you quickly get started with the Miktós API.

## Authentication

To use the Miktós API, you'll need an API key. You can get one by:

1. Creating an account at [miktos.ai](https://miktos.ai)
2. Navigating to your profile settings
3. Generating a new API key

Once you have your API key, include it in all requests as a bearer token:

```http
Authorization: Bearer YOUR_API_KEY
```

## Creating a Project

Projects in Miktós help organize your AI interactions and maintain context across requests.

```python
import requests

response = requests.post(
    "https://api.miktos.ai/v1/projects",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    json={
        "name": "My First Project",
        "description": "Testing the Miktós API"
    }
)

project = response.json()
project_id = project["id"]
print(f"Created project with ID: {project_id}")
```

## Generating Text

Once you have a project, you can generate text using various AI models:

```python
response = requests.post(
    "https://api.miktos.ai/v1/generate",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    json={
        "project_id": project_id,
        "model": "openai/gpt-4o",
        "messages": [
            {"role": "user", "content": "Explain quantum computing in simple terms"}
        ],
        "temperature": 0.7,
        "max_tokens": 500
    }
)

result = response.json()
print(result["content"])
```

## Next Steps

- Check out the [API Reference](../reference/README.md) for detailed information
- See [example code](../../examples/) in various programming languages
- Learn about [Git repository integration](./git-integration.md)
