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
  links: {
    live?: string;
    github?: string;
    demo?: string;
  };
  detailed: {
    overview: string;
    problem: string;
    solution: string;
    challenges: Array<{
      title: string;
      description: string;
      solution: string;
    }>;
    learnings: string[];
    features: string[];
    media: Array<{
      type: 'video' | 'image' | 'embed';
      url: string;
      caption: string;
      thumbnail?: string;
    }>;
    metrics?: Array<{
      label: string;
      value: string;
    }>;
  };
  order?: number;
  createdAt?: number;
  updatedAt?: number;
}

export const projects: Project[] = [
  {
    links: {
      live: "https://ellarises-1-14-intex.is404.net/",
      github: "https://github.com/Tannerka5/INTEX--EllaRises"
    },
    gradientVia: "via-pink-200 dark:via-purple-900/40",
    slug: "ella-rises",
    createdAt: 1768236659076,
    order: 0,
    logo: "/images/ellarises-logo.png",
    role: "Full-Stack Developer",
    shortDescription: "Full-stack web application for nonprofit management featuring event scheduling, participant tracking, donation management, and role-based dashboards with secure authentication.",
    gradientFrom: "from-pink-100 dark:from-pink-900/40",
    updatedAt: 1769700374020,
    gradientTo: "to-purple-100 dark:to-purple-900/40",
    detailed: {
      overview: "Ella Rises needed a centralized system to manage their growing nonprofit operations. This platform streamlines event coordination, participant tracking, and donation management while providing real-time analytics.",
      features: [
        "Secure user authentication with role-based permissions",
        "Event creation and participant registration"
      ],
      problem: "The organization was managing data across multiple spreadsheets and manual processes, leading to inefficiencies, data inconsistencies, and difficulty tracking program impact.",
      solution: "Built a unified web application with role-based access control, automated workflows, and interactive dashboards that reduced administrative overhead by 60%.",
      challenges: [
        {
          title: "Complex Role-Based Access Control",
          solution: "Implemented middleware-based authentication with bcrypt password hashing and session management, creating custom route guards for each role.",
          description: "Multiple user types (admin, volunteer, participant) required different permissions and views."
        },
        {
          title: "Data Visualization Performance",
          solution: "Optimized SQL queries with proper indexing and implemented server-side aggregation, reducing load times from 8s to under 2s.",
          description: "Large datasets from events and donations caused slow dashboard load times."
        },
        {
          title: "AWS Deployment Configuration",
          solution: "Learned AWS networking, security groups, and environment variables. Documented the entire deployment process for future reference.",
          description: "First time deploying a full-stack application to AWS Elastic Beanstalk with RDS."
        }
      ],
      media: [
        {
          caption: "Full platform walkthrough showcasing key features",
          thumbnail: "/images/ellarises-thumb.jpg",
          type: "video",
          url: "/videos/ellarises-demo.mp4"
        },
        {
          type: "image",
          caption: "Admin dashboard with real-time analytics",
          url: "/images/ellarises-dashboard.png"
        }
      ],
      metrics: [
        {
          value: "150+",
          label: "Participants Managed"
        },
        {
          value: "45+",
          label: "Events Managed"
        },
        {
          value: "99.8%",
          label: "Uptime"
        }
      ],
      learnings: [
        "Deep understanding of authentication and authorization patterns",
        "Database design for multi-tenant applications",
        "AWS cloud infrastructure and deployment pipelines",
        "Importance of user testing",
        "Balancing feature requests with maintainable code"
      ]
    },
    techStack: [
      "Node.js",
      "Express",
      "MySQL",
      "AWS EB",
      "EJS",
      "bcrypt"
    ],
    id: "3e01a5ff-68ec-44fd-a9bf-fc20b359c1f7",
    fullDescription: "A comprehensive nonprofit management platform built for Ella Rises, empowering administrators to manage events, track participants, process donations, and generate insights through data visualization.",
    timeline: "Fall 2024 (3 months)",
    title: "Ella Rises Program Management System"
  },
  {
    links: {
      live: "https://neighboraid.is404.net/",
      github: "https://github.com/Tannerka5/NeighborAid"
    },
    gradientVia: "via-blue-100 dark:via-sky-900/40",
    slug: "neighboraid",
    createdAt: 1768236659147,
    order: 1,
    logo: "/images/neighboraid-logo.png",
    role: "Full-Stack Developer & Project Lead",
    shortDescription: "Community platform connecting neighbors to share emergency resources and strengthen disaster preparedness.",
    gradientFrom: "from-blue-50 dark:from-blue-900/40",
    updatedAt: 1768236659147,
    gradientTo: "to-sky-100 dark:to-sky-900/40",
    detailed: {
      overview: "NeighborAid empowers communities to be self-sufficient during emergencies by creating a network of shared resources and mutual aid.",
      features: [
        "Interactive neighborhood resource mapping",
        "Member profiles with skill/resource listings",
        "Secure messaging between neighbors",
        "Emergency alert system",
        "Resource sharing coordination"
      ],
      problem: "During natural disasters, neighbors often don't know what resources are available nearby or how to coordinate effectively.",
      solution: "Built a secure platform with geographic mapping, resource inventory, and neighbor profiles to facilitate emergency preparedness and response.",
      challenges: [
        {
          title: "HTTPS Configuration",
          solution: "Learned about Let's Encrypt, configured nginx as reverse proxy, and automated certificate renewal.",
          description: "Needed secure connections for sensitive neighbor data but unfamiliar with SSL/TLS setup."
        },
        {
          title: "Geographic Data Modeling",
          solution: "Implemented spatial indexing in MySQL and used Leaflet.js for interactive mapping.",
          description: "Efficiently querying nearby resources based on location was complex."
        }
      ],
      media: [
        {
          type: "image",
          caption: "Interactive resource map view",
          url: "/images/neighboraid-map.png"
        },
        {
          type: "image",
          caption: "User profile and resource management",
          url: "/images/neighboraid-profile.png"
        }
      ],
      metrics: [
        {
          value: "12",
          label: "Neighborhoods"
        },
        {
          value: "200+",
          label: "Resources Shared"
        },
        {
          value: "85",
          label: "Active Members"
        }
      ],
      learnings: [
        "Web security best practices (HTTPS, data encryption)",
        "Geographic information systems (GIS) basics",
        "Community-focused product design",
        "Accessibility considerations for diverse users"
      ]
    },
    techStack: [
      "Node.js",
      "Express",
      "MySQL",
      "AWS",
      "HTTPS",
      "Leaflet.js"
    ],
    id: "f950ac1d-62ad-4b23-b27a-68962e6bd24b",
    title: "NeighborAid Emergency Preparedness",
    fullDescription: "A neighborhood coordination platform that helps communities prepare for emergencies by mapping available resources, connecting neighbors, and facilitating resource sharing.",
    timeline: "Winter 2024 (4 months)"
  },
  {
    links: {
      live: "https://tannerka5.com"
    },
    gradientVia: "via-primary-light dark:via-primary",
    icon: "cloud",
    slug: "cloud-portfolio",
    createdAt: 1768236659213,
    order: 2,
    role: "Developer & DevOps",
    shortDescription: "Scalable, cloud-hosted portfolio built on AWS with S3, CloudFront, and Cloudflare DNS.",
    gradientFrom: "from-primary dark:from-primary-dark",
    updatedAt: 1768236659213,
    gradientTo: "to-secondary dark:to-secondary-dark",
    detailed: {
      overview: "This portfolio itself is a demonstration of modern web architecture and cloud infrastructure best practices.",
      features: [
        "Server-side rendering with Astro",
        "Interactive React components with Framer Motion",
        "Global CDN distribution via CloudFront",
        "Custom domain with HTTPS",
        "Responsive design with Tailwind CSS"
      ],
      problem: "Wanted a portfolio that showcased both frontend skills and cloud infrastructure knowledge while remaining cost-effective.",
      solution: "Built with Astro for optimal performance, deployed on AWS S3/CloudFront for global CDN delivery, costing less than $1/month.",
      challenges: [
        {
          title: "Static Site Routing",
          solution: "Configured CloudFront with custom error pages to handle SPA routing.",
          description: "S3 static hosting doesn't support client-side routing by default."
        },
        {
          title: "Build Optimization",
          solution: "Leveraged Astro's partial hydration and React lazy loading to reduce bundle by 70%.",
          description: "Initial bundle sizes were too large for optimal performance."
        }
      ],
      media: [
        {
          type: "image",
          caption: "AWS architecture diagram",
          url: "/images/portfolio-architecture.png"
        }
      ],
      metrics: [
        {
          value: "98",
          label: "Lighthouse Score"
        },
        {
          value: "<$1",
          label: "Monthly Cost"
        },
        {
          value: "<1s",
          label: "Load Time"
        },
        {
          value: "99.99%",
          label: "Uptime"
        }
      ],
      learnings: [
        "Astro framework and islands architecture",
        "AWS S3, CloudFront, and ACM certificate management",
        "DNS configuration with Cloudflare",
        "Performance optimization techniques",
        "Cost optimization for cloud hosting"
      ]
    },
    techStack: [
      "Astro",
      "React",
      "AWS S3",
      "CloudFront",
      "ACM",
      "Cloudflare",
      "Tailwind"
    ],
    id: "9da9b321-2d28-4c42-a1df-853eaf1da375",
    title: "Cloud Portfolio Website",
    fullDescription: "A modern portfolio website demonstrating cloud architecture, CI/CD practices, and cost optimization on AWS infrastructure.",
    timeline: "December 2024 - Present"
  },
  {
    links: {
      demo: "",
      live: "",
      github: ""
    },
    gradientVia: "via-pink-200 dark:via-purple-900/40",
    icon: "",
    slug: "test_project",
    createdAt: 1768499248049,
    order: 3,
    logo: "",
    role: "",
    shortDescription: "This is a short description",
    gradientFrom: "from-pink-100 dark:from-pink-900/40",
    updatedAt: 1768499248049,
    gradientTo: "to-purple-100 dark:to-purple-900/40",
    detailed: {
      overview: "",
      features: [],
      problem: "",
      solution: "",
      challenges: [],
      media: [],
      metrics: [],
      learnings: []
    },
    techStack: [],
    id: "711685e0-27db-4c75-8a20-297255284170",
    title: "Test Project",
    fullDescription: "This is a full description",
    timeline: ""
  }
];
