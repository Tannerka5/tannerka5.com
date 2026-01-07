export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  published: boolean;
  coverImage?: string;
  author?: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'building-ella-rises-nonprofit-management',
    title: 'Building Ella Rises: A Nonprofit Management System',
    excerpt: 'Lessons learned from developing a full-stack web application for a nonprofit organization, including database design, authentication, and AWS deployment.',
    date: '2024-12-15',
    readTime: '8 min read',
    tags: ['Node.js', 'AWS', 'MySQL', 'Full-Stack'],
    published: true,
    coverImage: '/images/blog/ella-rises-cover.jpg',
    author: 'Tanner Atkinson',
  },
  {
    slug: 'aws-deployment-guide-elastic-beanstalk',
    title: 'Deploying Node.js Apps to AWS Elastic Beanstalk',
    excerpt: 'A comprehensive guide to deploying Express applications on AWS EB, including environment configuration, database connections, and troubleshooting common issues.',
    date: '2024-12-01',
    readTime: '6 min read',
    tags: ['AWS', 'DevOps', 'Node.js'],
    published: true,
    author: 'Tanner Atkinson',
  },
  {
    slug: 'database-normalization-real-world',
    title: 'Database Normalization in Real-World Projects',
    excerpt: 'Practical examples of applying database normalization principles in production applications, with lessons from the NeighborAid project.',
    date: '2024-11-20',
    readTime: '10 min read',
    tags: ['Database', 'SQL', 'MySQL'],
    published: true,
    author: 'Tanner Atkinson',
  },
];
