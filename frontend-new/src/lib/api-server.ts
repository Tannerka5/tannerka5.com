// Server-side API client for Astro pages (no browser dependencies)

const API_BASE_URL = 
  import.meta.env.PUBLIC_API_URL || 
  import.meta.env.PUBLIC_API_BASE_URL || 
  'https://api.tannerka5.com';

export async function getBlogPostsPublic() {
  const response = await fetch(`${API_BASE_URL}/blog-posts`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json() as Promise<{ posts: any[] }>;
}

export async function getBlogPostPublic(slug: string) {
  const response = await fetch(`${API_BASE_URL}/blog-posts/${slug}`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json() as Promise<{ post: any }>;
}

export async function getProjectsPublic() {
  const response = await fetch(`${API_BASE_URL}/projects`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json() as Promise<{ projects: any[] }>;
}

export async function getProjectPublic(slug: string) {
  const response = await fetch(`${API_BASE_URL}/projects/${slug}`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json() as Promise<{ project: any }>;
}
