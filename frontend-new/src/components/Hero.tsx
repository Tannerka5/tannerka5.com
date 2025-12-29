import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold text-gray-900 mb-4"
        >
          Hi, I'm Tanner Atkinson
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-xl text-gray-600 mb-8"
        >
          Information Systems Student | Data & Product Management | Cloud Infrastructure
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex justify-center space-x-4"
        >
          <a
            href="/projects"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            View My Work
          </a>
          <a
            href="/contact"
            className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition"
          >
            Get In Touch
          </a>
        </motion.div>
      </div>
    </section>
  );
}
