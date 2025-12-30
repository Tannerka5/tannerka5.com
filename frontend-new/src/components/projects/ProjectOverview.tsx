import { motion } from "framer-motion";
import type { FC } from "react";

interface ProjectOverviewProps {
  fullDescription: string;
  overview: string;
  problem: string;
  solution: string;
}

const ProjectOverview: FC<ProjectOverviewProps> = ({
  fullDescription,
  overview,
  problem,
  solution,
}) => {
  return (
    <section className="py-16 px-4 bg-cream dark:bg-gray-900 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="text-xl text-earth dark:text-gray-100 dark:text-gray-100/80 leading-relaxed">
            {fullDescription}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Overview",
              content: overview,
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              ),
              color: "accent",
            },
            {
              title: "The Problem",
              content: problem,
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              ),
              color: "primary",
            },
            {
              title: "The Solution",
              content: solution,
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              ),
              color: "accent",
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
              className="bg-white dark:bg-gray-800 dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-sage/10 dark:border-gray-600 hover:shadow-lg dark:shadow-accent/20 transition-shadow"
            >
              <motion.div 
                className={`w-12 h-12 bg-${item.color}/10 rounded-lg flex items-center justify-center mb-4`}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.1, type: "spring", stiffness: 200 }}
              >
                <svg
                  className={`w-6 h-6 text-${item.color}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {item.icon}
                </svg>
              </motion.div>
              <h3 className="text-lg font-bold text-earth dark:text-gray-100 dark:text-gray-100 mb-3">{item.title}</h3>
              <p className="text-earth dark:text-gray-100 dark:text-gray-100/70 text-sm leading-relaxed">{item.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectOverview;
