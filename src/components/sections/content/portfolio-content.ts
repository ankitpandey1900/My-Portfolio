import type { SectionId } from '@/components/section-loader/section-loader-types';

export interface SectionMeta {
  id: SectionId;
  eyebrow: string;
  title: string;
  subtitle: string;
}

export interface TimelineEntry {
  period: string;
  role: string;
  company: string;
  description: string;
  highlights: string[];
}

export interface ProjectEntry {
  id: string;
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  href?: string;
  github?: string;
  status?: 'live' | 'building' | 'archived';
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface ServiceOffering {
  title: string;
  description: string;
  deliverables: string[];
}

export interface ResumeProfile {
  name: string;
  headline: string;
  location: string;
  summary: string;
  availability: string;
  metrics: Array<{
    label: string;
    value: string;
  }>;
  focusAreas: string[];
}

export const SECTION_META: Record<SectionId, SectionMeta> = {
  home: {
    id: 'home',
    eyebrow: 'Origin',
    title: 'Mission origin',
    subtitle: 'Entry point to the system. Your coordinates in the portfolio universe.',
  },
  about: {
    id: 'about',
    eyebrow: 'About',
    title: 'Personal Background',
    subtitle: 'Who I am, what I build, and my approach to software engineering.',
  },
  projects: {
    id: 'projects',
    eyebrow: 'Projects',
    title: 'Featured Work',
    subtitle: 'Production systems and applications I have shipped.',
  },
  services: {
    id: 'services',
    eyebrow: 'Services',
    title: 'Capabilities',
    subtitle: 'What I build for teams, founders, and products.',
  },
  skills: {
    id: 'skills',
    eyebrow: 'Skills',
    title: 'Systems toolkit',
    subtitle: 'Languages, frameworks, and tools in active rotation.',
  },
  experience: {
    id: 'experience',
    eyebrow: 'Experience',
    title: 'Work History',
    subtitle: 'My professional journey and technical roles.',
  },
  education: {
    id: 'education',
    eyebrow: 'Education',
    title: 'Academic Background',
    subtitle: 'Formal education and continuous learning.',
  },
  hackathons: {
    id: 'hackathons',
    eyebrow: 'Hackathons',
    title: 'Rapid Prototypes',
    subtitle: 'Projects built under pressure and shipped under constraints.',
  },
  github: {
    id: 'github',
    eyebrow: 'Open Source',
    title: 'GitHub Activity',
    subtitle: 'Repositories, contributions, and open collaboration.',
  },
  blogs: {
    id: 'blogs',
    eyebrow: 'Writing',
    title: 'Blog & Articles',
    subtitle: 'Notes on building, learning, and shipping in public.',
  },
  contact: {
    id: 'contact',
    eyebrow: 'Contact',
    title: 'Open channel',
    subtitle: 'Reach out for collaborations, opportunities, or interesting builds.',
  },
  resume: {
    id: 'resume',
    eyebrow: 'Resume',
    title: 'Full dossier',
    subtitle: 'Download or view the complete professional summary.',
  },
  freelance: {
    id: 'freelance',
    eyebrow: 'Freelance',
    title: 'Client Projects',
    subtitle: 'Professional engagements and independent builds.',
  },
};

export const ABOUT_CONTENT = {
  story: [
    'I am a software engineering student based in India, racing toward elite-level development. I do not collect technologies — I ship products people use every day.',
    'My work spans full-stack SaaS, gamified productivity systems, finance tools, and immersive web experiences. I care about architecture that survives real users, not demos that impress for a week.',
  ],
  values: [
    { label: 'Systems', detail: 'Every feature connects to a coherent product architecture.' },
    { label: 'Shipping', detail: '500+ hours on AllTracker alone — I finish what I start.' },
    { label: 'Craft', detail: 'Cinematic UI, real performance, production-ready code.' },
  ],
  focus: 'Full stack · System design · AI integration · TypeScript · Supabase · Next.js',
};

export const RESUME_PROFILE: ResumeProfile = {
  name: 'Ankit Pandey',
  headline:
    'Full-stack developer building product systems, immersive web interfaces, and AI-assisted workflows.',
  location: 'Pune, India',
  summary:
    'Software engineering student and product-focused developer with shipped projects across productivity, finance, network tooling, and cinematic 3D web experiences. Strongest in TypeScript, Next.js, React, Supabase, and practical product architecture.',
  availability:
    'Open to internships, full-stack roles, freelance builds, and high-signal collaborations.',
  metrics: [
    { label: 'Product Hours', value: '800+' },
    { label: 'Live Projects', value: '6' },
    { label: 'Primary Stack', value: 'TS/Next' },
    { label: 'Timeline', value: '2024-2028' },
  ],
  focusAreas: [
    'Full-stack product engineering',
    'Cinematic UI and interaction design',
    'Realtime dashboards and analytics',
    'AI-assisted workflows',
    'Database-backed SaaS architecture',
  ],
};

export const PROJECTS: ProjectEntry[] = [
  {
    id: 'MSN-001',
    name: 'AllTracker',
    tagline: 'Productivity & study control system',
    description:
      'Full-stack productivity platform with gamified tracking, real-time global leaderboard, AI strategist (Maamu), and achievement vault. 90+ days and 500+ hours of focused development.',
    stack: ['TypeScript', 'Supabase', 'Vite', 'Real-time'],
    href: 'https://www.alltracker.online/',
    github: 'https://github.com/ankitpandey1900/AllTracker',
    status: 'live',
  },
  {
    id: 'MSN-002',
    name: 'Tallymate',
    tagline: 'Personal finance command center',
    description:
      'Track expenses, income, debts, budgets, and split bills with friends — all money management in one place.',
    stack: ['Next.js', 'TypeScript', 'Prisma', 'Better Auth', 'shadcn/ui'],
    href: 'https://tallymate.alltracker.online/',
    github: 'https://github.com/ankitpandey1900/tallymate',
    status: 'live',
  },
  {
    id: 'MSN-003',
    name: 'IPWala',
    tagline: 'DNS & network toolkit',
    description:
      'Modern DNS and network analysis toolkit with a terminal-first interface — built for developers who live in the command line.',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'shadcn/ui'],
    href: 'https://ipwala.vercel.app/',
    github: 'https://github.com/ankitpandey1900/ipwala',
    status: 'live',
  },
];

export const SERVICES: ServiceOffering[] = [
  {
    title: 'Full-Stack Product Builds',
    description:
      'End-to-end web apps from architecture to deployment — SaaS, dashboards, and tools.',
    deliverables: ['System design', 'Frontend + backend', 'Database & auth', 'Production deploy'],
  },
  {
    title: 'Immersive Web Experiences',
    description: 'WebGL, 3D, and cinematic interfaces that differentiate your brand.',
    deliverables: ['Three.js / R3F', 'Performance tuning', 'Responsive fallbacks', 'UX polish'],
  },
  {
    title: 'AI-Integrated Workflows',
    description: 'Practical AI features embedded into real products — not chatbot demos.',
    deliverables: ['LLM integration', 'Automation pipelines', 'Product UX', 'Observability'],
  },
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    label: 'Core',
    items: ['JavaScript', 'TypeScript', 'Python', 'HTML', 'CSS', 'Tailwind CSS'],
  },
  {
    label: 'Frontend',
    items: ['React', 'Next.js', 'Vite', 'shadcn/ui', 'Framer Motion'],
  },
  {
    label: 'Backend & Data',
    items: ['Supabase', 'PostgreSQL', 'MongoDB', 'Prisma', 'Better Auth'],
  },
  {
    label: '3D & Graphics',
    items: ['Three.js', 'React Three Fiber', 'GLSL', 'WebGL'],
  },
  {
    label: 'DevOps & Tools',
    items: ['Git', 'Vercel', 'Netlify', 'Cursor', 'Claude'],
  },
];

export const EXPERIENCE: TimelineEntry[] = [
  {
    period: 'May 2026 — Present',
    role: 'Web Developer',
    company: 'Freelance',
    description:
      'Building client websites with responsive UI, deployment, and ongoing maintenance.',
    highlights: ['Client delivery', 'Responsive design', 'Production deployment'],
  },
  {
    period: 'Oct 2024 — Dec 2024',
    role: 'Student Ambassador',
    company: 'BLACKBOX.AI',
    description: 'Representing AI developer tools on campus and in the community.',
    highlights: ['Community outreach', 'Developer advocacy', 'Product demos'],
  },
];

export const EDUCATION = [
  {
    degree: 'B.E. Information Technology',
    institution: 'I Square IT — International Institute of Information Technology, Pune',
    period: 'Sep 2024 — Jun 2028',
    detail:
      'Pursuing software engineering with focus on systems, web development, and product craft.',
  },
  {
    degree: 'HSC Vocational Electronics',
    institution: 'Thakur College of Science & Commerce',
    period: 'Aug 2021 — May 2023',
    detail: 'Higher secondary with electronics specialization.',
  },
  {
    degree: 'SSC',
    institution: 'Vedant International High School',
    period: 'Jun 2019 — Jun 2021',
    detail: 'Secondary school foundation.',
  },
];

export const HACKATHONS = [
  {
    name: 'GirlScript Summer of Code',
    result: 'Contributor',
    project: 'Open-source contributions',
  },
  { name: 'Personal build sprints', result: 'Shipped', project: 'AllTracker — 500+ hour mission' },
];

export const GITHUB_STATS = {
  username: 'ankitpandey1900',
  contributions: 'Active',
  pinnedRepos: ['AllTracker', 'tallymate', 'ipwala'],
  url: 'https://github.com/ankitpandey1900',
};

export const CONTACT_INFO = {
  email: 'ankit1pandey11@gmail.com',
  calUrl: '',
  linkedin: 'https://www.linkedin.com/in/ankitpandey1900/',
  twitter: 'https://x.com/ankitpandey190',
  availability: 'Open to full-stack roles, collaborations, and interesting builds',
};

export const TESTIMONIALS = [
  {
    quote: 'Currently in debugging mode... but shipping anyway.',
    author: 'GitHub profile',
  },
];

