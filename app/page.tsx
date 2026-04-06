"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { personalInfo, skills, experience, projects, navItems } from "./data/portfolio";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a]">
      <nav className="fixed top-0 inset-x-0 z-50 hidden md:block bg-[#fafafa]/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <a href="#home" className="text-lg font-semibold tracking-tight">
            {personalInfo.initials}
          </a>
          <div className="flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm text-[#666] hover:text-[#1a1a1a] transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="text-[#666] hover:text-[#1a1a1a] transition-colors duration-200"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </nav>

      <MobileNav />

      <main>
        <section id="home" className="min-h-screen flex items-center">
          <div className="max-w-5xl mx-auto px-6 w-full">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="grid md:grid-cols-2 gap-16 items-center"
            >
              <div className="order-last md:order-first">
                <motion.p
                  variants={fadeUp}
                  custom={0}
                  className="text-sm uppercase tracking-[0.2em] text-[#999] mb-4"
                >
                  {personalInfo.title}
                </motion.p>
                <motion.h1
                  variants={fadeUp}
                  custom={1}
                  className="text-5xl md:text-7xl font-light tracking-tight leading-[1.1] mb-6"
                  style={{ textWrap: "balance" }}
                >
                  {personalInfo.name}
                </motion.h1>
                <motion.p
                  variants={fadeUp}
                  custom={2}
                  className="text-lg text-[#666] max-w-md leading-relaxed mb-10"
                >
                  {personalInfo.tagline}
                </motion.p>
                <motion.div variants={fadeUp} custom={3} className="flex gap-4">
                  <a
                    href="#projects"
                    className="px-6 py-3 bg-[#1a1a1a] text-white text-sm rounded-full hover:bg-[#333] transition-colors duration-200"
                  >
                    View Work
                  </a>
                  <a
                    href="#about"
                    className="px-6 py-3 border border-[#ddd] text-sm rounded-full hover:border-[#999] transition-colors duration-200"
                  >
                    About Me
                  </a>
                </motion.div>
              </div>
              <motion.div
                variants={fadeUp}
                custom={2}
                className="flex justify-center md:justify-end order-first md:order-last"
              >
                <div className="w-56 h-56 md:w-72 md:h-72 rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                  <Image
                    src={personalInfo.imageUrl}
                    alt={personalInfo.name}
                    width={288}
                    height={288}
                    className="object-cover w-full h-full"
                    priority
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section id="about" className="py-32 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
            >
              <motion.h2
                variants={fadeUp}
                custom={0}
                className="text-3xl font-light tracking-tight mb-12"
              >
                About
              </motion.h2>
              <div className="max-w-2xl space-y-6">
                {personalInfo.bio.split("\n\n").map((paragraph, i) => (
                  <motion.p
                    key={i}
                    variants={fadeUp}
                    custom={i + 1}
                    className="text-base text-[#555] leading-relaxed"
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section id="skills" className="py-32">
          <div className="max-w-5xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
            >
              <motion.h2
                variants={fadeUp}
                custom={0}
                className="text-3xl font-light tracking-tight mb-16"
              >
                Skills
              </motion.h2>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, i) => (
                  <motion.span
                    key={skill}
                    variants={fadeUp}
                    custom={i}
                    className="px-5 py-2.5 border border-[#e5e5e5] rounded-full text-sm text-[#555] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors duration-200 cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section id="experience" className="py-32 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
            >
              <motion.h2
                variants={fadeUp}
                custom={0}
                className="text-3xl font-light tracking-tight mb-16"
              >
                Experience
              </motion.h2>
              <div className="space-y-12">
                {experience.map((exp, i) => (
                  <motion.div
                    key={exp.company}
                    variants={fadeUp}
                    custom={i + 1}
                    className="grid md:grid-cols-[200px_1fr] gap-6"
                  >
                    <div className="text-sm text-[#999]">{exp.period}</div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">{exp.role}</h3>
                      <p className="text-sm text-[#666] mb-4">
                        {exp.company}, {exp.location}
                      </p>
                      <ul className="space-y-2">
                        {exp.bullets.map((b) => (
                          <li
                            key={b}
                            className="text-sm text-[#555] leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-[#ddd] before:rounded-full"
                          >
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section id="projects" className="py-32">
          <div className="max-w-5xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
            >
              <motion.h2
                variants={fadeUp}
                custom={0}
                className="text-3xl font-light tracking-tight mb-16"
              >
                Projects
              </motion.h2>
              <div className="grid md:grid-cols-2 gap-8">
                {projects.map((project, i) => (
                  <motion.div
                    key={project.title}
                    variants={fadeUp}
                    custom={i + 1}
                    className="group"
                  >
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${project.title} live site`}
                      className="aspect-video rounded-2xl overflow-hidden mb-6 bg-[#eee] block relative focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1a1a]"
                    >
                      <Image
                        src={project.imageUrl}
                        alt=""
                        width={600}
                        height={340}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                    </a>
                    <h3 className="text-xl font-medium mb-2">{project.title}</h3>
                    <p className="text-sm text-[#666] mb-4 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-3 py-1 bg-[#f0f0f0] text-[#666] rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm underline underline-offset-4 text-[#1a1a1a] hover:text-[#666] transition-colors"
                      >
                        Live Site
                      </a>
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm underline underline-offset-4 text-[#1a1a1a] hover:text-[#666] transition-colors"
                      >
                        Source Code
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}

function MobileNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-white/90 backdrop-blur-md border-t border-[#eee]">
      <div className="flex justify-around items-center py-3">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="text-xs text-[#666] hover:text-[#1a1a1a] transition-colors"
          >
            {item.name}
          </a>
        ))}
        <a
          href={personalInfo.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub profile"
          className="text-[#666] hover:text-[#1a1a1a] transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </a>
      </div>
    </nav>
  );
}
