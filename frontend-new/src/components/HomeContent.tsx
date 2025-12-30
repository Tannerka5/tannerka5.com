import { motion } from "framer-motion";
import type { FC } from "react";
import AnimatedCounter from './AnimatedCounter';
import AnimatedDivider from './AnimatedDivider';
import StaggeredList from './StaggeredList';

const HomeContent: FC = () => {
  return (
    <main className="bg-cream">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent opacity-5"></div>
        
        {/* Floating Shapes */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"
        />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold text-earth mb-6">
              Hi, I'm{" "}
              <motion.span
                className="text-transparent bg-clip-text inline-block"
                style={{
                  backgroundImage: "linear-gradient(90deg, #2E5266, #3D6A82, #2E5266)",
                  backgroundSize: "300% 100%",
                }}
                animate={{
                  backgroundPosition: ["0% 50%", "50% 50%", "100% 50%", "50% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.25, 0.5, 0.75, 1],
                }}
              >
                Tanner Atkinson
              </motion.span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-earth/70 mb-8 max-w-3xl mx-auto"
          >
            Full-Stack Developer building scalable web applications with cloud
            infrastructure, database design, and modern frameworks.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap gap-4 justify-center mb-12"
          >
            <motion.a
              href="/projects"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-accent text-white rounded-lg font-semibold shadow-lg hover:bg-accent-dark transition-colors"
            >
              View My Work
            </motion.a>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-earth border-2 border-sage rounded-lg font-semibold hover:bg-sage hover:text-white transition-colors"
            >
              Get In Touch
            </motion.a>
          </motion.div>

          {/* Tech Stack Pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-3 justify-center"
          >
            {[
              "Node.js",
              "React",
              "AWS",
              "PostgreSQL",
              "Express",
              "Astro",
              "Tailwind",
            ].map((tech, index) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="px-4 py-2 bg-white/80 backdrop-blur-sm text-earth/70 rounded-full text-sm font-medium border border-sage/20"
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <svg
            className="w-6 h-6 text-earth/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </section>
      
      <AnimatedDivider color="#6B9080" />

      {/* About Preview Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-display font-bold text-earth mb-6">
                Building with Purpose
              </h2>
              <p className="text-earth/70 text-lg leading-relaxed mb-6">
                I'm a Computer Science student at BYU specializing in full-stack
                development and cloud architecture. I love turning complex problems
                into elegant, scalable solutions.
              </p>
              <p className="text-earth/70 text-lg leading-relaxed mb-8">
                From nonprofit management systems to community emergency platforms,
                I build applications that make a real impact while pushing my
                technical skills forward.
              </p>
              <motion.a
                href="/about"
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 text-accent font-semibold hover:text-accent-dark transition-colors"
              >
                Learn more about me
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
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </motion.a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                  { label: "Projects Built", value: 10, suffix: "+" },
                  { label: "Technologies", value: 15, suffix: "+" },
                  { label: "GitHub Repos", value: 25, suffix: "+" },
                  { label: "Monster Consumed", value: "∞", isSpecial: true },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-cream p-6 rounded-xl text-center border border-sage/20"
                  >
                    <div className="text-3xl font-display font-bold text-accent mb-2">
                      {stat.isSpecial ? (
                        stat.value
                      ) : (
                        <AnimatedCounter to={stat.value as number} suffix={stat.suffix} duration={1.5} />
                      )}
                    </div>
                    <div className="text-sm text-earth/70">{stat.label}</div>
                  </motion.div>
                ))}

            </motion.div>
          </div>
        </div>
      </section>

      <AnimatedDivider color="#6B9080" />

      {/* Featured Projects Section */}
      <section className="py-20 px-4 bg-cream">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold text-earth mb-4">
              Featured Projects
            </h2>
            <p className="text-earth/70 text-lg max-w-2xl mx-auto">
              A selection of recent work showcasing full-stack development, cloud
              architecture, and database design.
            </p>
          </motion.div>
                
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                title: "Ella Rises",
                description: "Nonprofit management platform with event tracking and analytics",
                tech: ["Node.js", "MySQL", "AWS"],
                color: "from-pink-100 to-purple-100",
                link: "/projects/ella-rises",
                logo: "/images/ellarises-logo.png",
              },
              {
                title: "NeighborAid",
                description: "Community emergency preparedness and resource sharing",
                tech: ["Express", "HTTPS", "Leaflet"],
                color: "from-blue-50 to-sky-100",
                link: "/projects/neighboraid",
                logo: "/images/neighboraid-logo.png",
              },
              {
                title: "Cloud Portfolio",
                description: "Scalable portfolio on AWS with global CDN",
                tech: ["Astro", "S3", "CloudFront"],
                color: "from-primary to-secondary",
                link: "/projects/cloud-portfolio",
                isCloud: true,
              },
            ].map((project, index) => (
              <motion.a
                key={project.title}
                href={project.link}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all"
              >
                <div
                  className={`h-32 bg-gradient-to-br ${project.color} rounded-lg mb-4 flex items-center justify-center p-4`}
                >
                  {project.isCloud ? (
                    <svg
                      className="w-20 h-20 text-cream"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                      />
                    </svg>
                  ) : (
                    <img
                      src={project.logo}
                      alt={`${project.title} logo`}
                      className="max-h-24 w-auto"
                    />
                  )}
                </div>
                <h3 className="text-xl font-bold text-earth mb-2 group-hover:text-accent transition-colors">
                  {project.title}
                </h3>
                <p className="text-earth/70 text-sm mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2 py-1 bg-sage/10 text-sage-dark rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.a>
            ))}
          </div>
        
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.a
              href="/projects"
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              View All Projects
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
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </motion.a>
          </motion.div>
        </div>
      </section>

      <AnimatedDivider color="#6B9080" />

      {/* Skills Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold text-earth mb-4">
              Skills & Technologies
            </h2>
            <p className="text-earth/70 text-lg">
              Tools and technologies I work with regularly
            </p>
          </motion.div>
        
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Frontend",
                skills: ["React", "Astro", "Tailwind CSS", "Framer Motion", "EJS"],
              },
              {
                title: "Backend",
                skills: ["Node.js", "Express", "PostgreSQL", "MySQL", "REST APIs"],
              },
              {
                title: "Cloud & DevOps",
                skills: ["AWS (S3, EC2, RDS, EB)", "CloudFront", "Git/GitHub", "Linux"],
              },
            ].map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-cream p-8 rounded-xl border border-sage/20"
              >
                <h3 className="text-2xl font-bold text-earth mb-4">{category.title}</h3>
                <StaggeredList className="space-y-2" staggerDelay={0.1}>
                  {category.skills.map((skill) => (
                    <li key={skill} className="flex items-center gap-2 text-earth/70">
                      <svg
                        className="w-4 h-4 text-accent"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {skill}
                    </li>
                  ))}
                </StaggeredList>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatedDivider color="#6B9080" />

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-secondary-dark via-primary-dark to-earth-light text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-display font-bold mb-6">
              Let's Build Something Together
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              I'm currently seeking internship and full-time opportunities.
              Interested in collaborating or have a project in mind?
            </p>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-4 bg-white text-primary rounded-lg font-semibold hover:bg-cream transition-colors shadow-lg"
            >
              Start a Conversation
            </motion.a>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default HomeContent;
