import type { APIRoute } from 'astro';
import { projects } from '../../data/projects';
import { blogPosts } from '../../data/blog-posts';

const siteUrl = 'https://tannerka5.com'; // Update with your actual domain

interface SitemapPage {
  path: string;
  changefreq: string;
  priority: string;
  lastmod?: string;
}

export const GET: APIRoute = () => {
  const staticPages: SitemapPage[] = [
    { path: '', changefreq: 'weekly', priority: '1.0' },
    { path: '/about', changefreq: 'monthly', priority: '0.8' },
    { path: '/projects', changefreq: 'weekly', priority: '0.9' },
    { path: '/blog', changefreq: 'weekly', priority: '0.9' },
    { path: '/contact', changefreq: 'monthly', priority: '0.7' },
  ];

  const projectPages: SitemapPage[] = projects.map(p => ({
    path: `/projects/${p.slug}`,
    changefreq: 'monthly',
    priority: '0.8'
  }));

  const blogPages: SitemapPage[] = blogPosts
    .filter(p => p.published)
    .map(p => ({
      path: `/blog/${p.slug}`,
      changefreq: 'monthly',
      priority: '0.8',
      lastmod: p.date
    }));

  const allPages: SitemapPage[] = [...staticPages, ...projectPages, ...blogPages];
  const currentDate = new Date().toISOString();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${siteUrl}${page.path}</loc>
    <lastmod>${page.lastmod || currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
