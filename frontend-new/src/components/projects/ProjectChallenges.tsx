import { motion } from "framer-motion";
import type { FC } from "react";

interface Challenge {
  title: string;
  description: string;
  solution: string;
}

interface ProjectChallengesProps {
  challenges: Challenge[];
}

const ProjectChallenges: FC<ProjectChallengesProps> = ({ challenges }) => {
  return (
    <section className="py-16 px-4 bg-white dark:bg-gray-800 dark:bg-gray-800">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-display font-bold text-earth dark:text-gray-100 dark:text-gray-100 mb-12 text-center"
        >
          Key Challenges & Solutions
        </motion.h2>

        <div className="space-y-8">
          {challenges.map((challenge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-cream dark:bg-gray-900 dark:bg-gray-900 p-8 rounded-xl border-l-4 border-accent"
            >
              <h3 className="text-xl font-bold text-earth dark:text-gray-100 dark:text-gray-100 mb-3 flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                {challenge.title}
              </h3>
              <div className="ml-11 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">
                    Challenge
                  </h4>
                  <p className="text-earth dark:text-gray-100 dark:text-gray-100/70 leading-relaxed">
                    {challenge.description}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-accent uppercase tracking-wide mb-2">
                    Solution
                  </h4>
                  <p className="text-earth dark:text-gray-100 dark:text-gray-100/70 leading-relaxed">
                    {challenge.solution}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectChallenges;
