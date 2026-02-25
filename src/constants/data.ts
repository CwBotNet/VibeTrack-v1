import type { Skill, RoadmapMilestone, Project } from '../types';

export const INITIAL_SKILLS: Skill[] = [
    {
        id: 'real-1',
        name: 'Modern Frontend (React/Next.js)',
        category: 'Frontend',
        level: 0,
        color: '#6366f1',
        subSkills: [
            { id: 'rf-1', name: 'React Server Components', isCompleted: false },
            { id: 'rf-2', name: 'Zustand State Management', isCompleted: false },
            { id: 'rf-3', name: 'Framer Motion Animations', isCompleted: false },
        ]
    },
    {
        id: 'real-2',
        name: 'Backend Architecture',
        category: 'Backend',
        level: 0,
        color: '#a855f7',
        subSkills: [
            { id: 'rb-1', name: 'PostgreSQL Schema Design', isCompleted: false },
            { id: 'rb-2', name: 'Prisma ORM Integration', isCompleted: false },
            { id: 'rb-3', name: 'JWT & RBAC Auth', isCompleted: false },
        ]
    },
    {
        id: 'real-3',
        name: 'AI & LLM Integration',
        category: 'AI',
        level: 0,
        color: '#f59e0b',
        subSkills: [
            { id: 'ra-1', name: 'OpenAI SDK / LangChain', isCompleted: false },
            { id: 'ra-2', name: 'Vector DBs (Pinecone/Supabase)', isCompleted: false },
            { id: 'ra-3', name: 'RAG Implementation', isCompleted: false },
        ]
    }
];

export const ROADMAP: RoadmapMilestone[] = [
    {
        id: 'rm1',
        title: 'Modern UI Specialist',
        description: 'Master React Server Components and advanced animations.',
        status: 'active',
        skills: ['Modern Frontend (React/Next.js)']
    },
    {
        id: 'rm2',
        title: 'Database & Security Expert',
        description: 'Build robust, secure backends with Postgres and JWT.',
        status: 'locked',
        skills: ['Backend Architecture']
    },
    {
        id: 'rm3',
        title: 'AI Native Developer',
        description: 'The final phase: build AI-powered apps with RAG.',
        status: 'locked',
        skills: ['AI & LLM Integration']
    }
];

export const INITIAL_PROJECTS: Project[] = [
    {
        id: 'proj-1',
        title: 'Nexus URL Shortener',
        subtitle: 'A high-performance URL shortener built with Rust and Redis.',
        description: 'Developed a blazingly fast URL shortener showcasing Rust\'s memory safety and concurrency model. Implemented a Redis cache layer reducing database queries by 85%. Features include bulk upload, analytics tracking, and customizable back-halves. The architecture is designed to handle millions of requests with sub-millisecond latency.',
        imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
        githubUrl: 'https://github.com/example/nexus-url',
        techStack: ['Rust', 'Redis', 'PostgreSQL', 'Docker'],
        status: 'completed',
        tasks: [
            { id: 't1', description: 'Design Redis caching architecture', isCompleted: true },
            { id: 't2', description: 'Implement bulk URL upload endpoint', isCompleted: true },
            { id: 't3', description: 'Set up Docker containerization', isCompleted: true }
        ]
    },
    {
        id: 'proj-2',
        title: 'DTC Fitness Platform',
        subtitle: 'Modern headless e-commerce for fitness equipment.',
        description: 'Built a conversion-optimized e-commerce storefront for a high-end fitness brand. Leveraged Next.js App Router for server-side rendering and SEO benefits. Integrated Stripe for seamless checkout and Supabase for real-time inventory management. The platform features a dark, industrial aesthetic tailored exactly to the brand identity.',
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
        githubUrl: 'https://github.com/example/dtc-fitness',
        techStack: ['Next.js', 'Tailwind', 'Stripe', 'Supabase'],
        status: 'in-progress',
        tasks: [
            { id: 't4', description: 'Scaffold Next.js App Router project', isCompleted: true },
            { id: 't5', description: 'Integrate Stripe checkout session', isCompleted: true },
            { id: 't6', description: 'Build admin dashboard for inventory management', isCompleted: false },
            { id: 't7', description: 'Optimize Core Web Vitals (LCP < 2.5s)', isCompleted: false }
        ]
    }
];
