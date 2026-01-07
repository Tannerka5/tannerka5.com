import { motion } from "framer-motion";
import type { FC } from "react";

interface ProjectNavigationProps {
  currentSlug: string;
  allSlugs: string[];
}

const ProjectNavigation: FC<ProjectNavigationProps> = ({
  currentSlug,
  allSlugs,
}) => {
  const currentIndex = allSlugs.indexOf(currentSlug);
  const prevSlug = currentIndex > 0 ? allSlugs[currentIndex - 1] : null;
  const nextSlug =
    currentIndex < allSlugs.length - 1 ? allSlugs[currentIndex + 1] : null;

  return (
    <section className="py-12 px-4 bg-cream dark:bg-gray-900 border-t border-sage/20 dark:border-gray-700">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-3 gap-4 items-center">
          {/* Left: Previous Project */}
          <div className="flex justify-start">
            {prevSlug ? (
              <motion.a
                href={`/projects/${prevSlug}`}
                whileHover={{ x: -5 }}
                className="flex items-center gap-2 text-primary dark:text-accent-light hover:text-accent transition-colors"
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="font-medium hidden sm:inline">Previous Project</span>
                <span className="font-medium sm:hidden">Previous</span>
              </motion.a>
            ) : (
              <div></div>
            )}
          </div>

          {/* Center: All Projects Button */}
          <div className="flex justify-center">
            <motion.a
              href="/projects"
              whileHover={{ scale: 1.05 }}
              className="px-6 py-2 bg-sage dark:bg-sage-dark text-white rounded-lg font-medium hover:bg-sage-dark dark:hover:bg-sage transition-colors"
            >
              All Projects
            </motion.a>
          </div>

          {/* Right: Next Project */}
          <div className="flex justify-end">
            {nextSlug ? (
              <motion.a
                href={`/projects/${nextSlug}`}
                whileHover={{ x: 5 }}
                className="flex items-center gap-2 text-primary dark:text-accent-light hover:text-accent transition-colors"
              >
                <span className="font-medium hidden sm:inline">Next Project</span>
                <span className="font-medium sm:hidden">Next</span>
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </motion.a>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectNavigation;
