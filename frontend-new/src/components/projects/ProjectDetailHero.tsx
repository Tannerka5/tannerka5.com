import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import type { FC } from "react";

interface ProjectDetailHeroProps {
  title: string;
  role: string;
  timeline: string;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
  logo?: string;
  icon?: string;
  links: {
    live?: string;
    github?: string;
    demo?: string;
  };
}

const ProjectDetailHero: FC<ProjectDetailHeroProps> = ({
  title,
  role,
  timeline,
  gradientFrom,
  gradientVia,
  gradientTo,
  logo,
  icon,
  links,
}) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check if dark mode is active
    setIsDark(document.documentElement.classList.contains('dark'));
    
    // Watch for dark mode changes
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  // Extract color values and create dark mode variants
  const getGradientClasses = () => {
    if (isDark) {
      // Convert light gradients to dark variants
      const darkFrom = gradientFrom
        .replace('from-pink-100', 'from-pink-900/40')
        .replace('from-pink-200', 'from-pink-900/40')
        .replace('from-purple-100', 'from-purple-900/40')
        .replace('from-blue-50', 'from-blue-900/40')
        .replace('from-blue-100', 'from-blue-900/40')
        .replace('from-sky-100', 'from-sky-900/40')
        .replace('from-primary', 'from-primary-dark');
      
      const darkVia = gradientVia
        .replace('via-pink-200', 'via-purple-900/40')
        .replace('via-pink-100', 'via-purple-900/40')
        .replace('via-purple-100', 'via-purple-900/40')
        .replace('via-blue-100', 'via-sky-900/40')
        .replace('via-sky-100', 'via-sky-900/40')
        .replace('via-primary-light', 'via-primary');
      
      const darkTo = gradientTo
        .replace('to-purple-100', 'to-purple-900/40')
        .replace('to-pink-100', 'to-pink-900/40')
        .replace('to-sky-100', 'to-sky-900/40')
        .replace('to-blue-100', 'to-blue-900/40')
        .replace('to-secondary', 'to-secondary-dark');
      
      return `${darkFrom} ${darkVia} ${darkTo}`;
    }
    
    return `${gradientFrom} ${gradientVia} ${gradientTo}`;
  };

  return (
    <section
      className={`relative bg-gradient-to-br ${getGradientClasses()} py-20 px-4 overflow-hidden transition-colors duration-300`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5">
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Logo/Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex justify-center md:justify-start"
          >
            {logo ? (
              <img
                src={logo}
                alt={`${title} logo`}
                className="max-h-64 w-auto drop-shadow-2xl"
              />
            ) : icon === "cloud" ? (
              <div className="text-cream dark:text-white">
                <svg
                  className="w-48 h-48 drop-shadow-2xl"
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
              </div>
            ) : null}
          </motion.div>

          {/* Right: Title & Meta */}
          <div className="text-center md:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl font-display font-bold text-earth dark:text-white mb-4"
            >
              {title}
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 justify-center md:justify-start mb-6"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4, type: "spring", stiffness: 200 }}
                className="px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-sm font-medium text-earth dark:text-gray-100"
              >
                {role}
              </motion.span>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5, type: "spring", stiffness: 200 }}
                className="px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-sm font-medium text-earth dark:text-gray-100"
              >
                {timeline}
              </motion.span>
            </motion.div>

            {/* Action Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-4 justify-center md:justify-start"
            >
              {links.live && (
                <motion.a
                  href={links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors flex items-center gap-2 shadow-lg"
                >
                  <svg
                    className="w-5 h-5"
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
                  View Live Site
                </motion.a>
              )}
              {links.github && (
                <motion.a
                  href={links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-earth dark:bg-gray-700 text-white rounded-lg font-medium hover:bg-earth-light dark:hover:bg-gray-600 transition-colors flex items-center gap-2 shadow-lg"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  View Code
                </motion.a>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectDetailHero;
