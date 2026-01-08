import { motion } from "framer-motion";
import type { FC } from "react";
import AnimatedDivider from './AnimatedDivider';
import StaggeredList from './StaggeredList';
import AnimatedCounter from './AnimatedCounter';

const AboutContent: FC = () => {
  return (
    <main className="bg-cream dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1 
                className="text-5xl font-display font-bold text-earth dark:text-gray-100 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                About Me
              </motion.h1>
              <motion.p 
                className="text-xl text-earth dark:text-gray-100/70 leading-relaxed mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                I'm an Information Systems student at Brigham Young University with a
                passion for building scalable web applications and solving complex
                technical challenges.
              </motion.p>
              <motion.p 
                className="text-lg text-earth dark:text-gray-100/70 leading-relaxed mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                My journey in software development combines hands-on project
                experience, cloud infrastructure expertise, and a commitment to
                writing clean, maintainable code that makes a real impact.
              </motion.p>
              <motion.div 
                className="flex gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <motion.a
                  href="/contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent-dark transition-colors"
                >
                  Get In Touch
                </motion.a>
                <motion.a
                  href="/resume/tanner-atkinson-resume.pdf"
                  download
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-white dark:bg-gray-800 text-earth dark:text-gray-100 border-2 border-sage rounded-lg font-semibold hover:bg-sage hover:text-white transition-colors"
                >
                  Download Resume
                </motion.a>
              </motion.div>
            </motion.div>
      
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl shadow-2xl overflow-hidden border-4 border-white">
                <img
                  src="/images/profile.jpg"
                  alt="Tanner Atkinson"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  fetchPriority="low"
                  width="400"
                  height="400"
                />
              </div>
              {/* Optional decorative gradient overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 pointer-events-none"></div>
            </motion.div>
          </div>
        </div>
      </section>

      <AnimatedDivider color="#6B9080" />

      {/* Experience Timeline */}
      <section className="py-20 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-display font-bold text-earth dark:text-gray-100 mb-12 text-center"
          >
            Experience & Education
          </motion.h2>

          <div className="space-y-8">
            {[
              {
                title: "Computer Science Student",
                organization: "Brigham Young University",
                period: "2022 - Present",
                location: "Provo, Utah",
                description: "Pursuing a Bachelor's degree in Computer Science with coursework in database management, web development, data analysis, and software engineering. Maintaining a strong GPA while building real-world projects.",
                highlights: [
                  "Database Management & SQL",
                  "Web Application Development",
                  "Data Analysis & Visualization",
                  "Software Engineering Principles",
                ],
                type: "education",
              },
              {
                title: "Full-Stack Developer",
                organization: "Personal Projects & Freelance",
                period: "2023 - Present",
                location: "Remote",
                description: "Developed multiple full-stack web applications for nonprofits and community organizations, focusing on cloud deployment, database design, and user-centered design.",
                highlights: [
                  "Built 3+ production applications on AWS",
                  "Managed databases with 1000+ records",
                  "Implemented secure authentication systems",
                  "Deployed scalable cloud infrastructure",
                ],
                type: "experience",
              },
              {
                title: "Previous Experience",
                organization: "Various Roles",
                period: "2020 - 2022",
                location: "Dover, Delaware",
                description: "Developed strong problem-solving, communication, and project management skills through various professional experiences before transitioning to software development.",
                highlights: [
                  "Customer service excellence",
                  "Team collaboration",
                  "Project coordination",
                  "Adaptability and quick learning",
                ],
                type: "experience",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="relative pl-8 border-l-4 border-accent"
              >
                <motion.div 
                  className="absolute -left-3 top-0 w-6 h-6 bg-accent rounded-full border-4 border-white"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 0.3, type: "spring", stiffness: 200 }}
                />
                <div className="bg-cream dark:bg-gray-900 p-6 rounded-xl">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="text-2xl font-bold text-earth dark:text-gray-100">{item.title}</h3>
                      <p className="text-lg text-accent font-semibold">
                        {item.organization}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-earth dark:text-gray-100/70 font-medium">{item.period}</p>
                      <p className="text-earth dark:text-gray-100/50 text-sm">{item.location}</p>
                    </div>
                  </div>
                  <p className="text-earth dark:text-gray-100/70 mb-4">{item.description}</p>
                  <StaggeredList className="space-y-2" staggerDelay={0.08}>
                    {item.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start gap-2 text-earth dark:text-gray-100/70">
                        <svg
                          className="w-5 h-5 text-accent flex-shrink-0 mt-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {highlight}
                      </li>
                    ))}
                  </StaggeredList>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatedDivider color="#2E5266" />

      {/* Skills Deep Dive */}
      <section className="py-20 px-4 bg-cream dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-display font-bold text-earth dark:text-gray-100 mb-12 text-center"
          >
            Technical Skills
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                category: "Frontend Development",
                icon: "🎨",
                skills: [
                  { name: "React & Hooks", level: 85 },
                  { name: "Astro", level: 80 },
                  { name: "Tailwind CSS", level: 90 },
                  { name: "JavaScript/TypeScript", level: 85 },
                  { name: "HTML/CSS", level: 95 },
                ],
              },
              {
                category: "Backend Development",
                icon: "⚡",
                skills: [
                  { name: "Node.js", level: 85 },
                  { name: "Express.js", level: 85 },
                  { name: "RESTful APIs", level: 80 },
                  { name: "Authentication (bcrypt, sessions)", level: 80 },
                  { name: "Server-side rendering", level: 75 },
                ],
              },
              {
                category: "Database & Data",
                icon: "🗄️",
                skills: [
                  { name: "PostgreSQL", level: 85 },
                  { name: "MySQL", level: 85 },
                  { name: "Database Design & Normalization", level: 90 },
                  { name: "SQL Query Optimization", level: 80 },
                  { name: "Data Analysis (Python/pandas)", level: 75 },
                ],
              },
              {
                category: "Cloud & DevOps",
                icon: "☁️",
                skills: [
                  { name: "AWS (S3, EC2, RDS, EB, CloudFront)", level: 80 },
                  { name: "Linux/Unix Command Line", level: 85 },
                  { name: "Git & GitHub", level: 90 },
                  { name: "CI/CD Basics", level: 70 },
                  { name: "HTTPS & SSL/TLS", level: 75 },
                ],
              },
            ].map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md dark:shadow-gray-900"
              >
                <div className="flex items-center gap-3 mb-6">
                  <motion.span 
                    className="text-4xl"
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.2, type: "spring", stiffness: 200 }}
                  >
                    {category.icon}
                  </motion.span>
                  <h3 className="text-2xl font-bold text-earth dark:text-gray-100">
                    {category.category}
                  </h3>
                </div>
                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div 
                      key={skill.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + skillIndex * 0.05 }}
                    >
                      <div className="flex justify-between mb-1">
                        <span className="text-earth dark:text-gray-100/80 font-medium">
                          {skill.name}
                        </span>
                        <span className="text-accent font-semibold">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="w-full bg-cream dark:bg-gray-900 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: index * 0.1 + skillIndex * 0.05 + 0.2, ease: "easeOut" }}
                          className="bg-gradient-to-r from-accent to-primary h-2 rounded-full"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatedDivider color="#6B9080" />

      {/* Values & Approach */}
      <section className="py-20 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-display font-bold text-earth dark:text-gray-100 mb-12 text-center"
          >
            My Approach
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "User-Centered Design",
                description:
                  "I build applications with real users in mind, prioritizing accessibility, usability, and intuitive interfaces that solve actual problems.",
                icon: (
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                ),
              },
              {
                title: "Clean, Maintainable Code",
                description:
                  "I write clear, well-documented code that's easy to understand and maintain, following best practices and design patterns.",
                icon: (
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                ),
              },
              {
                title: "Continuous Learning",
                description:
                  "Technology evolves rapidly. I'm committed to staying current with new tools, frameworks, and best practices through hands-on projects and coursework.",
                icon: (
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                ),
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
                className="text-center p-6"
              >
                <motion.div 
                  className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 text-accent rounded-full mb-4"
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 0.2, type: "spring", stiffness: 150 }}
                >
                  {value.icon}
                </motion.div>
                <h3 className="text-xl font-bold text-earth dark:text-gray-100 mb-3">
                  {value.title}
                </h3>
                <p className="text-earth dark:text-gray-100/70 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatedDivider color="#2E5266" />

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-secondary-light via-primary-light to-earth-light dark:from-gray-700 dark:via-gray-900 dark:to-earth text-white transition-colors duration-300">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-display font-bold mb-6">
              Let's Work Together
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              I'm actively seeking internship and full-time opportunities where I
              can contribute to meaningful projects and continue growing as a
              developer.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white dark:bg-gray-800 text-primary rounded-lg font-semibold hover:bg-cream dark:bg-gray-900 transition-colors shadow-lg dark:shadow-accent/20"
              >
                Contact Me
              </motion.a>
              <motion.a
                href="/projects"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-lg font-semibold hover:bg-white dark:bg-gray-800/10 transition-colors"
              >
                View My Work
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default AboutContent;
