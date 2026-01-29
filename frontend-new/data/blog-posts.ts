export interface BlogPost {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  readTime: string;
  tags: string[];
  published: boolean;
  coverImage?: string;
  author?: string;
  order?: number;
  createdAt?: number;
  updatedAt?: number;
}

export const blogPosts: BlogPost[] = [
  {
    content: "This is a test!",
    published: true,
    slug: "building-ella-rises-nonprofit-management",
    createdAt: 1768236659368,
    readTime: "7 min read",
    order: 0,
    coverImage: "https://tannerka5-portfolio-upload.s3.us-east-2.amazonaws.com/uploads/89454804-d32c-468a-ba31-002e4b7464dd/1768498995629-White_Elephant.png",
    date: "2024-12-15",
    updatedAt: 1768499051729,
    id: "d3d2e443-e601-4074-bbf5-0de0aa24383b",
    excerpt: "Lessons learned from developing a full-stack web application for a nonprofit organization, including database design, authentication, and AWS deployment.",
    tags: [
      "Node.js",
      "AWS",
      "MySQL",
      "Full-Stack"
    ],
    author: "Tanner Atkinson",
    title: "Building Ella Rises: A Nonprofit Management System"
  },
  {
    date: "2024-12-01",
    published: true,
    updatedAt: 1768236659429,
    slug: "aws-deployment-guide-elastic-beanstalk",
    createdAt: 1768236659429,
    readTime: "6 min read",
    order: 1,
    id: "8be80a7b-8bb4-43ae-8e8a-6c2c9bebd6dd",
    excerpt: "A comprehensive guide to deploying Express applications on AWS EB, including environment configuration, database connections, and troubleshooting common issues.",
    tags: [
      "AWS",
      "DevOps",
      "Node.js"
    ],
    author: "Tanner Atkinson",
    title: "Deploying Node.js Apps to AWS Elastic Beanstalk"
  },
  {
    date: "2024-11-20",
    published: true,
    updatedAt: 1768236659504,
    slug: "database-normalization-real-world",
    createdAt: 1768236659504,
    readTime: "10 min read",
    order: 2,
    id: "7d10732b-6092-4ae6-adc8-70bbb4c798c1",
    excerpt: "Practical examples of applying database normalization principles in production applications, with lessons from the NeighborAid project.",
    tags: [
      "Database",
      "SQL",
      "MySQL"
    ],
    author: "Tanner Atkinson",
    title: "Database Normalization in Real-World Projects"
  },
  {
    content: "",
    published: false,
    slug: "t",
    createdAt: 1768499166229,
    readTime: "5 min read",
    order: 3,
    date: "2026-01-15",
    coverImage: "",
    updatedAt: 1768499166229,
    id: "451b4b30-4f0f-4f65-80c8-518b20592431",
    tags: [],
    excerpt: "This is a test blog post",
    author: "Tanner Atkinson",
    title: "Test1"
  }
];
