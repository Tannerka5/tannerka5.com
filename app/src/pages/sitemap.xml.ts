import type { APIRoute } from 'astro';
import { getProjectsPublic, getBlogPostsPublic } from '../lib/api-server';
import type { Project } from '../types/project';
import type { BlogPost } from '../types/blog-post';

const SITE_URL = 'https://tannerka5.com'; // Update with your actual domain

interface SitemapPage {
    path: string;
    changefreq: string;
    priority: string;
    lastmod?: string;
}

export const GET: APIRoute = async () => {
    let projects: Project[] = [];
    let publishedBlogPosts: BlogPost[] = [];

    try {
        const [projectsResponse, blogPostsResponse] = await Promise.all([
            getProjectsPublic(),
            getBlogPostsPublic(),
        ]);
        projects = projectsResponse.projects || [];
        publishedBlogPosts = (blogPostsResponse.posts || []).filter((post) => post.published);
    } catch (error) {
        console.error('Failed to fetch content for sitemap:', error);
    }

    const staticPages: SitemapPage[] = [
        { path: '', changefreq: 'weekly', priority: '1.0' },
        { path: '/about', changefreq: 'monthly', priority: '0.8' },
        { path: '/projects', changefreq: 'weekly', priority: '0.9' },
        { path: '/blog', changefreq: 'weekly', priority: '0.9' },
        { path: '/contact', changefreq: 'monthly', priority: '0.7' },
        { path: '/privacy', changefreq: 'yearly', priority: '0.3' },
    ];

    const projectPages: SitemapPage[] = projects.map((project) => ({
        path: `/projects/${project.slug}`,
        changefreq: 'monthly',
        priority: '0.8',
        lastmod: project.updatedAt ? new Date(project.updatedAt).toISOString() : undefined,
    }));

    const blogPages: SitemapPage[] = publishedBlogPosts.map((post) => ({
        path: `/blog/${post.slug}`,
        changefreq: 'monthly',
        priority: '0.8',
        lastmod: post.date,
    }));

    const allPages: SitemapPage[] = [...staticPages, ...projectPages, ...blogPages];
    const currentDate = new Date().toISOString();

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
    .map(
        (page) => `  <url>
    <loc>${SITE_URL}${page.path}</loc>
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
