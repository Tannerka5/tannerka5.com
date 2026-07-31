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
