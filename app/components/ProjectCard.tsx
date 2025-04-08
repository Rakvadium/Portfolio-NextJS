"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  projectUrl?: string;
  githubUrl?: string;
}

export default function ProjectCard({
  title,
  description,
  technologies,
  imageUrl,
  projectUrl,
  githubUrl,
}: ProjectCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-lg"
    >
      {imageUrl && (
        <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {technologies.map((tech) => (
          <span
            key={tech}
            className="px-2 py-1 text-sm bg-gray-200 dark:bg-gray-600 rounded-full"
          >
            {tech}
          </span>
        ))}
      </div>
      <div className="flex space-x-4">
        {projectUrl && (
          <a
            href={projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            View Project
          </a>
        )}
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            GitHub
          </a>
        )}
      </div>
    </motion.div>
  );
} 