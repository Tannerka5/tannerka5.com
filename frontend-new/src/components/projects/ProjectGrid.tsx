import { motion } from "framer-motion";
import type { FC } from "react";
import { memo, useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";
import AnimatedDivider from "../AnimatedDivider";
import AnimatedCounter from "../AnimatedCounter";

const STATS = [
  { value: 3, suffix: "+", label: "Projects Deployed" },
  { value: 1000, suffix: "+", label: "Database Records" },
  { value: 100, suffix: "%", label: "Uptime on AWS" },
] as const;

interface ProjectGridProps {
  projects?: any[];
}

const ProjectGrid: FC<ProjectGridProps> = memo(({ projects = [] }) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  return (
    <main className="bg-cream dark:bg-gray-900 dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            {...(prefersReducedMotion ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } })}
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-display font-bold text-earth dark:text-gray-100 dark:text-gray-100 mb-6"
              {...(prefersReducedMotion ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.1 } })}
            >
              Featured Projects
            </motion.h1>
            <motion.p 
              className="text-xl text-earth dark:text-gray-100 dark:text-gray-100/70 max-w-3xl mx-auto mb-8"
              {...(prefersReducedMotion ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.2 } })}
            >
              A showcase of full-stack applications demonstrating cloud
              architecture, database design, and modern web development
              practices.
            </motion.p>
            
            {/* Stats Section with AnimatedCounter */}
            <motion.div
              {...(prefersReducedMotion ? {} : { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.3 } })}
              className="flex flex-wrap justify-center gap-8 mt-12"
            >
              {STATS.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  {...(prefersReducedMotion ? {} : { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { delay: 0.4 + index * 0.1, type: "spring", stiffness: 200 } })}
                  className="text-center"
                >
                  <div className="text-4xl font-display font-bold text-accent mb-2">
                    <AnimatedCounter to={stat.value} duration={2} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-earth dark:text-gray-100 dark:text-gray-100/70 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <AnimatedDivider color="#6B9080" />

      {/* Projects Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.slug}
                slug={project.slug}
                title={project.title}
                shortDescription={project.shortDescription}
                techStack={project.techStack}
                gradientFrom={project.gradientFrom}
                gradientVia={project.gradientVia}
                gradientTo={project.gradientTo}
                logo={project.logo}
                icon={project.icon}
                links={project.links}
                delay={0.2 + index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      <AnimatedDivider color="#2E5266" />

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-secondary-light via-primary-light to-earth-light dark:from-gray-700 dark:via-gray-900 dark:to-earth text-white transition-colors duration-300">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            {...(prefersReducedMotion ? {} : { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } })}
          >
            <h2 className="text-4xl font-display font-bold mb-6">
              Let's Build Something Together
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              I'm actively seeking internship and full-time opportunities.
              Check out my work and let's connect!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white dark:bg-gray-800 dark:bg-gray-800 text-primary rounded-lg font-semibold hover:bg-cream dark:bg-gray-900 dark:bg-gray-900 transition-colors shadow-lg dark:shadow-accent/20"
              >
                Contact Me
              </motion.a>
              <motion.a
                href="/about"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-lg font-semibold hover:bg-white dark:bg-gray-800 dark:bg-gray-800/10 transition-colors"
              >
                Learn More About Me
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
});

ProjectGrid.displayName = 'ProjectGrid';

export default ProjectGrid;
