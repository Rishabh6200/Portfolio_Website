export interface Project {
  slug: string
  title: string
  tagline: string
  description: string
  category: "Full-Stack" | "Backend APIs" | "Web Apps"
  featured: boolean
  timeline: string
  role: string
  impact: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  accentColor: string
  architectureOverview: string
  challenge: string
  solution: string
  highlights: string[]
  metrics: {
    label: string
    value: string
  }[]
}

export interface Experience {
  company: string
  role: string
  period: string
  location: string
  type: string
  description: string
  achievements: string[]
  technologies: string[]
}

export interface SkillCategory {
  title: string
  skills: {
    name: string
    level: "Advanced" | "Expert" | "Proficient"
    highlight?: boolean
  }[]
}

export interface PortfolioData {
  personal: {
    name: string
    role: string
    tagline: string
    bio: string
    status: string
    location: string
    timezone: string
    email: string
    socials: {
      github: string
      linkedin: string
      twitter: string
      cal?: string
    }
    stats: {
      label: string
      value: string
      subtext: string
    }[]
  }
  skills: SkillCategory[]
  projects: Project[]
  experience: Experience[]
  principles: {
    title: string
    description: string
  }[]
}

export const portfolioData: PortfolioData = {
  personal: {
    name: "Alex Rivera",
    role: "Full-Stack Engineer (NestJS • React • Laravel)",
    tagline: "I build robust, high-throughput backend APIs in NestJS & Laravel, paired with polished React web applications.",
    bio: "I’m a full-stack engineer specializing in scalable backend architectures and dynamic web applications. Over the last 6+ years, I’ve architected modular microservice APIs with NestJS, production web platforms with Laravel, and interactive frontend dashboards using React and Next.js.",
    status: "Open for Work",
    location: "Mohali, India (IST)",
    timezone: "Asia/Kolkata",
    email: "[EMAIL_ADDRESS]",
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://x.com",
      cal: "https://cal.com",
    },
    stats: [
      { label: "Years Experience", value: "6+", subtext: "Full-stack & distributed APIs" },
      { label: "Production Apps", value: "20+", subtext: "Deployed across enterprise SaaS" },
      { label: "API Reliability", value: "99.99%", subtext: "Uptime across microservices" },
      { label: "GitHub Stars", value: "2.8k", subtext: "Across developer libraries" },
    ],
  },
  skills: [
    {
      title: "Backend APIs & Services",
      skills: [
        { name: "NestJS", level: "Expert", highlight: true },
        { name: "Node.js / Express", level: "Expert", highlight: true },
        { name: "Laravel 11 (PHP 8.3)", level: "Advanced", highlight: true },
        { name: "PostgreSQL & Prisma", level: "Expert", highlight: true },
        { name: "Redis & BullMQ", level: "Advanced", highlight: true },
        { name: "REST APIs & WebSockets", level: "Expert", highlight: true },
      ],
    },
    {
      title: "Frontend & Web Apps",
      skills: [
        { name: "React 19 / Next.js", level: "Expert", highlight: true },
        { name: "TypeScript", level: "Expert", highlight: true },
        { name: "Tailwind CSS v4", level: "Expert", highlight: true },
        { name: "State Management (Zustand)", level: "Advanced" },
        { name: "Motion (Framer)", level: "Advanced", highlight: true },
      ],
    },
    {
      title: "Architecture & Cloud",
      skills: [
        { name: "Docker & Microservices", level: "Advanced", highlight: true },
        { name: "Stripe & Payment Gateways", level: "Expert", highlight: true },
        { name: "JWT Auth & RBAC", level: "Expert", highlight: true },
        { name: "Swagger / OpenAPI", level: "Expert" },
        { name: "MySQL & Eloquent ORM", level: "Advanced" },
        { name: "CI/CD & GitHub Actions", level: "Advanced" },
      ],
    },
  ],
  projects: [
    {
      slug: "cloudpulse-api-gateway",
      title: "CloudPulse API Gateway",
      tagline: "Enterprise modular microservices gateway with JWT RBAC, dynamic rate limiting, and BullMQ queues",
      description: "A high-throughput NestJS backend API gateway handling authentication, request routing, rate limiting, and asynchronous job processing across distributed microservices.",
      category: "Backend APIs",
      featured: true,
      timeline: "5 Months",
      role: "Lead Backend Architect",
      impact: "Sustains 15,000+ RPS with sub-12ms gateway latency across 24 microservice routes.",
      technologies: ["NestJS", "TypeScript", "PostgreSQL", "Prisma", "Redis", "BullMQ", "Docker", "Swagger"],
      liveUrl: "https://cloudpulse-api-demo.vercel.app",
      githubUrl: "https://github.com/example/cloudpulse-api-gateway",
      accentColor: "#6366F1",
      architectureOverview: "Engineered a modular NestJS architecture using Guards, Interceptors, and Custom Decorators with Redis token-bucket rate limiting, BullMQ distributed job processing, and PostgreSQL via Prisma ORM.",
      challenge: "High-frequency API requests during morning peak hours saturated downstream database pools and led to uncoordinated JWT verification overhead across services.",
      solution: "Implemented distributed Redis token caching with atomic Lua scripts for rate limiting, centralized asynchronous JWT verification via NestJS interceptors, and a real-time WebSocket connection to a React management dashboard.",
      highlights: [
        "Modular NestJS architecture strictly enforcing separation of concerns across Auth, Ingestion, Proxy, and Audit modules.",
        "High-performance Redis token bucket rate-limiting with atomic Lua scripts preventing service exhaustion.",
        "Automated Swagger/OpenAPI documentation and DTO validation with class-validator.",
        "Asynchronous task execution pipeline powered by BullMQ and Redis workers.",
      ],
      metrics: [
        { label: "Throughput", value: "15,000+ RPS" },
        { label: "Gateway Latency", value: "<12ms" },
        { label: "Uptime", value: "99.99%" },
        { label: "Endpoints", value: "24 Routes" },
      ],
    },
    {
      slug: "hyperflow-studio",
      title: "Hyperflow Studio",
      tagline: "Collaborative visual node editor & workflow automation suite for modern engineering teams",
      description: "A realtime web application enabling engineering teams to visually stitch together backend APIs, webhooks, and cron triggers on an interactive infinite canvas with live test runners.",
      category: "Web Apps",
      featured: true,
      timeline: "6 Months",
      role: "Lead Frontend & Full-Stack Engineer",
      impact: "Adopted by 4,200+ active developers with smooth 60 FPS performance on complex graphs.",
      technologies: ["React 19", "Next.js", "TypeScript", "Tailwind CSS v4", "WebSockets", "Zustand", "Motion"],
      liveUrl: "https://hyperflow-studio.vercel.app",
      githubUrl: "https://github.com/example/hyperflow-studio",
      accentColor: "#06B6D4",
      architectureOverview: "Built on an optimistic client-side canvas layer synchronized through WebSockets to a Node.js/NestJS orchestration engine with isolated execution runtimes.",
      challenge: "Rendering hundreds of interactive interconnected nodes and animated data packets in React caused severe frame drops during viewport panning and zooming.",
      solution: "Built a hybrid Canvas + React DOM rendering pipeline with viewport culling, decoupled graph state using Zustand, and synchronized edits via real-time WebSocket streams.",
      highlights: [
        "Silky-smooth 60 FPS viewport zooming on graphs with 1,000+ interactive nodes.",
        "Real-time multi-cursor collaboration and presence with sub-25ms WebSocket latency.",
        "Visual debugging timeline with step-through execution breakpoints and packet replay.",
        "Custom themeable design system built with Tailwind CSS v4 and Framer Motion.",
      ],
      metrics: [
        { label: "FPS on Canvas", value: "60 FPS" },
        { label: "Active Builders", value: "4,200+" },
        { label: "Execution Runs", value: "18M+" },
        { label: "Sync Latency", value: "<18ms" },
      ],
    },
    {
      slug: "nexus-commerce-engine",
      title: "Nexus Commerce Engine",
      tagline: "Headless e-commerce platform & high-concurrency order processing API",
      description: "A headless e-commerce backend built with Laravel 11 REST API, integrated with Stripe Webhooks, Redis caching, and a responsive React shopping storefront.",
      category: "Full-Stack",
      featured: true,
      timeline: "6 Months",
      role: "Full-Stack Tech Lead",
      impact: "Processed over $4.2M in transactions with zero race conditions and sub-200ms checkout times.",
      technologies: ["Laravel 11", "ReactJS", "PHP 8.3", "MySQL", "Redis", "Stripe API", "Inertia.js", "Tailwind CSS"],
      liveUrl: "https://nexus-commerce.vercel.app",
      githubUrl: "https://github.com/example/nexus-commerce-engine",
      accentColor: "#EC4899",
      architectureOverview: "Built a decoupled Laravel RESTful API utilizing Service Repository patterns, Eloquent API Resources, Redis cache tags, and database transaction locks for race-condition-free inventory management.",
      challenge: "Flash sale traffic spikes caused inventory overselling and database lock contention when hundreds of shoppers simultaneously checked out the last units of stock.",
      solution: "Implemented database pessimistic locking (lockForUpdate) inside atomic database transactions, combined with Laravel Redis job queues for deferred order notification dispatch and webhook reconciliation.",
      highlights: [
        "Atomic inventory reservation preventing race conditions and overselling during flash traffic spikes.",
        "Resilient Stripe webhook processor with cryptographic signature verification and idempotent replay safety.",
        "Optimistic React storefront cart state delivering instant UI response times.",
        "Automated invoice generation and PDF dispatch queued via Laravel Horizon workers.",
      ],
      metrics: [
        { label: "Processed Volume", value: "$4.2M+" },
        { label: "Checkout Time", value: "<200ms" },
        { label: "Oversell Errors", value: "0" },
        { label: "Webhook Success", value: "99.98%" },
      ],
    },
    {
      slug: "saasflow-billing-api",
      title: "SaaSFlow Billing API",
      tagline: "Multi-tenant subscription management and usage-based metering engine",
      description: "An automated multi-tenant billing engine built on Laravel API with custom usage metering, tiered recurring invoicing, webhooks, and an administrative React portal.",
      category: "Backend APIs",
      featured: false,
      timeline: "4 Months",
      role: "Backend Systems Engineer",
      impact: "Automated recurring billing cycles for 600+ B2B tenants with zero reconciliation discrepancies.",
      technologies: ["Laravel", "NestJS", "ReactJS", "PostgreSQL", "Redis", "Stripe Cashier", "Docker"],
      githubUrl: "https://github.com/example/saasflow-billing-api",
      accentColor: "#F59E0B",
      architectureOverview: "Architected a multi-tenant Laravel core with separate database schema isolation per tenant, asynchronous usage event ingestion via Redis queues, and Stripe Cashier integration.",
      challenge: "High-volume API usage events from customer applications overwhelmed the billing database when writing individual transaction records in real time.",
      solution: "Implemented a batched Redis accumulator that flushes usage aggregates periodically to PostgreSQL via scheduled cron workers, reducing database writes by 92%.",
      highlights: [
        "Multi-tenant middleware isolating tenant contexts and API keys transparently.",
        "High-throughput Redis event ingestion buffer handling 50k+ events/hour.",
        "Automated prorated billing and tiered subscription lifecycle management.",
        "Interactive React dashboard for tenant API key generation and usage consumption graphs.",
      ],
      metrics: [
        { label: "Tenants Managed", value: "600+" },
        { label: "DB Write Reduction", value: "92%" },
        { label: "Events Ingested", value: "50k+/hr" },
        { label: "Invoicing Accuracy", value: "100%" },
      ],
    },
  ],
  experience: [
    {
      company: "Vanguard Systems",
      role: "Staff Backend & Full-Stack Engineer",
      period: "2023 — Present",
      location: "Remote",
      type: "Full-Time",
      description: "Leading backend API design and frontend architecture for enterprise developer tools and subscription systems.",
      achievements: [
        "Architected modular NestJS microservices handling 15,000+ requests/sec with Redis caching and BullMQ queues.",
        "Spearheaded React 19 web application re-architecture, improving Lighthouse performance score to 99.",
        "Designed Laravel billing and webhook processing infrastructure with Stripe Cashier.",
      ],
      technologies: ["NestJS", "React", "Laravel", "TypeScript", "PostgreSQL", "Redis", "Docker"],
    },
    {
      company: "Synthetix Cloud",
      role: "Senior Full-Stack Engineer",
      period: "2021 — 2023",
      location: "Remote",
      type: "Full-Time",
      description: "Built high-concurrency Laravel REST APIs, real-time React dashboards, and high-frequency webhook ingestors.",
      achievements: [
        "Delivered headless e-commerce backend in Laravel 11 with sub-200ms checkout and zero-oversell concurrency locks.",
        "Created real-time node canvas editor in React with WebSockets and optimistic state synchronization.",
        "Implemented automated OpenAPI documentation and CI/CD testing pipelines.",
      ],
      technologies: ["Laravel", "React", "TypeScript", "Node.js", "MySQL", "Redis", "Docker"],
    },
    {
      company: "Nebula Interactive",
      role: "Full-Stack Developer",
      period: "2019 — 2021",
      location: "Austin, TX",
      type: "Full-Time",
      description: "Developed customer-facing React portals and Node.js / PHP backend APIs for high-growth SaaS clients.",
      achievements: [
        "Built modular component libraries and RESTful API endpoints for multi-tenant customer applications.",
        "Optimized client-side bundle size by 35% through dynamic code splitting and modern assets caching.",
      ],
      technologies: ["React", "JavaScript", "PHP", "Node.js", "MySQL", "Tailwind CSS"],
    },
  ],
  principles: [
    {
      title: "Clean Architecture & Modularity",
      description: "Whether structuring NestJS modules or Laravel service layers, clean separation of concerns and type-safe contracts ensure systems scale gracefully.",
    },
    {
      title: "Resilient APIs by Default",
      description: "Atomic database transactions, Redis rate-limiting, and idempotent webhook handlers build bulletproof backend services that survive real-world traffic spikes.",
    },
    {
      title: "Polished, Intuitive Interfaces",
      description: "Instant optimistic state updates, smooth micro-animations, and accessible keyboard navigation elevate web applications from functional to delightful.",
    },
  ],
}
