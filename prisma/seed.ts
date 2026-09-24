import { connectDatabase, db, ProjectStatus } from "./db.ts";

export interface CategoryInput {
   name: string;
   slug: string;
   description: string;
   icon: string;
   order: number;
   color: string;
   createdAt: string;
   updatedAt: string;
}

export interface SkillInput {
   categorySlug: string;
   name: string;
   level: "Proficient" | "Advanced" | "Expert";
   highlight: boolean;
   order: number;
   createdAt: string;
   updatedAt: string;
}

export interface ProjectInput {
   title: string;
   slug: string;
   tagline: string;
   description: string;
   role: string;
   skills: string[];
   logo: string;
   images: string[];
   liveUrl: string;
   githubUrl: string;
   featured: boolean;
   status: ProjectStatus;
   order: number;
   createdAt: string;
   updatedAt: string;
}

export const categories: CategoryInput[] = [
   {
      name: "Backend",
      slug: "backend",
      description: "Distributed architectures, microservices, high-throughput RESTful APIs, and background workers.",
      icon: "Server",
      order: 1,
      color: "#6366f1",
      createdAt: "2026-09-09T12:09:13.761Z",
      updatedAt: "2026-09-10T06:57:22.578Z"
   },
   {
      name: "Frontend",
      slug: "frontend",
      description: "Modern web applications, reactive dashboards, state management, and high-performance UI.",
      icon: "Layout",
      order: 2,
      color: "#06b6d4",
      createdAt: "2026-09-09T12:09:51.324Z",
      updatedAt: "2026-09-10T06:57:22.578Z"
   },
   {
      name: "Database & Cache",
      slug: "database-cache",
      description: "Relational, document, and in-memory key-value data stores with optimized indexing and locking.",
      icon: "Database",
      order: 3,
      color: "#10b981",
      createdAt: "2026-09-10T06:12:15.919Z",
      updatedAt: "2026-09-10T06:57:22.578Z"
   },
   {
      name: "DevOps & Cloud",
      slug: "devops-cloud",
      description: "Containerization, cloud infrastructure, CI/CD deployment pipelines, and server provisioning.",
      icon: "Cloud",
      order: 4,
      color: "#f59e0b",
      createdAt: "2026-09-10T06:12:16.018Z",
      updatedAt: "2026-09-10T06:57:22.578Z"
   },
   {
      name: "Core & Languages",
      slug: "core-languages",
      description: "Core programming languages, paradigms, design patterns, and engineering fundamentals.",
      icon: "Code2",
      order: 0,
      color: "#8b5cf6",
      createdAt: "2026-09-10T06:12:16.103Z",
      updatedAt: "2026-09-10T06:57:22.578Z"
   }
];

export const skills: SkillInput[] = [
   // Backend
   {
      categorySlug: "backend",
      name: "NestJS",
      highlight: true,
      level: "Expert",
      order: 0,
      createdAt: "2026-09-10T06:12:15.766Z",
      updatedAt: "2026-09-10T09:01:15.003Z"
   },
   {
      categorySlug: "backend",
      name: "Node.js",
      highlight: true,
      level: "Expert",
      order: 1,
      createdAt: "2026-09-10T06:12:15.766Z",
      updatedAt: "2026-09-10T09:01:15.003Z"
   },
   {
      categorySlug: "backend",
      name: "Laravel",
      highlight: false,
      level: "Advanced",
      order: 5,
      createdAt: "2026-09-10T06:12:15.766Z",
      updatedAt: "2026-09-10T09:01:15.003Z"
   },
   {
      categorySlug: "backend",
      name: "RESTful APIs & OpenAPI",
      highlight: true,
      level: "Expert",
      order: 2,
      createdAt: "2026-09-10T06:12:15.766Z",
      updatedAt: "2026-09-10T09:01:15.003Z"
   },
   {
      categorySlug: "backend",
      name: "BullMQ & Queues",
      highlight: false,
      level: "Advanced",
      order: 4,
      createdAt: "2026-09-10T06:12:15.766Z",
      updatedAt: "2026-09-10T09:01:15.003Z"
   },
   {
      categorySlug: "backend",
      name: "GraphQL",
      highlight: false,
      level: "Proficient",
      order: 6,
      createdAt: "2026-09-10T06:12:15.766Z",
      updatedAt: "2026-09-10T09:01:15.003Z"
   },
   {
      categorySlug: "backend",
      name: "Express.js",
      highlight: true,
      level: "Advanced",
      order: 3,
      createdAt: "2026-09-10T06:12:15.766Z",
      updatedAt: "2026-09-10T09:01:19.814Z"
   },

   // Frontend
   {
      categorySlug: "frontend",
      name: "Next.js",
      highlight: true,
      level: "Expert",
      order: 1,
      createdAt: "2026-09-10T06:12:15.873Z",
      updatedAt: "2026-09-10T10:29:26.351Z"
   },
   {
      categorySlug: "frontend",
      name: "Tailwind CSS",
      highlight: true,
      level: "Expert",
      order: 2,
      createdAt: "2026-09-10T06:12:15.873Z",
      updatedAt: "2026-09-10T10:29:26.351Z"
   },
   {
      categorySlug: "frontend",
      name: "Framer Motion",
      highlight: true,
      level: "Advanced",
      order: 8,
      createdAt: "2026-09-10T06:12:15.873Z",
      updatedAt: "2026-09-10T10:29:26.351Z"
   },
   {
      categorySlug: "frontend",
      name: "State Management (Zustand)",
      highlight: false,
      level: "Advanced",
      order: 7,
      createdAt: "2026-09-10T06:12:15.873Z",
      updatedAt: "2026-09-10T10:29:26.351Z"
   },
   {
      categorySlug: "frontend",
      name: "React.js",
      highlight: true,
      level: "Expert",
      order: 0,
      createdAt: "2026-09-10T07:24:05.920Z",
      updatedAt: "2026-09-10T10:29:26.351Z"
   },
   {
      categorySlug: "frontend",
      name: "Redux Toolkit",
      highlight: false,
      level: "Advanced",
      order: 6,
      createdAt: "2026-09-10T07:25:04.909Z",
      updatedAt: "2026-09-10T10:29:26.351Z"
   },
   {
      categorySlug: "frontend",
      name: "Vue.js",
      highlight: false,
      level: "Advanced",
      order: 5,
      createdAt: "2026-09-10T09:50:21.894Z",
      updatedAt: "2026-09-10T10:29:26.351Z"
   },
   {
      categorySlug: "frontend",
      name: "Bootstrap",
      highlight: false,
      level: "Advanced",
      order: 3,
      createdAt: "2026-09-10T10:09:05.059Z",
      updatedAt: "2026-09-10T10:29:26.351Z"
   },
   {
      categorySlug: "frontend",
      name: "MUI (Material UI)",
      highlight: false,
      level: "Advanced",
      order: 4,
      createdAt: "2026-09-10T10:16:06.101Z",
      updatedAt: "2026-09-10T10:29:26.351Z"
   },
   {
      categorySlug: "frontend",
      name: "Redux",
      highlight: false,
      level: "Advanced",
      order: 6,
      createdAt: "2026-09-11T16:46:57.352Z",
      updatedAt: "2026-09-11T16:47:55.072Z"
   },

   // Database & Cache
   {
      categorySlug: "database-cache",
      name: "PostgreSQL",
      highlight: true,
      level: "Advanced",
      order: 1,
      createdAt: "2026-09-10T06:12:15.973Z",
      updatedAt: "2026-09-10T09:52:50.720Z"
   },
   {
      categorySlug: "database-cache",
      name: "Redis",
      highlight: true,
      level: "Advanced",
      order: 3,
      createdAt: "2026-09-10T06:12:15.973Z",
      updatedAt: "2026-09-14T06:08:43.767Z"
   },
   {
      categorySlug: "database-cache",
      name: "MongoDB & Mongoose",
      highlight: true,
      level: "Advanced",
      order: 2,
      createdAt: "2026-09-10T06:12:15.973Z",
      updatedAt: "2026-09-10T09:00:39.111Z"
   },
   {
      categorySlug: "database-cache",
      name: "MySQL",
      highlight: true,
      level: "Advanced",
      order: 0,
      createdAt: "2026-09-10T06:12:15.973Z",
      updatedAt: "2026-09-10T09:00:46.740Z"
   },
   {
      categorySlug: "database-cache",
      name: "Prisma ORM",
      highlight: false,
      level: "Advanced",
      order: 5,
      createdAt: "2026-09-10T06:12:15.973Z",
      updatedAt: "2026-09-10T09:00:39.111Z"
   },
   {
      categorySlug: "database-cache",
      name: "Database Indexing & Locks",
      highlight: false,
      level: "Advanced",
      order: 4,
      createdAt: "2026-09-10T06:12:15.973Z",
      updatedAt: "2026-09-10T09:00:39.111Z"
   },

   // DevOps & Cloud
   {
      categorySlug: "devops-cloud",
      name: "Docker & Containers",
      highlight: true,
      level: "Advanced",
      order: 0,
      createdAt: "2026-09-10T06:12:16.059Z",
      updatedAt: "2026-09-14T06:08:25.958Z"
   },
   {
      categorySlug: "devops-cloud",
      name: "AWS (EC2, S3, ECS)",
      highlight: false,
      level: "Advanced",
      order: 2,
      createdAt: "2026-09-10T06:12:16.059Z",
      updatedAt: "2026-09-14T06:08:25.958Z"
   },
   {
      categorySlug: "devops-cloud",
      name: "CI/CD & GitHub Actions",
      highlight: false,
      level: "Advanced",
      order: 3,
      createdAt: "2026-09-10T06:12:16.059Z",
      updatedAt: "2026-09-14T06:08:25.958Z"
   },
   {
      categorySlug: "devops-cloud",
      name: "Linux & Nginx",
      highlight: false,
      level: "Advanced",
      order: 4,
      createdAt: "2026-09-10T06:12:16.059Z",
      updatedAt: "2026-09-14T06:08:25.958Z"
   },
   {
      categorySlug: "devops-cloud",
      name: "Vercel & Cloudflare",
      highlight: true,
      level: "Advanced",
      order: 1,
      createdAt: "2026-09-10T06:12:16.059Z",
      updatedAt: "2026-09-14T06:09:35.414Z"
   },

   // Core & Languages
   {
      categorySlug: "core-languages",
      name: "TypeScript",
      highlight: true,
      level: "Expert",
      order: 1,
      createdAt: "2026-09-10T06:12:16.143Z",
      updatedAt: "2026-09-14T06:10:19.935Z"
   },
   {
      categorySlug: "core-languages",
      name: "JavaScript (ESNext)",
      highlight: true,
      level: "Expert",
      order: 0,
      createdAt: "2026-09-10T06:12:16.143Z",
      updatedAt: "2026-09-10T10:02:06.753Z"
   },
   {
      categorySlug: "core-languages",
      name: "PHP 8+",
      highlight: false,
      level: "Advanced",
      order: 4,
      createdAt: "2026-09-10T06:12:16.143Z",
      updatedAt: "2026-09-10T10:02:06.753Z"
   },
   {
      categorySlug: "core-languages",
      name: "SQL",
      highlight: true,
      level: "Advanced",
      order: 2,
      createdAt: "2026-09-10T06:12:16.143Z",
      updatedAt: "2026-09-10T10:02:10.264Z"
   },
   {
      categorySlug: "core-languages",
      name: "Git & Version Control",
      highlight: false,
      level: "Advanced",
      order: 5,
      createdAt: "2026-09-10T06:12:16.143Z",
      updatedAt: "2026-09-10T10:02:06.753Z"
   },
   {
      categorySlug: "core-languages",
      name: "Clean Architecture & OOP",
      highlight: true,
      level: "Advanced",
      order: 3,
      createdAt: "2026-09-10T06:12:16.143Z",
      updatedAt: "2026-09-10T10:02:06.753Z"
   }
];

export const projects: ProjectInput[] = [
   {
      title: "EmpireCityRide",
      slug: "empirecityride",
      tagline: "The art of arriving together.",
      description: "Empire City Ride is a premium New York City chauffeur service providing luxury black cars, private airport transfers, and executive sprinter vans. They specialize in reliable point-to-point transfers, hourly bookings, and large group travel for corporate events and special occasions.",
      role: "Full-Stack Developer",
      skills: [
         "NestJS",
         "RESTful APIs & OpenAPI",
         "Redux Toolkit",
         "Next.js",
         "Tailwind CSS",
         "MySQL",
         "TypeScript",
         "Git & Version Control"
      ],
      logo: "https://ik.imagekit.io/sandboxmedia/portfolio-site/projects/empirecityride/99b23a64-c6ef-4768-9eee-b0739b998906.webp",
      images: [
         "https://ik.imagekit.io/sandboxmedia/portfolio-site/projects/empirecityride/b726810d-c06d-41f5-af68-f858517eb05b.jpg",
         "https://ik.imagekit.io/sandboxmedia/portfolio-site/projects/empirecityride/9cee1a53-c785-4966-a2ca-a6f1ef2a0d4f.jpg",
         "https://ik.imagekit.io/sandboxmedia/portfolio-site/projects/empirecityride/2ea6c165-3fbf-4191-b0ee-69d786716607.jpg"
      ],
      liveUrl: "https://www.empirecityride.com",
      githubUrl: "",
      featured: false,
      status: "PUBLISHED",
      order: 0,
      createdAt: "2026-09-10T07:35:04.259Z",
      updatedAt: "2026-09-11T16:45:58.702Z"
   },
   {
      title: "FFL Butler",
      slug: "ffl-butler",
      tagline: "Firearms. Gear. Trusted Service.",
      description: "FFL Butler is a trusted firearms retailer offering firearms, ammunition, optics, parts, and accessories with a focus on dependable service and a straightforward shopping experience.",
      role: "Full-Stack Developer",
      skills: [
         "Laravel",
         "MySQL",
         "Redis",
         "JavaScript (ESNext)",
         "PHP 8+",
         "Git & Version Control"
      ],
      logo: "https://ik.imagekit.io/sandboxmedia/portfolio-site/projects/ffl-butler/9e694f7f-1407-447f-99fa-7e8a42d9b777.png",
      images: [
         "https://ik.imagekit.io/sandboxmedia/portfolio-site/projects/ffl-butler/2cc803a3-368e-4c39-b459-dfa7feb290e2.jpg",
         "https://ik.imagekit.io/sandboxmedia/portfolio-site/projects/ffl-butler/0d09c73c-29fb-45c2-99a4-065d6f6ecf58.jpg",
         "https://ik.imagekit.io/sandboxmedia/portfolio-site/projects/ffl-butler/2d76b6db-b033-4116-b71c-522e3f26aafe.jpg"
      ],
      liveUrl: "https://www.fflbutler.com",
      githubUrl: "",
      featured: false,
      status: "PUBLISHED",
      order: 1,
      createdAt: "2026-09-10T09:40:08.636Z",
      updatedAt: "2026-09-11T16:45:58.702Z"
   },
   {
      title: "CaGunTrader",
      slug: "caguntrader",
      tagline: "California’s Firearms Classifieds",
      description: "CA Gun Trader is an online classifieds platform connecting California buyers and sellers of firearms and related gear. Users can browse listings, post items for sale, and communicate with other members through the platform.",
      role: "Full-Stack Developer",
      skills: [
         "Laravel",
         "MySQL",
         "Redis",
         "Linux & Nginx",
         "PHP 8+",
         "Git & Version Control",
         "Bootstrap"
      ],
      logo: "https://ik.imagekit.io/sandboxmedia/portfolio-site/projects/caguntrader/d45f1804-c2cc-4bcc-b2ea-a6a5e26c0cb9.png",
      images: [
         "https://ik.imagekit.io/sandboxmedia/portfolio-site/projects/caguntrader/317d08ec-eb74-4cab-9da4-c399d2114cc2.jpg",
         "https://ik.imagekit.io/sandboxmedia/portfolio-site/projects/caguntrader/35c347a8-4bbe-4b0d-9290-d92206e2c318.jpg",
         "https://ik.imagekit.io/sandboxmedia/portfolio-site/projects/caguntrader/0f68fd52-5271-4613-9198-01318fe2610d.jpg",
         "https://ik.imagekit.io/sandboxmedia/portfolio-site/projects/caguntrader/3113d560-25b5-4c8c-a98c-3acc85b3ff3b.jpg",
         "https://ik.imagekit.io/sandboxmedia/portfolio-site/projects/caguntrader/56e2c78b-5f8d-44dc-90c7-d1f2e7e4f529.jpg"
      ],
      liveUrl: "https://www.caguntrader.com",
      githubUrl: "",
      featured: false,
      status: "PUBLISHED",
      order: 2,
      createdAt: "2026-09-10T10:08:46.984Z",
      updatedAt: "2026-09-11T16:45:58.703Z"
   },
   {
      title: "HappyLocate",
      slug: "happylocate",
      tagline: "Relocate Anywhere. Anytime at Ease!",
      description: "HappyLocate is a technology-enabled relocation platform offering hassle-free moving solutions for homes, offices, pets, and businesses across India and abroad. It connects customers with verified relocation partners and provides end-to-end support, transparent pricing, and journey tracking.",
      role: "Frontend Developer",
      skills: [
         "TypeScript",
         "Next.js",
         "Tailwind CSS",
         "MUI (Material UI)"
      ],
      logo: "https://www.happylocate.com/favicon.ico",
      images: [
         "https://ik.imagekit.io/sandboxmedia/portfolio-site/projects/happylocate/29108455-11f6-407e-85af-fac3bee649d7.jpg"
      ],
      liveUrl: "https://www.happylocate.com",
      githubUrl: "",
      featured: false,
      status: "PUBLISHED",
      order: 4,
      createdAt: "2026-09-10T10:20:45.414Z",
      updatedAt: "2026-09-11T16:45:58.703Z"
   },
   {
      title: "KissannDeal",
      slug: "kissanndeal",
      tagline: "Fresh Deals. Easy Shopping.",
      description: "KissannDeal is a convenient online grocery platform offering fresh produce, everyday essentials, dairy, snacks, and household products at great prices, with easy browsing, exclusive deals, and convenient home delivery.",
      role: "Backend Developer",
      skills: [
         "Laravel",
         "MySQL",
         "Vue.js"
      ],
      logo: "https://ik.imagekit.io/sandboxmedia/portfolio-site/projects/kissanndeal/8ce051de-f75c-43d8-84f7-d0e45ccd361b.webp",
      images: [
         "https://ik.imagekit.io/sandboxmedia/portfolio-site/projects/kissanndeal/208f3bac-4919-47e8-99c9-52238ca18458.jpg"
      ],
      liveUrl: "https://kissanndeal.com",
      githubUrl: "",
      featured: false,
      status: "PUBLISHED",
      order: 5,
      createdAt: "2026-09-10T10:33:35.873Z",
      updatedAt: "2026-09-11T16:45:58.703Z"
   },
   {
      title: "DriveItAway",
      slug: "driveitaway",
      tagline: "DriveItAway: Rent-to-Own Car Dealer",
      description: "DriveItAway is a flexible vehicle subscription and rent-to-own platform that helps users find, lease, and eventually purchase vehicles. The platform offers a seamless digital experience for browsing cars, managing payments, earning purchase credits, and transitioning from driving to ownership.",
      role: "Frontend Developer",
      skills: [
         "JavaScript (ESNext)",
         "React.js",
         "Bootstrap",
         "Redux"
      ],
      logo: "https://ik.imagekit.io/sandboxmedia/portfolio-site/projects/driveitaway/27ca48b8-7b52-4a88-adb0-5a973256a074.webp",
      images: [
         "https://ik.imagekit.io/sandboxmedia/portfolio-site/projects/driveitaway/8ada9687-12f7-45aa-b854-3a1099e1c10a.jpg",
         "https://ik.imagekit.io/sandboxmedia/portfolio-site/projects/driveitaway/20367e5e-caf6-4aac-8037-7873c0e00b71.jpg"
      ],
      liveUrl: "",
      githubUrl: "",
      featured: false,
      status: "PUBLISHED",
      order: 3,
      createdAt: "2026-09-11T16:45:44.522Z",
      updatedAt: "2026-09-11T16:49:34.610Z"
   }
];

export async function seed() {
   await connectDatabase();
   console.log("🌱 Starting Prisma database seeding with cuid(2)...\n");

   const categoryMap = new Map<string, string>();
   const skillMap = new Map<string, string>();

   // 1. Categories (IDs generated by Prisma cuid2)
   console.log("📁 Seeding Categories...");
   for (const cat of categories) {
      const existing = await db.orm.public.Category.first({ slug: cat.slug });
      let categoryId: string;

      if (!existing) {
         const created = await db.orm.public.Category.create(cat);
         categoryId = created.id;
         console.log(`  + Created category: ${cat.name} (${categoryId})`);
      } else {
         await db.orm.public.Category.where({ slug: cat.slug }).update({
            name: cat.name,
            description: cat.description,
            icon: cat.icon,
            order: cat.order,
            color: cat.color,
            updatedAt: cat.updatedAt
         });
         categoryId = existing.id;
         console.log(`  ~ Updated category: ${cat.name} (${categoryId})`);
      }
      categoryMap.set(cat.slug, categoryId);
   }

   // 2. Skills (IDs generated by Prisma cuid2, linked via Category ID)
   console.log("\n⚡ Seeding Skills...");
   for (const s of skills) {
      const categoryId = categoryMap.get(s.categorySlug);
      if (!categoryId) {
         throw new Error(`Category slug '${s.categorySlug}' not found for skill '${s.name}'`);
      }

      const existing = await db.orm.public.Skill
         .where((sk) => sk.categoryId.eq(categoryId))
         .where((sk) => sk.name.eq(s.name))
         .first();

      let skillId: string;

      if (!existing) {
         const created = await db.orm.public.Skill.create({
            categoryId,
            name: s.name,
            level: s.level,
            highlight: s.highlight,
            order: s.order,
            createdAt: s.createdAt,
            updatedAt: s.updatedAt
         });
         skillId = created.id;
         console.log(`  + Created skill: ${s.name} (${skillId})`);
      } else {
         await db.orm.public.Skill.where({ id: existing.id }).update({
            level: s.level,
            highlight: s.highlight,
            order: s.order,
            updatedAt: s.updatedAt
         });
         skillId = existing.id;
         console.log(`  ~ Updated skill: ${s.name} (${skillId})`);
      }
      skillMap.set(s.name, skillId);
   }

   // 3. Projects (IDs generated by Prisma cuid2)
   console.log("\n🚀 Seeding Projects...");
   for (const p of projects) {
      const { skills: skillNames, ...projectData } = p;
      const existing = await db.orm.public.Project.first({ slug: p.slug });
      let projectId: string;

      if (!existing) {
         const created = await db.orm.public.Project.create(projectData);
         projectId = created.id;
         console.log(`  + Created project: ${p.title} (${projectId})`);
      } else {
         await db.orm.public.Project.where({ slug: p.slug }).update({
            title: p.title,
            tagline: p.tagline,
            description: p.description,
            role: p.role,
            logo: p.logo,
            images: p.images,
            liveUrl: p.liveUrl,
            githubUrl: p.githubUrl,
            featured: p.featured,
            status: p.status,
            order: p.order,
            updatedAt: p.updatedAt
         });
         projectId = existing.id;
         console.log(`  ~ Updated project: ${p.title} (${projectId})`);
      }

      // 4. Project-Skill Relations (M:N join table)
      for (const skillName of skillNames) {
         const skillId = skillMap.get(skillName);
         if (!skillId) {
            console.warn(`  ! Skill '${skillName}' not found for project '${p.title}'`);
            continue;
         }

         const existingRelation = await db.orm.public.ProjectSkill
            .where((ps) => ps.projectId.eq(projectId))
            .where((ps) => ps.skillId.eq(skillId))
            .first();

         if (!existingRelation) {
            await db.orm.public.ProjectSkill.create({
               projectId,
               skillId
            });
         }
      }
   }

   console.log("\n✨ Database seeding completed successfully!");
}

// Automatically invoke if executed directly via node/tsx
const isDirectRun = process.argv[1] && process.argv[1].endsWith("seed.ts");
if (isDirectRun) {
   seed()
      .catch((error) => {
         console.error("❌ Seeding failed:", error);
         process.exit(1);
      })
      .finally(async () => {
         await db.close();
      });
}