import { motion } from "framer-motion";
import type { FC } from "react";

interface Metric {
  label: string;
  value: string;
}

interface ProjectMetricsProps {
  metrics?: Metric[];
}

const ProjectMetrics: FC<ProjectMetricsProps> = ({ metrics }) => {
  if (!metrics || metrics.length === 0) return null;

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-primary to-primary-dark text-white">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-display font-bold mb-12 text-center"
        >
          Project Impact
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-display font-bold text-accent mb-2">
                {metric.value}
              </div>
              <div className="text-sm text-white/80">{metric.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectMetrics;
