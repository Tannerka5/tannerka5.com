import { motion } from "framer-motion";
import type { FC } from "react";

interface ProjectTechStackProps {
  techStack: string[];
}

const ProjectTechStack: FC<ProjectTechStackProps> = ({ techStack }) => {
  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-display font-bold text-earth mb-8 text-center"
        >
          Tech Stack
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-3 justify-center"
        >
          {techStack.map((tech, index) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.05 }}
              className="px-5 py-2 bg-sage/10 text-sage-dark font-medium rounded-full border border-sage/30 hover:border-sage hover:bg-sage/20 transition-all"
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectTechStack;
