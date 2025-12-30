import type { APIRoute } from 'astro';
import { projects } from '../../data/projects';
import { blogPosts } from '../../data/blog-posts';

const siteUrl = 'https://tannerka5.com';

export const GET: APIRoute = () => {
  const staticPages = [
    '',
    '/about',
    '/projects',
    '/blog',
    '/contact',
  ];

  const projectPages = projects.map(p => `/projects/${p.slug}`);
  const blogPages = blogPosts
    .filter(p => p.published)
    .map(p => `/blog/${p.slug}`);

  const allPages = [...staticPages, ...projectPages, ...blogPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${siteUrl}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
