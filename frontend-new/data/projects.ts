export interface Project {
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
}

export const projects: Project[] = [
  {
    slug: 'ella-rises',
    title: 'Ella Rises Program Management System',
    shortDescription: 'Full-stack web application for nonprofit management featuring event scheduling, participant tracking, donation management, and role-based dashboards with secure authentication.',
    fullDescription: 'A comprehensive nonprofit management platform built for Ella Rises, empowering administrators to manage events, track participants, process donations, and generate insights through data visualization.',
    role: 'Full-Stack Developer',
    timeline: 'Fall 2024 (3 months)',
    techStack: ['Node.js', 'Express', 'MySQL', 'AWS EB', 'EJS', 'bcrypt', 'Chart.js'],
    gradientFrom: 'from-pink-100',
    gradientVia: 'via-purple-100',
    gradientTo: 'to-pink-50',
    logo: '/images/ellarises-logo.png',
    links: {
      live: 'https://ellarises-1-14-intex.is404.net/',
      github: 'https://github.com/Tannerka5/INTEX--EllaRises',
    },
    detailed: {
      overview: 'Ella Rises needed a centralized system to manage their growing nonprofit operations. This platform streamlines event coordination, participant tracking, and donation management while providing real-time analytics.',
      problem: 'The organization was managing data across multiple spreadsheets and manual processes, leading to inefficiencies, data inconsistencies, and difficulty tracking program impact.',
      solution: 'Built a unified web application with role-based access control, automated workflows, and interactive dashboards that reduced administrative overhead by 60%.',
      challenges: [
        {
          title: 'Complex Role-Based Access Control',
          description: 'Multiple user types (admin, volunteer, participant) required different permissions and views.',
          solution: 'Implemented middleware-based authentication with bcrypt password hashing and session management, creating custom route guards for each role.',
        },
        {
          title: 'Data Visualization Performance',
          description: 'Large datasets from events and donations caused slow dashboard load times.',
          solution: 'Optimized SQL queries with proper indexing and implemented server-side aggregation, reducing load times from 8s to under 2s.',
        },
        {
          title: 'AWS Deployment Configuration',
          description: 'First time deploying a full-stack application to AWS Elastic Beanstalk with RDS.',
          solution: 'Learned AWS networking, security groups, and environment variables. Documented the entire deployment process for future reference.',
        },
      ],
      learnings: [
        'Deep understanding of authentication and authorization patterns',
        'Database design for multi-tenant applications',
        'AWS cloud infrastructure and deployment pipelines',
        'Importance of user testing with actual nonprofit staff',
        'Balancing feature requests with maintainable code',
      ],
      features: [
        'Secure user authentication with role-based permissions',
        'Event creation and participant registration',
        'Donation tracking with receipt generation',
        'Interactive dashboards with Chart.js',
        'Automated email notifications',
        'Data export for reporting',
      ],
      media: [
        {
          type: 'video',
          url: '/videos/ellarises-demo.mp4',
          caption: 'Full platform walkthrough showcasing key features',
          thumbnail: '/images/ellarises-thumb.jpg',
        },
        {
          type: 'image',
          url: '/images/ellarises-dashboard.png',
          caption: 'Admin dashboard with real-time analytics',
        },
        {
          type: 'image',
          url: '/images/ellarises-event.png',
          caption: 'Event management interface',
        },
      ],
      metrics: [
        { label: 'Admin Time Saved', value: '60%' },
        { label: 'Active Users', value: '150+' },
        { label: 'Events Managed', value: '45+' },
        { label: 'Uptime', value: '99.8%' },
      ],
    },
  },
  {
    slug: 'neighboraid',
    title: 'NeighborAid Emergency Preparedness',
    shortDescription: 'Community platform connecting neighbors to share emergency resources and strengthen disaster preparedness.',
    fullDescription: 'A neighborhood coordination platform that helps communities prepare for emergencies by mapping available resources, connecting neighbors, and facilitating resource sharing.',
    role: 'Full-Stack Developer & Project Lead',
    timeline: 'Winter 2024 (4 months)',
    techStack: ['Node.js', 'Express', 'MySQL', 'AWS', 'HTTPS', 'Leaflet.js'],
    gradientFrom: 'from-blue-50',
    gradientVia: 'via-blue-100',
    gradientTo: 'to-sky-100',
    logo: '/images/neighboraid-logo.png',
    links: {
      live: 'https://neighboraid.is404.net/',
      github: 'https://github.com/Tannerka5/NeighborAid',
    },
    detailed: {
      overview: 'NeighborAid empowers communities to be self-sufficient during emergencies by creating a network of shared resources and mutual aid.',
      problem: 'During natural disasters, neighbors often don\'t know what resources are available nearby or how to coordinate effectively.',
      solution: 'Built a secure platform with geographic mapping, resource inventory, and neighbor profiles to facilitate emergency preparedness and response.',
      challenges: [
        {
          title: 'HTTPS Configuration',
          description: 'Needed secure connections for sensitive neighbor data but unfamiliar with SSL/TLS setup.',
          solution: 'Learned about Let\'s Encrypt, configured nginx as reverse proxy, and automated certificate renewal.',
        },
        {
          title: 'Geographic Data Modeling',
          description: 'Efficiently querying nearby resources based on location was complex.',
          solution: 'Implemented spatial indexing in MySQL and used Leaflet.js for interactive mapping.',
        },
      ],
      learnings: [
        'Web security best practices (HTTPS, data encryption)',
        'Geographic information systems (GIS) basics',
        'Community-focused product design',
        'Accessibility considerations for diverse users',
      ],
      features: [
        'Interactive neighborhood resource mapping',
        'Member profiles with skill/resource listings',
        'Secure messaging between neighbors',
        'Emergency alert system',
        'Resource sharing coordination',
      ],
      media: [
        {
          type: 'image',
          url: '/images/neighboraid-map.png',
          caption: 'Interactive resource map view',
        },
        {
          type: 'image',
          url: '/images/neighboraid-profile.png',
          caption: 'User profile and resource management',
        },
      ],
      metrics: [
        { label: 'Neighborhoods', value: '12' },
        { label: 'Resources Shared', value: '200+' },
        { label: 'Active Members', value: '85' },
      ],
    },
  },
  {
    slug: 'cloud-portfolio',
    title: 'Cloud Portfolio Website',
    shortDescription: 'Scalable, cloud-hosted portfolio built on AWS with S3, CloudFront, and Cloudflare DNS.',
    fullDescription: 'A modern portfolio website demonstrating cloud architecture, CI/CD practices, and cost optimization on AWS infrastructure.',
    role: 'Developer & DevOps',
    timeline: 'December 2024 - Present',
    techStack: ['Astro', 'React', 'AWS S3', 'CloudFront', 'ACM', 'Cloudflare', 'Tailwind'],
    gradientFrom: 'from-primary',
    gradientVia: 'via-secondary',
    gradientTo: 'to-primary-light',
    icon: 'cloud',
    links: {
      live: 'https://tannerka5.com',
    },
    detailed: {
      overview: 'This portfolio itself is a demonstration of modern web architecture and cloud infrastructure best practices.',
      problem: 'Wanted a portfolio that showcased both frontend skills and cloud infrastructure knowledge while remaining cost-effective.',
      solution: 'Built with Astro for optimal performance, deployed on AWS S3/CloudFront for global CDN delivery, costing less than $1/month.',
      challenges: [
        {
          title: 'Static Site Routing',
          description: 'S3 static hosting doesn\'t support client-side routing by default.',
          solution: 'Configured CloudFront with custom error pages to handle SPA routing.',
        },
        {
          title: 'Build Optimization',
          description: 'Initial bundle sizes were too large for optimal performance.',
          solution: 'Leveraged Astro\'s partial hydration and React lazy loading to reduce bundle by 70%.',
        },
      ],
      learnings: [
        'Astro framework and islands architecture',
        'AWS S3, CloudFront, and ACM certificate management',
        'DNS configuration with Cloudflare',
        'Performance optimization techniques',
        'Cost optimization for cloud hosting',
      ],
      features: [
        'Server-side rendering with Astro',
        'Interactive React components with Framer Motion',
        'Global CDN distribution via CloudFront',
        'Custom domain with HTTPS',
        'Responsive design with Tailwind CSS',
      ],
      media: [
        {
          type: 'image',
          url: '/images/portfolio-architecture.png',
          caption: 'AWS architecture diagram',
        },
      ],
      metrics: [
        { label: 'Lighthouse Score', value: '98' },
        { label: 'Monthly Cost', value: '<$1' },
        { label: 'Load Time', value: '<1s' },
        { label: 'Uptime', value: '99.99%' },
      ],
    },
  },
];
