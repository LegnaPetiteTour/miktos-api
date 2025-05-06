/**
 * Basic usage example of the Miktos API with Node.js
 */

const fetch = require('node-fetch');

// API configuration
const API_BASE_URL = 'https://api.miktos.ai/v1';
const API_KEY = process.env.MIKTOS_API_KEY || 'your-api-key-here';

class MiktosClient {
  constructor(apiKey, baseUrl = API_BASE_URL) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Get an authentication token
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Auth token response
   */
  async authenticate(email, password) {
    const response = await fetch(`${this.baseUrl}/auth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      throw new Error(`Authentication failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    this.apiKey = data.access_token;
    this.headers['Authorization'] = `Bearer ${this.apiKey}`;
    return data;
  }

  /**
   * List all user projects
   * @param {number} skip - Number of projects to skip
   * @param {number} limit - Maximum number of projects to return
   * @returns {Promise<Array>} List of projects
   */
  async listProjects(skip = 0, limit = 100) {
    const response = await fetch(
      `${this.baseUrl}/projects?skip=${skip}&limit=${limit}`,
      { headers: this.headers }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to list projects with status: ${response.status}`);
    }
    
    return response.json();
  }

  /**
   * Create a new project
   * @param {string} name - Project name
   * @param {string} description - Project description
   * @param {string} contextNotes - Additional context notes
   * @param {string} repositoryUrl - Git repository URL
   * @returns {Promise<Object>} Created project
   */
  async createProject(name, description = null, contextNotes = null, repositoryUrl = null) {
    const data = {
      name,
      description,
      context_notes: contextNotes,
      repository_url: repositoryUrl
    };
    
    // Remove null values
    Object.keys(data).forEach(key => {
      if (data[key] === null) {
        delete data[key];
      }
    });
    
    const response = await fetch(`${this.baseUrl}/projects`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create project with status: ${response.status}`);
    }
    
    return response.json();
  }

  /**
   * Generate text using the specified model
   * @param {string} projectId - Project ID
   * @param {string} model - Model identifier (e.g., "openai/gpt-4o")
   * @param {Array} messages - Array of message objects with role and content
   * @param {number} temperature - Sampling temperature
   * @param {number} maxTokens - Maximum tokens to generate
   * @returns {Promise<Object>} Generation result
   */
  async generateText(projectId, model, messages, temperature = 0.7, maxTokens = 1024) {
    const data = {
      project_id: projectId,
      model,
      messages,
      temperature,
      max_tokens: maxTokens
    };
    
    const response = await fetch(`${this.baseUrl}/generate`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Text generation failed with status: ${response.status}`);
    }
    
    return response.json();
  }

  /**
   * Generate text using the specified model with streaming
   * @param {string} projectId - Project ID
   * @param {string} model - Model identifier (e.g., "openai/gpt-4o")
   * @param {Array} messages - Array of message objects with role and content
   * @param {number} temperature - Sampling temperature
   * @param {number} maxTokens - Maximum tokens to generate
   * @param {function} onChunk - Callback function for each chunk
   * @returns {Promise<void>}
   */
  async generateTextStream(projectId, model, messages, onChunk, temperature = 0.7, maxTokens = 1024) {
    const data = {
      project_id: projectId,
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
      stream: true
    };
    
    const response = await fetch(`${this.baseUrl}/generate`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Text generation failed with status: ${response.status}`);
    }
    
    // Process the response as a stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      onChunk(chunk);
    }
  }
}

// Example usage
async function main() {
  const client = new MiktosClient(API_KEY);
  
  try {
    // Creating a new project
    const project = await client.createProject(
      'JavaScript API Example',
      'Testing the Miktos API with Node.js'
    );
    console.log(`Created project: ${project.name} with ID: ${project.id}`);
    
    // Generating text
    const result = await client.generateText(
      project.id,
      'openai/gpt-4o',
      [
        { role: 'user', content: 'Explain quantum computing in simple terms.' }
      ],
      0.7
    );
    
    console.log('\nGenerated response:');
    console.log(result.content);
    
    // List all projects
    const projects = await client.listProjects();
    console.log(`\nTotal projects: ${projects.length}`);
    
    // Example of streaming
    console.log('\nStreaming example:');
    await client.generateTextStream(
      project.id,
      'anthropic/claude-3-opus',
      [
        { role: 'user', content: 'Write a short poem about AI.' }
      ],
      (chunk) => console.log(chunk),
      0.7
    );
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the example if this file is executed directly
if (require.main === module) {
  main();
}

module.exports = MiktosClient;
