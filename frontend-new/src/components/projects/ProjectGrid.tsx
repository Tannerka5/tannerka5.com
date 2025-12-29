import { motion } from "framer-motion";
import type { FC } from "react";
import ProjectCard from "./ProjectCard";
import { projects } from "../../../data/projects";

const ProjectGrid: FC = () => {
  return (
    <main className="bg-cream min-h-screen">
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-display font-bold text-earth mb-4">
              Featured Projects
            </h1>
            <p className="text-earth/70 text-lg max-w-2xl mx-auto">
              A showcase of full-stack applications demonstrating cloud
              architecture, database design, and modern web development
              practices.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => {
                console.log('Project:', project.slug, 'Logo:', project.logo, 'Icon:', project.icon);
                return (
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
                );
              })}
            </div>

        </div>
      </section>
    </main>
  );
};

export default ProjectGrid;
