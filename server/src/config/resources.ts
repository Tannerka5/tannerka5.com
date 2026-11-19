export const PROJECT_RESOURCE = {
  tableName: process.env.PROJECTS_TABLE || 'portfolio-projects',
  slugIndexName: 'slug-index',
  notFoundMessage: 'Project not found',
  updatableFields: [
    'title',
    'shortDescription',
    'fullDescription',
    'role',
    'timeline',
    'techStack',
    'gradientFrom',
    'gradientVia',
    'gradientTo',
    'logo',
    'icon',
    'links',
    'detailed',
    'order',
  ] as const,
};

export const BLOG_POST_RESOURCE = {
  tableName: process.env.BLOG_POSTS_TABLE || 'portfolio-blog-posts',
  slugIndexName: 'slug-index',
  notFoundMessage: 'Blog post not found',
  updatableFields: [
    'title',
    'excerpt',
    'content',
    'date',
    'readTime',
    'tags',
    'published',
    'coverImage',
    'author',
    'order',
  ] as const,
};

// Note: Users table should have a GSI named 'username-index' with 'username' as partition key
export const USERS_TABLE = process.env.USERS_TABLE || 'portfolio-users';
export const USERNAME_INDEX_NAME = 'username-index';

export const ROUTE_SEGMENTS = {
  authLogin: '/auth/login',
  upload: 'upload',
  projects: 'projects',
  blogPosts: 'blog-posts',
  blog: 'blog',
  reorder: 'reorder',
} as const;
