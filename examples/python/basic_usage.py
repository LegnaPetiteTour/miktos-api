"""
Basic usage example of the Miktos API with Python.
"""
import os
import requests

# API configuration
API_BASE_URL = "https://api.miktos.ai/v1"
API_KEY = os.environ.get("MIKTOS_API_KEY", "your-api-key-here")

class MiktosClient:
    """Simple Python client for the Miktos API."""
    
    def __init__(self, api_key, base_url=API_BASE_URL):
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
    
    def authenticate(self, email, password):
        """Get an authentication token."""
        response = requests.post(
            f"{self.base_url}/auth/token",
            json={"email": email, "password": password}
        )
        response.raise_for_status()
        data = response.json()
        self.api_key = data["access_token"]
        self.headers["Authorization"] = f"Bearer {self.api_key}"
        return data
    
    def list_projects(self, skip=0, limit=100):
        """List all user projects."""
        response = requests.get(
            f"{self.base_url}/projects",
            headers=self.headers,
            params={"skip": skip, "limit": limit}
        )
        response.raise_for_status()
        return response.json()
    
    def create_project(self, name, description=None, context_notes=None, repository_url=None):
        """Create a new project."""
        data = {
            "name": name,
            "description": description,
            "context_notes": context_notes,
            "repository_url": repository_url
        }
        # Remove None values
        data = {k: v for k, v in data.items() if v is not None}
        
        response = requests.post(
            f"{self.base_url}/projects",
            headers=self.headers,
            json=data
        )
        response.raise_for_status()
        return response.json()
    
    def generate_text(self, project_id, model, messages, temperature=0.7, max_tokens=1024):
        """Generate text using the specified model."""
        data = {
            "project_id": project_id,
            "model": model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens
        }
        
        response = requests.post(
            f"{self.base_url}/generate",
            headers=self.headers,
            json=data
        )
        response.raise_for_status()
        return response.json()
    
    def generate_text_stream(self, project_id, model, messages, temperature=0.7, max_tokens=1024):
        """Generate text using the specified model with streaming."""
        data = {
            "project_id": project_id,
            "model": model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "stream": True
        }
        
        with requests.post(
            f"{self.base_url}/generate",
            headers=self.headers,
            json=data,
            stream=True
        ) as response:
            response.raise_for_status()
            for line in response.iter_lines():
                if line:
                    # Process the streamed response 
                    # In a real implementation, you would parse the SSE format
                    yield line.decode('utf-8')


# Example usage
def main():
    client = MiktosClient(API_KEY)
    
    # Creating a new project
    project = client.create_project(
        name="Python API Example",
        description="Testing the Miktos API with Python"
    )
    print(f"Created project: {project['name']} with ID: {project['id']}")
    
    # Generating text
    result = client.generate_text(
        project_id=project['id'],
        model="openai/gpt-4o",
        messages=[
            {"role": "user", "content": "Explain quantum computing in simple terms."}
        ],
        temperature=0.7
    )
    
    print("\nGenerated response:")
    print(result['content'])
    
    # List all projects
    projects = client.list_projects()
    print(f"\nTotal projects: {len(projects)}")
    
    # Example of streaming (just printing raw output here)
    print("\nStreaming example (raw output):")
    for chunk in client.generate_text_stream(
        project_id=project['id'],
        model="anthropic/claude-3-opus",
        messages=[
            {"role": "user", "content": "Write a short poem about AI."}
        ]
    ):
        print(chunk)


if __name__ == "__main__":
    main()
