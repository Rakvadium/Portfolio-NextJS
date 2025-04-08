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
      <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white md:pt-20">
        {/* Profile Section */}
        <section id="home" className="min-h-[100vh] md:min-h-0 md:py-32 flex items-center">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12"
            >
              <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mb-8 md:mb-0 md:order-none order-first"
                >
                  <div className="relative w-48 h-48 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-blue-600 dark:border-blue-400">
                    <Image
                      src="/profile.jpg"
                      alt="Caleb Mills"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-4xl md:text-5xl font-bold mb-4 text-center md:text-left"
                >
                  Hi, I&apos;m <span className="text-blue-600 dark:text-blue-400">Caleb Mills</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-xl text-gray-600 dark:text-gray-300 mb-6 text-center md:text-left"
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
                    className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
                  >
                    View My Work
                  </a>
                  <a
                    href="#contact"
                    className="w-full md:w-auto px-6 py-3 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-center"
                  >
                    Contact Me
                  </a>
                </motion.div>
              </div>
              <div className="hidden md:block md:w-1/2">
                {/* Placeholder for desktop layout balance */}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-16 md:py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-center mb-8 md:mb-12">Skills</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["React (Next)", "TypeScript", "ES6+", "Vue (Nuxt)", "UI/UX", "C#", ".NET", "SQL", "REST APIs", "AWS"].map((skill) => (
                  <div
                    key={skill}
                    className="p-4 bg-white dark:bg-gray-700 rounded-lg text-center hover:shadow-lg transition-shadow"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-center mb-12">Experience</h2>
              <div className="space-y-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-bold">Software Developer</h3>
                  <p className="text-gray-600 dark:text-gray-300">KensieMae, LLC, Remote</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">August 2023 - Present</p>
                  <ul className="mt-4 list-disc list-inside space-y-2">
                    <li>Develop and maintain web applications using React, Vue (Nuxt), ES6+, C#</li>
                    <li>Collaborate with cross-functional teams to deliver software products</li>
                    <li>Implement UI/UX designs to enhance user experience</li>
                  </ul>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-bold">Software Developer</h3>
                  <p className="text-gray-600 dark:text-gray-300">Velma.com, Nampa, Idaho</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">July 2015 - August 2023</p>
                  <ul className="mt-4 list-disc list-inside space-y-2">
                    <li>Developed marketing software using C#, React, Angular 1.X, Node, JavaScript</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-center mb-12">Projects</h2>
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
