// Get API URL from environment variable (must be prefixed with PUBLIC_ in Astro)
// Fallback to default if not set
const API_BASE_URL = 
  import.meta.env.PUBLIC_API_URL || 
  import.meta.env.PUBLIC_API_BASE_URL || 
  'https://api.tannerka5.com';

// Log API URL for debugging (always log, not just in dev)
if (typeof window !== 'undefined') {
  console.log('[API Client] API Base URL:', API_BASE_URL);
  if (!import.meta.env.PUBLIC_API_URL && !import.meta.env.PUBLIC_API_BASE_URL) {
    console.warn(
      '[API Client] Warning: PUBLIC_API_URL not set in .env file. Using default:', 
      API_BASE_URL
    );
    console.info('[API Client] To set it, add this to your .env file:');
    console.info('  PUBLIC_API_URL=https://bagyqubc43.execute-api.us-east-1.amazonaws.com/prod');
  }
}

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_token', token);
    }
  }

  getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('admin_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Construct full URL - ensure no double slashes
    const fullUrl = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    
    // Debug logging for upload requests
    if (endpoint.includes('/upload')) {
      console.log('[API Client] Upload request:', {
        endpoint,
        fullUrl,
        apiBaseUrl: API_BASE_URL,
        hasToken: !!token
      });
    }

    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    if (!response.ok) {
      // Enhanced error logging for debugging
      if (endpoint.includes('/upload')) {
        console.error('[API Client] Upload request failed:', {
          status: response.status,
          statusText: response.statusText,
          url: fullUrl,
          headers: Object.fromEntries(response.headers.entries())
        });
      }
      
      if (response.status === 401) {
        this.clearToken();
        throw new Error('Unauthorized');
      }
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async login(username: string, password: string) {
    const data = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    this.setToken(data.token);
    return data;
  }

  logout() {
    this.clearToken();
  }

  // Projects
  async getProjects() {
    return this.request<{ projects: any[] }>('/projects');
  }

  async getProject(slug: string) {
    return this.request<{ project: any }>(`/projects/${slug}`);
  }

  async createProject(project: any) {
    return this.request<{ project: any }>('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  }

  async updateProject(slug: string, project: any) {
    return this.request<{ message: string }>(`/projects/${slug}`, {
      method: 'PUT',
      body: JSON.stringify(project),
    });
  }

  async deleteProject(slug: string) {
    return this.request<{ message: string }>(`/projects/${slug}`, {
      method: 'DELETE',
    });
  }

  async reorderProjects(items: { id: string; order: number }[]) {
    return this.request<{ message: string }>('/projects/reorder', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
  }

  // Blog Posts
  async getBlogPosts() {
    return this.request<{ posts: any[] }>('/blog-posts');
  }

  async getBlogPost(slug: string) {
    return this.request<{ post: any }>(`/blog-posts/${slug}`);
  }

  async createBlogPost(post: any) {
    return this.request<{ post: any }>('/blog-posts', {
      method: 'POST',
      body: JSON.stringify(post),
    });
  }

  async updateBlogPost(slug: string, post: any) {
    return this.request<{ message: string }>(`/blog-posts/${slug}`, {
      method: 'PUT',
      body: JSON.stringify(post),
    });
  }

  async deleteBlogPost(slug: string) {
    return this.request<{ message: string }>(`/blog-posts/${slug}`, {
      method: 'DELETE',
    });
  }

  async reorderBlogPosts(items: { id: string; order: number }[]) {
    return this.request<{ message: string }>('/blog-posts/reorder', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
  }

  // Upload
  async getUploadUrl(filename: string, contentType: string, fileSize?: number) {
    return this.request<{ uploadUrl: string; url: string; key: string; expiresIn: number }>('/upload', {
      method: 'POST',
      body: JSON.stringify({ filename, contentType, fileSize }),
    });
  }

  // Public GET methods (don't require auth, but won't fail if token is present)
  async getProjectsPublic() {
    const response = await fetch(`${API_BASE_URL}/projects`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json() as Promise<{ projects: any[] }>;
  }

  async getProjectPublic(slug: string) {
    const response = await fetch(`${API_BASE_URL}/projects/${slug}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json() as Promise<{ project: any }>;
  }

  async getBlogPostsPublic() {
    const response = await fetch(`${API_BASE_URL}/blog-posts`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json() as Promise<{ posts: any[] }>;
  }

  async getBlogPostPublic(slug: string) {
    const response = await fetch(`${API_BASE_URL}/blog-posts/${slug}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json() as Promise<{ post: any }>;
  }
}

export const apiClient = new ApiClient();