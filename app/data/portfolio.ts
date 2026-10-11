export const personalInfo = {
  name: "Caleb Mills",
  title: "Senior Frontend Engineer",
  imageUrl: "/calebHeadshotAi.jpg",
  github: "https://github.com/Rakvadium",
  linkedin: "https://www.linkedin.com/in/calebmills1",
  email: "caleb.mills.1221@proton.me",
  phone: "(208) 949-8754",
  website: "https://www.caleb-mills.dev",
  location: "Meridian, ID",
  bio: `I'm a frontend skewed software engineer with 9+ years of experience. I obsess over intuitive UI and UX, and I also build the solid backends and APIs behind them.

I work mostly in React, TypeScript, Next.js, and Node.js. Outside of work I build and run UVSDecks.gg, a deck builder and community site for the UniVersus card game. I use AI coding agents every day, and I spend a lot of time validating what they build.`,
};

export const skills = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "SQL",
  "UI/UX",
  "C#/.NET",
  "REST APIs",
  "Vue/Nuxt",
  "AWS",
  "Azure",
  "React Native",
];

export const experience = [
  {
    role: "Senior Full-Stack Engineer",
    company: "KensieMae, LLC",
    location: "Remote",
    period: "August 2023 to October 2026",
    bullets: [
      "Kept ownership of Connector after the acquisition and continued building out its React frontend as it served about 80 clients.",
      "Built B2B integration platforms that keep data in sync between systems with scheduled jobs and webhooks.",
      "Rebuilt a legacy email and print template builder in Vue and GrapesJS, embedded inside the older AngularJS app instead of a full rewrite.",
      "Stayed on a product rebrand as teammates were reassigned to other priorities, and took on more of the work: planned it, reviewed pull requests for 3 engineers, drove testing, and got new developers up to speed on the codebase.",
      "Moved auto-campaign execution from a standalone AWS EC2 server to Azure App Service WebJobs, and kept the hybrid Azure and AWS link to the Velma Fulfillment Service (VFS) marketing engine working.",
    ],
  },
  {
    role: "Senior Software Engineer",
    company: "Velma.com",
    location: "Nampa, Idaho",
    period: "January 2022 to August 2023",
    bullets: [
      "Owned the frontend on our 4-person team and set its architecture.",
      "Shipped our first micro-frontend component with Module Federation to 4 host apps: a job tracker for email, print, and SMS jobs that releases on its own cycle without redeploying the apps that use it.",
      "Designed a per-client, per-role feature entitlement model in the Account Service that controls which apps, components, and views each user sees, and set up the data foundation for tiered, per-feature pricing.",
    ],
  },
  {
    role: "Software Engineer",
    company: "Velma.com",
    location: "Nampa, Idaho",
    period: "August 2017 to January 2022",
    bullets: [
      "Designed and built the complete React frontend for Connector, a data-bridge platform. It grew to about 80 clients, automated work that used to take 10 to 30+ hours by hand per case, became a primary revenue driver, and was a key factor in Velma\u2019s acquisition by KensieMae.",
      "Built Node.js/TypeScript and C#/.NET microservices for the VFS marketing engine, which ran high-volume automated campaigns.",
      "Set up AWS infrastructure (API Gateway, CloudFront, S3, Lambda, DynamoDB, ECS) and CodePipeline CI/CD with approval gates, so the same build moved from test to production.",
    ],
  },
  {
    role: "Auto-Campaign Specialist",
    company: "Velma.com",
    location: "Nampa, Idaho",
    period: "July 2015 to August 2017",
    bullets: [
      "Built and tested automated marketing campaigns and wrote custom JavaScript for dynamic email and print templates, then moved into an engineering role.",
    ],
  },
];

export const projects = [
  {
    title: "GenHealthAZ",
    description:
      "Rebuilt and launched GenHealth\u2019s outpatient mental health clinic site, covering psychiatry, therapy, TMS (transcranial magnetic stimulation), and Spravato care across Arizona and Idaho, with a Convex-backed CMS.",
    technologies: ["React", "NextJS", "TypeScript", "ConvexDB"],
    imageUrl: "/genhealthaz.png",
    projectUrl: "https://www.genhealthaz.com",
  },
  {
    title: "UVSDECKS.GG",
    description:
      "A deck builder and community site for the UniVersus card game, with real-time team deck editing and a card import pipeline that pulls card data out of images with GPT-4o vision and sends it to a human review queue.",
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
