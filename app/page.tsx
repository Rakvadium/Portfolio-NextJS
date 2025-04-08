"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Navigation from "./components/Navigation";
import ProjectCard from "./components/ProjectCard";
import BottomNavigation from "./components/BottomNavigation";

const projects = [
  {
    title: "Project 1",
    description: "Description of your first project. Explain what you built and the impact it had.",
    technologies: ["React", "TypeScript", "Node.js"],
    imageUrl: "/project1.jpg",
    projectUrl: "https://project1.com",
    githubUrl: "https://github.com/yourusername/project1",
  },
  {
    title: "Project 2",
    description: "Description of your second project. Explain what you built and the impact it had.",
    technologies: ["Vue", "Nuxt", "C#", ".NET"],
    imageUrl: "/project2.jpg",
    projectUrl: "https://project2.com",
    githubUrl: "https://github.com/yourusername/project2",
  },
  // Add more projects as needed
];

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen text-gray-900 dark:text-white md:pt-20 relative">
        {/* Profile Section */}
        <section id="home" className="min-h-[100vh] md:min-h-0 md:py-32 flex items-center relative overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12"
            >
              {/* Content Column */}
              <div className="w-full md:w-1/2 flex flex-col items-center md:items-start order-last md:order-first">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-4xl md:text-6xl font-bold mb-4 text-center md:text-left neon-glow-hover"
                >
                  Hi, I&apos;m <span className="text-[#00f3ff]">Caleb Mills</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-xl text-gray-300 mb-6 text-center md:text-left"
                >
                  Full Stack Developer specializing in React, Vue, and C#
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex flex-wrap gap-4 justify-center md:justify-start w-full"
                >
                  <a
                    href="#projects"
                    className="w-full md:w-auto px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-center neon-border"
                  >
                    View My Work
                  </a>
                  <a
                    href="#contact"
                    className="w-full md:w-auto px-8 py-3 bg-transparent border border-primary text-primary rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-center neon-border"
                  >
                    Contact Me
                  </a>
                </motion.div>
              </div>

              {/* Image Column */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="w-full md:w-1/2 flex justify-center md:justify-end order-first md:order-last"
              >
                <div className="relative w-48 h-48 md:w-80 md:h-80 rounded-full overflow-hidden neon-box-hover">
                  <Image
                    src="/cyberCaleb.jpg"
                    alt="Caleb Mills"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Skills Section - Darker Background */}
        <section id="skills" className="py-16 md:py-20 bg-gray-100 dark:bg-gray-900 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-center mb-12 neon-glow-hover">Skills</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {["React (Next)", "TypeScript", "ES6+", "Vue (Nuxt)", "UI/UX", "C#", ".NET", "SQL", "REST APIs", "AWS"].map((skill) => (
                  <motion.div
                    key={skill}
                    whileHover={{ scale: 1.05 }}
                    className="p-4 bg-white dark:bg-gray-700 rounded-lg text-center neon-border"
                  >
                    {skill}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-20 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-center mb-12 neon-glow-hover">Experience</h2>
              <div className="space-y-8">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg shadow-lg neon-border"
                >
                  <h3 className="text-xl font-bold text-[#00f3ff]">Software Developer</h3>
                  <p className="text-gray-600 dark:text-gray-300">KensieMae, LLC, Remote</p>
                  <p className="text-sm text-[#ff00ff]">August 2023 - Present</p>
                  <ul className="mt-4 list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    <li>Develop and maintain web applications using React, Vue (Nuxt), ES6+, C#</li>
                    <li>Collaborate with cross-functional teams to deliver software products</li>
                    <li>Implement UI/UX designs to enhance user experience</li>
                  </ul>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg shadow-lg neon-border"
                >
                  <h3 className="text-xl font-bold text-[#00f3ff]">Software Developer</h3>
                  <p className="text-gray-600 dark:text-gray-300">Velma.com, Nampa, Idaho</p>
                  <p className="text-sm text-[#ff00ff]">July 2015 - August 2023</p>
                  <ul className="mt-4 list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    <li>Developed marketing software using C#, React, Angular 1.X, Node, JavaScript</li>
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Projects Section - Darker Background */}
        <section id="projects" className="py-20 bg-gray-100 dark:bg-gray-900 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-center mb-12 neon-glow-hover">Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <ProjectCard key={project.title} {...project} />
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <BottomNavigation />
    </>
  );
}
