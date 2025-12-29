import type { FC } from "react";
import { motion } from "framer-motion";

const ProjectsContent: FC = () => {
  return (
    <main className="bg-gray-50">
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            My Projects
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-gray-600 mb-12"
          >
            Here are some of the projects I&apos;ve built. Each demonstrates
            different skills and technologies.
          </motion.p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Project 1 - Ella Rises */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="h-48 bg-gradient-to-br from-pink-100 via-purple-100 to-pink-50 flex items-center justify-center p-8">
                <img
                  src="/images/ellarises-logo.png"
                  alt="Ella Rises Logo"
                  className="max-h-32 w-auto transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Ella Rises Program Management System
                </h3>
                <p className="text-gray-600 mb-4">
                  Full-stack web application for nonprofit management
                  featuring event scheduling, participant tracking, donation
                  management, and role-based dashboards with secure
                  authentication.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded">
                    Node.js
                  </span>
                  <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded">
                    Express
                  </span>
                  <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded">
                    MySQL RDS
                  </span>
                  <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded">
                    AWS EB
                  </span>
                  <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded">
                    EJS
                  </span>
                  <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded">
                    bcrypt
                  </span>
                </div>
                <div className="flex gap-4">
                  <a
                    href="https://ellarises-1-14-intex.is404.net/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200"
                  >
                    Live Demo →
                  </a>
                  <a
                    href="https://github.com/Tannerka5/INTEX--EllaRises"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-800 font-semibold transition-colors duration-200"
                  >
                    GitHub →
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Project 2 - NeighborAid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="group bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="h-48 bg-gradient-to-br from-green-100 via-blue-100 to-teal-50 flex items-center justify-center p-8">
                <img
                  src="/images/neighboraid-logo.png"
                  alt="NeighborAid Logo"
                  className="max-h-32 w-auto transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  NeighborAid Emergency Preparedness
                </h3>
                <p className="text-gray-600 mb-4">
                  Community platform connecting neighbors to share emergency
                  resources and strengthen disaster preparedness. Features
                  resource inventory tracking, member profiles, and
                  neighborhood coordination tools.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    Node.js
                  </span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    Express
                  </span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    MySQL RDS
                  </span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    AWS EB
                  </span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    EJS
                  </span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    HTTPS
                  </span>
                </div>
                <div className="flex gap-4">
                  <a
                    href="https://neighboraid.is404.net/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200"
                  >
                    Live Demo →
                  </a>
                  <a
                    href="https://github.com/Tannerka5/NeighborAid"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-800 font-semibold transition-colors duration-200"
                  >
                    GitHub →
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Project 3 - Cloud Portfolio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="group bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="h-48 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center p-8">
                <div className="text-white text-center transition-transform duration-300 group-hover:scale-105">
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
                    ></path>
                  </svg>
                  <p className="text-2xl font-bold">AWS Portfolio</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Cloud Portfolio Website
                </h3>
                <p className="text-gray-600 mb-4">
                  Scalable, cloud-hosted portfolio built on AWS with S3,
                  CloudFront, and Cloudflare DNS. Demonstrates infrastructure
                  as code, cost optimization, and product management best
                  practices.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    AWS S3
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    CloudFront
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    ACM
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    Cloudflare
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    Tailwind
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    HTML/CSS/JS
                  </span>
                </div>
                <div className="flex gap-4">
                  <a
                    href="https://tannerka5.com"
                    className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200"
                  >
                    Live Site →
                  </a>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-800 font-semibold transition-colors duration-200"
                  >
                    Case Study →
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProjectsContent;
