export const personalInfo = {
  name: "Caleb Mills",
  title: "Fullstack Developer",
  imageUrl: "/calebHeadshot.jpg",
  github: "https://github.com/Rakvadium",
  email: "caleb.mills.1221@proton.me",
  phone: "(208) 949-8754",
  website: "https://caleb-mills.dev",
  bio: `Fullstack Developer with 10+ years of experience crafting innovative, user-focused web and mobile applications from the ground up. I specialize in React 18+, Next.js, TypeScript, and Node.js, building real-time collaborative platforms and seamless fintech integrations that eliminate tedious manual tasks, accelerate team productivity, and let mortgage professionals stay focused on high-value work.

As a passionate lifelong learner and creative problem-solver, I thrive on anticipating future needs, experimenting with new approaches, and exploring modern tools (including AI-assisted workflows) to deliver clean, high-performance solutions quickly. I stay current with cutting-edge technologies by regularly rebuilding personal projects with new frameworks and concepts.`,
};

export const skills = [
  "React (Next.js)",
  "TypeScript",
  "UI/UX",
  "AI Native",
  "C#/.NET",
  "SQL",
  "REST APIs",
  "AWS",
  "Vue/Nuxt",
  "Angular",
  "Node.js",
  "React Native",
];

export const experience = [
  {
    role: "Software Developer",
    company: "KensieMae, LLC",
    location: "Remote",
    period: "August 2023 \u2013 Present",
    bullets: [
      "Independently designed, architected, and built the complete React frontend (plus significant backend contributions) for the groundbreaking \u201cConnector\u201d data-bridge automation platform \u2014 a flexible, generic mapping system connecting any data sources to any targets. Served ~80 clients, automated complex compliance and workflow processes that previously required 10\u201330+ hours of manual effort per loan, earned consistent praise for intuitive UI/UX, became the primary revenue driver, and was a key factor in Velma\u2019s acquisition by KensieMae.",
      "Architected internal npm/npx scaffolding tool and migration framework that standardized web-plugin development; enabled migration of 75+ legacy desktop Encompass plugins to modern web architecture in ~6 months (versus estimated 12 months), saving the 12-person development team roughly $700K in effort and allowing focus on higher-priority features.",
      "Engineered multiple B2B data-mapping and automation platforms (including Total Expert Fusion and GNB FIS CodeConnect Horizon) that synchronized loan data between Loan Origination Systems (Empower/Encompass) and CRM/core banking platforms, eliminating hours of manual re-keying per loan and preventing stale data through scheduled + webhook-driven syncs.",
      "Designed, developed, and maintained high-performance full-stack web applications using React 18+, TypeScript, Vue/Nuxt, and C#/.NET that streamlined mortgage professionals\u2019 workflows and dramatically reduced manual data entry and compliance work.",
    ],
  },
  {
    role: "Software Developer",
    company: "Velma.com",
    location: "Nampa, Idaho",
    period: "July 2015 \u2013 August 2023",
    bullets: [
      "Designed, built, and maintained scalable microservices using Node.js, TypeScript, and C#/.NET that powered the VFS marketing engine, enabling high-volume automated marketing campaigns and improving platform reliability.",
      "Configured and optimized AWS infrastructure (API Gateway, CloudFront, S3, Lambda, DynamoDB, CodePipeline, ECS, etc.) and implemented robust CI/CD pipelines with manual approval gates, ensuring identical code deploys from test to production and accelerating reliable releases across the platform.",
      "Created micro-frontend components (using module federation) for the VFS Jobs interface as a proof-of-concept, allowing seamless transplantation into other applications (Velma CRM, Connector) and laying groundwork for client-facing embeddable components.",
      "Developed and evolved a full-stack CRM and automation platform using C#, React, Angular, Node.js, and JavaScript, delivering ongoing enhancements that strengthened client relationships and improved daily mortgage operations.",
      "Delivered polished, intuitive user interfaces and smooth UX flows across all products that consistently earned positive client feedback and praise for design quality and usability.",
      "Contributed to long-term platform modernization and feature development that supported significant business growth, culminating in the successful acquisition by KensieMae, LLC in 2023.",
    ],
  },
];

export const projects = [
  {
    title: "UVSDECKS.GG",
    description:
      "A Universus card game deck-building website, built to handle interactive experiences with community members.",
    technologies: ["React", "NextJS", "TypeScript", "ConvexDB"],
    imageUrl: "/project1.png",
    projectUrl: "https://www.uvsdecks.gg",
    githubUrl: "https://github.com/Rakvadium/uvs-decks-gg",
  },
];

export const navItems = [
  { name: "Home", href: "#home" },
  { name: "Skills", href: "#skills" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];
