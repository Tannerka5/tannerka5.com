export interface Challenge {
    title: string;
    description: string;
    solution: string;
}

export interface MediaItem {
    type: 'video' | 'image' | 'embed';
    url: string;
    caption: string;
    thumbnail?: string;
}

export interface Metric {
    label: string;
    value: string;
}

export interface ProjectLinks {
    live?: string;
    github?: string;
    demo?: string;
}

export interface ProjectDetails {
    overview: string;
    problem: string;
    solution: string;
    challenges: Challenge[];
    learnings: string[];
    features: string[];
    media: MediaItem[];
    metrics?: Metric[];
}

export interface Project {
    id?: string;
    slug: string;
    title: string;
    shortDescription: string;
    fullDescription: string;
    role: string;
    timeline: string;
    techStack: string[];
    gradientFrom: string;
    gradientVia: string;
    gradientTo: string;
    logo?: string;
    icon?: string;
    links: ProjectLinks;
    detailed: ProjectDetails;
    order?: number;
    createdAt?: number;
    updatedAt?: number;
}
