import { motion } from "framer-motion";
import type { FC } from "react";
import { memo } from "react";

interface ProjectCardProps {
  slug: string;
  title: string;
  shortDescription: string;
  techStack: string[];
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
  logo?: string;
  icon?: string;
  links: {
    live?: string;
    github?: string;
  };
  delay?: number;
}

const ProjectCard: FC<ProjectCardProps> = memo(({
  slug,
  title,
  shortDescription,
  techStack,
  gradientFrom,
  gradientVia,
  gradientTo,
  logo,
  icon,
  links,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "50px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group"
    >
      <a
        href={`/projects/${slug}`}
        className="block bg-white dark:bg-gray-800 dark:bg-gray-800 dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900 overflow-hidden transition-all duration-300 hover:shadow-2xl h-full flex flex-col"
      >
        {/* Image/Icon Section */}
        <div
          className={`relative h-48 bg-gradient-to-br ${gradientFrom} ${gradientVia} ${gradientTo} flex items-center justify-center p-8 overflow-hidden`}
        >
          {logo ? (
            <>
              <img
                src={logo}
                alt={`${title} logo`}
                className="max-h-32 w-auto relative z-10 transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
                width="128"
                height="128"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </>
          ) : icon === "cloud" ? (
            <div className="text-white text-center relative z-10">
              <svg
                className="w-24 h-24 mx-auto mb-2 transition-transform duration-300 group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                />
              </svg>
              <p className="text-xl font-bold">AWS Portfolio</p>
            </div>
          ) : null}
        </div>

        {/* Content Section */}
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-earth dark:text-gray-100 dark:text-gray-100 mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-earth dark:text-gray-100 dark:text-gray-100/70 text-sm mb-4 line-clamp-3 flex-1">
            {shortDescription}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mb-4">
            {techStack.slice(0, 6).map((tech) => (
              <span
                key={tech}
                className="bg-sage/10 dark:bg-sage/20 text-sage-dark text-xs px-3 py-1 rounded-full border border-sage/20 dark:border-gray-700 dark:border-gray-700 hover:border-sage hover:bg-sage/20 transition-all"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex gap-4 pt-2 border-t dark:border-gray-700">
            <motion.span 
              className="text-accent text-sm font-medium group-hover:text-accent-dark transition-colors flex items-center gap-1"
              whileHover={{ x: 5, transition: { duration: 0.2 } }}
            >
              View Details 
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.span>
            {links.live && (
              <span className="text-earth dark:text-gray-100 dark:text-gray-100/50 text-xs flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                Live
              </span>
            )}
          </div>
        </div>
      </a>
    </motion.div>
  );
});

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;
