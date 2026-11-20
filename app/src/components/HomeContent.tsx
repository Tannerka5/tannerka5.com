import { motion } from 'framer-motion';
import type { FC } from 'react';
import { lazy, Suspense, useState, useEffect } from 'react';

// Lazy load heavy components
const AnimatedDivider = lazy(() => import('./AnimatedDivider'));

// Memoized data arrays
const TECH_STACK = [
    'TypeScript',
    'Node.js',
    'React',
    'AWS',
    'PostgreSQL',
    'Express',
    'Astro',
    'Tailwind',
] as const;

type ProjectItem =
    | {
          title: string;
          description: string;
          tech: string[];
          color: string;
          link: string;
          logo: string;
      }
    | {
          title: string;
          description: string;
          tech: string[];
          color: string;
          link: string;
          isCloud: true;
      };

const FEATURED_PROJECTS: ProjectItem[] = [
    {
        title: 'Ella Rises',
        description: 'Nonprofit management platform with event tracking and analytics',
        tech: ['Node.js', 'MySQL', 'AWS'],
        color: 'from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30',
        link: '/projects/ella-rises',
        logo: '/images/ellarises-logo.png',
    },
    {
        title: 'NeighborAid',
        description: 'Community emergency preparedness and resource sharing',
        tech: ['Express', 'HTTPS', 'Leaflet'],
        color: 'from-blue-50 to-sky-100 dark:from-blue-900/30 dark:to-sky-900/30',
        link: '/projects/neighboraid',
        logo: '/images/neighboraid-logo.png',
    },
    {
        title: 'Cloud Portfolio',
        description: 'Scalable portfolio on AWS with global CDN',
        tech: ['Astro', 'S3', 'CloudFront'],
        color: 'from-primary to-secondary dark:from-primary-dark dark:to-secondary-dark',
        link: '/projects/cloud-portfolio',
        isCloud: true,
    },
];

const HomeContent: FC = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const [shouldAnimate, setShouldAnimate] = useState(false);

    useEffect(() => {
        let isTicking = false;
        const checkMobile = () => {
            if (!isTicking) {
                window.requestAnimationFrame(() => {
                    setIsMobile(window.innerWidth < 768);
                    isTicking = false;
                });
                isTicking = true;
            }
        };
        checkMobile();

        // Check for reduced motion preference
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);
        const handleChange = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
        mediaQuery.addEventListener('change', handleChange);

        // Defer animations to next frame to prevent initial lag
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setShouldAnimate(true);
            });
        });

        window.addEventListener('resize', checkMobile, { passive: true });
        return () => {
            window.removeEventListener('resize', checkMobile);
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);
    return (
        <main className="bg-cream dark:bg-gray-900 transition-colors duration-300 overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent opacity-5 dark:opacity-10"></div>

                {/* Floating Shapes - OPTIMIZED for mobile */}
                <motion.div
                    {...(prefersReducedMotion
                        ? {}
                        : {
                              animate: {
                                  y: [0, -20, 0],
                                  rotate: [0, 5, 0],
                              },
                              transition: {
                                  duration: 6,
                                  repeat: Infinity,
                                  ease: 'easeInOut',
                              },
                          })}
                    className="absolute top-20 left-4 md:left-10 w-24 h-24 md:w-32 md:h-32 bg-accent/10 dark:bg-accent/20 rounded-full blur-3xl will-change-transform"
                />
                <motion.div
                    {...(prefersReducedMotion
                        ? {}
                        : {
                              animate: {
                                  y: [0, 20, 0],
                                  rotate: [0, -5, 0],
                              },
                              transition: {
                                  duration: 8,
                                  repeat: Infinity,
                                  ease: 'easeInOut',
                              },
                          })}
                    className="absolute bottom-20 right-4 md:right-10 w-32 h-32 md:w-40 md:h-40 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl will-change-transform"
                />

                <div className="relative z-10 max-w-5xl mx-auto text-center">
                    <motion.div
                        {...(prefersReducedMotion || !shouldAnimate
                            ? {}
                            : {
                                  initial: { opacity: 0 },
                                  animate: { opacity: 1 },
                                  transition: { duration: 0.7, ease: 'easeOut' },
                              })}
                    >
                        <h1 className="text-5xl md:text-7xl font-display font-bold text-earth dark:text-gray-100 mb-6">
                            Hi, I&apos;m{' '}
                            <motion.span
                                className="text-transparent bg-clip-text inline-block"
                                style={{
                                    backgroundImage:
                                        'linear-gradient(90deg, #2E5266, #4d85a4ff, #2E5266)',
                                    backgroundSize: '300% 100%',
                                }}
                                {...(prefersReducedMotion || isMobile
                                    ? {}
                                    : {
                                          animate: {
                                              backgroundPosition: [
                                                  '0% 50%',
                                                  '50% 50%',
                                                  '100% 50%',
                                                  '50% 50%',
                                                  '0% 50%',
                                              ],
                                          },
                                          transition: {
                                              duration: 6,
                                              repeat: Infinity,
                                              ease: 'easeInOut',
                                              times: [0, 0.25, 0.5, 0.75, 1],
                                          },
                                      })}
                            >
                                Tanner Atkinson
                            </motion.span>
                        </h1>
                    </motion.div>

                    <motion.p
                        {...(prefersReducedMotion || !shouldAnimate
                            ? {}
                            : {
                                  initial: { opacity: 0 },
                                  animate: { opacity: 1 },
                                  transition: { duration: 0.7, delay: 0.15, ease: 'easeOut' },
                              })}
                        className="text-xl md:text-2xl text-earth/70 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
                    >
                        Full-Stack Developer specializing in TypeScript, building scalable web
                        applications with cloud infrastructure and database design.
                    </motion.p>

                    <motion.div
                        {...(prefersReducedMotion || !shouldAnimate
                            ? {}
                            : {
                                  initial: { opacity: 0 },
                                  animate: { opacity: 1 },
                                  transition: { duration: 0.7, delay: 0.3, ease: 'easeOut' },
                              })}
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
                            className="px-8 py-4 bg-white dark:bg-gray-800 text-earth dark:text-gray-100 border-2 border-sage dark:border-gray-600 rounded-lg font-semibold hover:bg-sage hover:text-white dark:hover:bg-gray-700 transition-colors"
                        >
                            Get In Touch
                        </motion.a>
                    </motion.div>

                    {/* Tech Stack Pills */}
                    <motion.div
                        {...(prefersReducedMotion || !shouldAnimate
                            ? {}
                            : {
                                  initial: { opacity: 0 },
                                  animate: { opacity: 1 },
                                  transition: { duration: 0.7, delay: 0.4, ease: 'easeOut' },
                              })}
                        className="flex flex-wrap gap-3 justify-center"
                    >
                        {TECH_STACK.map((tech) => (
                            <span
                                key={tech}
                                className="px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-earth/70 dark:text-gray-300 rounded-full text-sm font-medium border border-sage/20 dark:border-gray-600"
                            >
                                {tech}
                            </span>
                        ))}
                    </motion.div>
                </div>

                {/* Scroll Indicator: the wrapper centers it so framer-motion's transform
                    (used for the bounce) can't override the horizontal centering. */}
                <div className="absolute bottom-8 inset-x-0 flex justify-center pointer-events-none">
                    <motion.div
                        {...(prefersReducedMotion || !shouldAnimate
                            ? {}
                            : {
                                  animate: { y: [0, 10, 0] },
                                  transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                              })}
                        className="will-change-transform"
                    >
                        <svg
                            className="w-6 h-6 text-earth/50 dark:text-gray-500"
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
                </div>
            </section>

            <Suspense fallback={<div className="h-2" />}>
                <AnimatedDivider color="#6B9080" />
            </Suspense>

            {/* About Preview Section */}
            <section className="py-14 px-4 bg-white dark:bg-gray-800 transition-colors duration-300">
                <motion.div
                    {...(prefersReducedMotion || !shouldAnimate
                        ? {}
                        : {
                              initial: { opacity: 0 },
                              whileInView: { opacity: 1 },
                              viewport: { once: true, margin: '50px' },
                              transition: { duration: 0.6, ease: 'easeOut' },
                          })}
                    className="max-w-3xl mx-auto text-center"
                >
                    <h2 className="text-4xl font-display font-bold text-earth dark:text-gray-100 mb-4">
                        Building with Purpose
                    </h2>
                    <p className="text-earth/70 dark:text-gray-300 text-lg leading-relaxed mb-6">
                        Information Systems student at BYU, graduating December 2026. Most recently
                        a Software Developer Intern at Trove Brands, shipping TypeScript
                        applications built to last.
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
            </section>

            <Suspense fallback={<div className="h-2" />}>
                <AnimatedDivider color="#6B9080" />
            </Suspense>

            {/* Featured Projects Section */}
            <section className="py-20 px-4 bg-cream dark:bg-gray-900 transition-colors duration-300">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        {...(prefersReducedMotion
                            ? {}
                            : {
                                  initial: { opacity: 0, y: 20 },
                                  whileInView: { opacity: 1, y: 0 },
                                  viewport: { once: true, margin: '100px' },
                              })}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-display font-bold text-earth dark:text-gray-100 mb-4">
                            Featured Projects
                        </h2>
                        <p className="text-earth/70 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                            A selection of recent work showcasing full-stack development, cloud
                            architecture, and database design.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        {FEATURED_PROJECTS.map((project, index) => (
                            <motion.a
                                key={project.title}
                                href={project.link}
                                {...(prefersReducedMotion || !shouldAnimate
                                    ? {}
                                    : {
                                          initial: { opacity: 0 },
                                          whileInView: { opacity: 1 },
                                          viewport: { once: true, margin: '50px' },
                                          transition: {
                                              duration: 0.6,
                                              delay: index * 0.1,
                                              ease: 'easeOut',
                                          },
                                          whileHover: { y: -5 },
                                      })}
                                className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl dark:hover:shadow-accent/20 transition-all"
                            >
                                <div
                                    className={`h-32 bg-gradient-to-br ${project.color} rounded-lg mb-4 flex items-center justify-center p-4`}
                                >
                                    {'isCloud' in project ? (
                                        <svg
                                            className="w-20 h-20 text-cream dark:text-white"
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
                                    ) : 'logo' in project ? (
                                        <img
                                            src={project.logo}
                                            alt={`${project.title} logo`}
                                            className="max-h-24 w-auto"
                                            loading="lazy"
                                            width="96"
                                            height="96"
                                        />
                                    ) : null}
                                </div>
                                <h3 className="text-xl font-bold text-earth dark:text-gray-100 mb-2 group-hover:text-accent transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-earth/70 dark:text-gray-300 text-sm mb-4">
                                    {project.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {project.tech.map((tech) => (
                                        <span
                                            key={tech}
                                            className="text-xs px-2 py-1 bg-sage/10 dark:bg-sage/20 text-sage-dark dark:text-sage-light rounded-full"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </motion.a>
                        ))}
                    </div>

                    <motion.div
                        {...(prefersReducedMotion || !shouldAnimate
                            ? {}
                            : {
                                  initial: { opacity: 0 },
                                  whileInView: { opacity: 1 },
                                  viewport: { once: true, margin: '50px' },
                                  transition: { duration: 0.6, ease: 'easeOut' },
                              })}
                        className="text-center"
                    >
                        <motion.a
                            href="/projects"
                            whileHover={{ scale: 1.05 }}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary dark:bg-primary-light text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
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

            <Suspense fallback={<div className="h-2" />}>
                <AnimatedDivider color="#6B9080" />
            </Suspense>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-gradient-to-br from-secondary-light via-primary-light to-earth-light dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 text-white transition-colors duration-300">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        {...(prefersReducedMotion || !shouldAnimate
                            ? {}
                            : {
                                  initial: { opacity: 0 },
                                  whileInView: { opacity: 1 },
                                  viewport: { once: true, margin: '50px' },
                                  transition: { duration: 0.6, ease: 'easeOut' },
                              })}
                    >
                        <h2 className="text-4xl font-display font-bold mb-6">
                            Let&apos;s Build Something Together
                        </h2>
                        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                            I&apos;m graduating in December 2026 and looking for full-time software
                            engineering roles. Have a role or project in mind?
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
