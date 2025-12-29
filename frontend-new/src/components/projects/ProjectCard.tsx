import { motion } from "framer-motion";
import type { FC } from "react";

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

const ProjectCard: FC<ProjectCardProps> = ({
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="group"
    >
      <a
        href={`/projects/${slug}`}
        className="block bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      >
        {/* Image/Icon Section */}
        <div
          className={`h-48 bg-gradient-to-br ${gradientFrom} ${gradientVia} ${gradientTo} flex items-center justify-center p-8`}
        >
          {logo ? (
            <img
              src={logo}
              alt={`${title} logo`}
              className="max-h-32 w-auto transition-transform duration-300 group-hover:scale-105"
            />
          ) : icon === "cloud" ? (
            <div className="text-cream text-center transition-transform duration-300 group-hover:scale-105">
              <svg
                className="w-24 h-24 mx-auto mb-2"
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
              <p className="text-2xl font-bold">AWS Portfolio</p>
            </div>
          ) : null}
        </div>

        {/* Content Section */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-earth mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-earth/70 text-sm mb-4 line-clamp-3">
            {shortDescription}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mb-4">
            {techStack.slice(0, 6).map((tech) => (
              <span
                key={tech}
                className="bg-sage/10 text-sage-dark text-xs px-3 py-1 rounded-full border border-sage/20"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex gap-4 pt-2 border-t border-cream-dark">
            <span className="text-accent text-sm font-medium group-hover:text-accent-dark transition-colors">
              View Details →
            </span>
            {links.live && (
              <span className="text-earth/50 text-xs flex items-center gap-1">
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
};

export default ProjectCard;
