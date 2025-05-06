# cURL Examples for Miktós API

This directory contains cURL examples for interacting with the Miktós API. These examples can be run from the command line to test API endpoints directly.

## Authentication

```bash
# Get an authentication token
curl -X POST https://api.miktos.ai/v1/auth/token \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com", 
    "password": "your-password"
  }'
```

## Projects

### List Projects

```bash
curl -X GET https://api.miktos.ai/v1/projects \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Project

```bash
curl -X POST https://api.miktos.ai/v1/projects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My New Project", 
    "description": "Testing the API with cURL",
    "repository_url": "https://github.com/username/repository"
  }'
```

### Get Project Details

```bash
curl -X GET https://api.miktos.ai/v1/projects/YOUR_PROJECT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Messages

### List Project Messages

```bash
curl -X GET https://api.miktos.ai/v1/projects/YOUR_PROJECT_ID/messages \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Message

```bash
curl -X POST https://api.miktos.ai/v1/projects/YOUR_PROJECT_ID/messages \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "user",
    "content": "What is the capital of France?"
  }'
```

## Text Generation

### Generate Text

```bash
curl -X POST https://api.miktos.ai/v1/generate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "YOUR_PROJECT_ID",
    "model": "openai/gpt-4o",
    "messages": [
      {
        "role": "user",
        "content": "Explain quantum computing in simple terms."
      }
    ],
    "temperature": 0.7,
    "max_tokens": 1024
  }'
```

### Generate Text with Streaming

```bash
curl -X POST https://api.miktos.ai/v1/generate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "YOUR_PROJECT_ID",
    "model": "anthropic/claude-3-opus",
    "messages": [
      {
        "role": "user",
        "content": "Write a short poem about AI."
      }
    ],
    "temperature": 0.7,
    "max_tokens": 1024,
    "stream": true
  }'
```
