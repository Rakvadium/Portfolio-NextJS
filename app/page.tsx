"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { fireConfettiFromClick } from "@/components/ui/confetti";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { ShineBorder } from "@/components/ui/shine-border";
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
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 inset-x-0 z-50 hidden md:block bg-background/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-center">
          <div className="flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}
            <a
              href={`mailto:${personalInfo.email}`}
              aria-label={`Email ${personalInfo.email}`}
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </a>
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
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
        <section id="home" className="relative flex flex-col pt-20 pb-12 md:min-h-screen md:pt-0 md:pb-0 md:justify-center scroll-mt-24">
          <div className="max-w-5xl mx-auto px-6 w-full">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="grid md:grid-cols-2 gap-10 md:gap-16 items-start md:items-center"
            >
              <div className="order-last md:order-first">
                <motion.p
                  variants={fadeUp}
                  custom={0}
                  className="text-sm uppercase tracking-[0.2em] text-primary/70 mb-4"
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
                <motion.div
                  variants={fadeUp}
                  custom={2}
                  className="space-y-4 mb-10"
                >
                  {personalInfo.bio.split("\n\n").map((paragraph, i) => (
                    <p key={i} className="text-base text-muted-foreground max-w-md leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </motion.div>
                <motion.div
                  variants={fadeUp}
                  custom={3}
                  className="flex flex-wrap gap-4"
                >
                  <a
                    href="#projects"
                    className="px-6 py-3 bg-primary text-primary-foreground text-sm rounded-full hover:bg-primary/90 transition-colors duration-200"
                  >
                    View Work
                  </a>
                  <a
                    href="#experience"
                    className="px-6 py-3 border border-primary/25 text-sm rounded-full hover:border-primary hover:text-primary transition-colors duration-200"
                  >
                    Experience
                  </a>
                  <a
                    href="#contact"
                    className="px-6 py-3 border border-primary/25 text-sm rounded-full hover:border-primary hover:text-primary transition-colors duration-200"
                  >
                    Contact
                  </a>
                </motion.div>
              </div>
              <motion.div
                variants={fadeUp}
                custom={2}
                className="flex justify-center md:justify-end order-first md:order-last"
              >
                <div className="w-40 h-40 md:w-72 md:h-72 rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
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

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            className="hidden md:flex justify-center md:absolute md:bottom-8 md:left-1/2 md:-translate-x-1/2"
            aria-hidden="true"
          >
            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                className="text-primary/40"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </motion.div>
          </motion.div>
        </section>

        <section id="skills" className="py-32 scroll-mt-24 bg-[#141414] text-[#fafafa]">
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
                className="text-3xl font-light tracking-tight mb-16 text-heading-on-dark"
              >
                Skills
              </motion.h2>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, i) => (
                  <motion.span
                    key={skill}
                    variants={fadeUp}
                    custom={i}
                    className="px-5 py-2.5 rounded-full border border-primary/25 bg-background text-sm text-foreground hover:border-primary/45 transition-colors duration-200 cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section id="experience" className="py-32 bg-background scroll-mt-24">
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
                className="text-3xl font-light tracking-tight mb-16 text-primary"
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
                    <div className="text-sm text-primary/60">{exp.period}</div>
                    <div>
                      <h3 className="text-lg font-medium mb-1 text-foreground">{exp.role}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {exp.company}, {exp.location}
                      </p>
                      <ul className="space-y-2">
                        {exp.bullets.map((b) => (
                          <li
                            key={b}
                            className="text-sm text-muted-foreground leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-primary/40 before:rounded-full"
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

        <section id="projects" className="py-32 scroll-mt-24 bg-[#141414] text-[#fafafa]">
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
                className="text-3xl font-light tracking-tight mb-16 text-heading-on-dark"
              >
                Projects
              </motion.h2>
              <div className="grid md:grid-cols-2 gap-8">
                {projects.map((project, i) => (
                  <motion.div
                    key={project.title}
                    variants={fadeUp}
                    custom={i + 1}
                    className="group relative isolate flex flex-col overflow-hidden rounded-2xl bg-background text-foreground"
                  >
                    <ShineBorder
                      borderWidth={2}
                      duration={14}
                      shineColor={["#22d3ee", "#06b6d4", "#67e8f9", "#a5f3fc", "#7dd3fc"]}
                    />
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${project.title} live site`}
                      className="relative block aspect-video w-full shrink-0 overflow-hidden bg-muted focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary"
                    >
                      <Image
                        src={project.imageUrl}
                        alt=""
                        width={600}
                        height={340}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                    </a>
                    <div className="flex flex-col p-5 md:p-6 pt-6">
                      <h3 className="text-xl font-medium mb-2 text-foreground">{project.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="text-xs px-3 py-1 bg-primary/15 text-primary/90 border border-primary/25 rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap justify-end gap-3">
                        <a
                          href={project.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                          Live Site
                        </a>
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg border border-primary/40 text-primary hover:bg-primary/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                          Source Code
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section id="contact" className="py-32 bg-background scroll-mt-24">
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
                className="text-3xl font-light tracking-tight mb-6 text-primary"
              >
                Contact
              </motion.h2>
              <motion.p
                variants={fadeUp}
                custom={1}
                className="text-base text-muted-foreground leading-relaxed mb-8 w-full max-w-none"
              >
                Have a project in mind or want to connect? Send me an email at{" "}
                <span className="text-foreground font-medium break-words">{personalInfo.email}</span>
                {" "}
                and I&apos;ll get back to you.
              </motion.p>
              <motion.div variants={fadeUp} custom={2}>
                <ShimmerButton
                  type="button"
                  background="var(--primary)"
                  shimmerColor="oklch(0.96 0.04 200)"
                  borderRadius="9999px"
                  className="border-primary/25 text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  onClick={(e) => {
                    fireConfettiFromClick(e);
                    window.location.href = `mailto:${personalInfo.email}`;
                  }}
                >
                  <span className="relative z-10 text-sm font-medium leading-none tracking-tight">
                    Contact Me
                  </span>
                </ShimmerButton>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}

function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        className="fixed top-4 right-4 z-50 md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-background/90 backdrop-blur-sm border border-primary/20 shadow-sm text-primary"
      >
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true" className="text-primary">
          <rect width="16" height="1.5" rx="1" fill="currentColor" />
          <rect y="5.25" width="11" height="1.5" rx="1" fill="currentColor" />
          <rect y="10.5" width="16" height="1.5" rx="1" fill="currentColor" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-[2px] md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 bottom-0 z-[70] w-72 bg-background md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                <span className="text-lg font-semibold tracking-tight text-primary">{personalInfo.name}</span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close navigation menu"
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f5f5f5] transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="text-primary">
                    <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 flex flex-col justify-center px-6 gap-1">
                {navItems.map((item, i) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.05 }}
                    className="py-3 text-2xl font-light text-foreground hover:text-primary transition-colors border-b border-[#f0f0f0] last:border-b-0"
                  >
                    {item.name}
                  </motion.a>
                ))}
              </div>

              <div className="px-6 pb-8 pt-4 border-t border-[#eee] flex flex-col gap-4">
                <a
                  href={`mailto:${personalInfo.email}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors break-all"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0"
                    aria-hidden="true"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  {personalInfo.email}
                </a>
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  GitHub
                </a>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
