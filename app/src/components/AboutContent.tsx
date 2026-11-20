import { motion } from 'framer-motion';
import type { FC } from 'react';
import AnimatedDivider from './AnimatedDivider';

interface TimelineEntry {
    kind: 'Work' | 'Education' | 'Service';
    date: string;
    title: string;
    org: string;
    location: string;
    points: string[];
}

// Ordered by most recent end date.
const TIMELINE: TimelineEntry[] = [
    {
        kind: 'Education',
        date: 'Anticipated Dec 2026',
        title: 'B.S. in Information Systems',
        org: 'Brigham Young University, Marriott School of Business',
        location: 'Provo, UT',
        points: ['Minor in Environmental Science'],
    },
    {
        kind: 'Work',
        date: 'May 2026 - Jul 2026',
        title: 'Software Developer Intern',
        org: 'Trove Brands',
        location: 'Lehi, UT',
        points: [
            '11.2K-line full-stack Shopify app in TypeScript with a modular service/repository architecture',
            'Kubernetes and CI/CD deployment infrastructure; automated tests expanded to 330',
            'Root-cause fixes for production issues and peer code reviews',
        ],
    },
    {
        kind: 'Work',
        date: 'Mar 2019 - May 2026',
        title: 'IT Manager & Team Leader',
        org: 'Chick-fil-A',
        location: 'Dover, DE and Provo, UT',
        points: [
            'Supported 40+ POS, KPS, and iPOS systems with high uptime',
            'Directed 60 staff and analyzed 20+ sales metrics, driving a 26.4% store sales increase in 6 months',
        ],
    },
    {
        kind: 'Service',
        date: 'Sep 2023 - Aug 2025',
        title: 'Volunteer Representative',
        org: 'Community service',
        location: 'S\u00e3o Paulo, Brazil',
        points: [
            'Led community service projects and trained and supervised 70+ volunteers',
            'Taught Beginner and Advanced English courses',
        ],
    },
];

const STACK = [
    {
        name: 'Interface',
        caption: 'What people see and touch',
        tint: 'bg-accent/5 dark:bg-white/[0.03]',
        skills: ['React', 'Astro', 'Tailwind CSS', 'HTML/CSS', 'Razor Pages'],
    },
    {
        name: 'Application',
        caption: 'Where the logic lives',
        tint: 'bg-accent/10 dark:bg-white/[0.06]',
        skills: [
            'TypeScript',
            'Node.js',
            'C#',
            'ASP.NET MVC Core',
            'REST APIs',
            'GraphQL',
        ],
    },
    {
        name: 'Data',
        caption: 'Stored, modeled, analyzed',
        tint: 'bg-accent/15 dark:bg-white/[0.09]',
        skills: [
            'MySQL',
            'PostgreSQL',
            'Python',
            'Feature Engineering',
            'Classification & Clustering Models',
            'Tableau',
            'Power BI',
        ],
    },
    {
        name: 'Cloud & Delivery',
        caption: 'Where it runs and ships',
        tint: 'bg-accent/20 dark:bg-white/[0.12]',
        skills: [
            'AWS: EC2, S3, RDS, Lambda, CloudFront, ACM',
            'Docker',
            'Kubernetes',
            'CI/CD',
            'Git',
        ],
    },
];

const RAIL = [
    {
        name: 'Security',
        skills: ['Authentication & authorization', 'HTTPS', 'bcrypt', 'Secure system design'],
    },
    {
        name: 'Practice',
        skills: [
            'Clean code',
            'Architecture & system design',
            'Agile/Scrum',
            'Requirements gathering',
            'Stakeholder communication',
            'SDLC',
        ],
    },
];

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
                                I&apos;m an Information Systems student at Brigham Young University
                                (Marriott School of Business), graduating in December 2026. I build
                                full-stack applications in TypeScript with Node.js, React, SQL, and
                                AWS.
                            </motion.p>
                            <motion.p
                                className="text-lg text-earth dark:text-gray-100/70 leading-relaxed mb-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                Most recently I was a Software Developer Intern at Trove Brands,
                                where I shipped a TypeScript Shopify application and grew automated
                                test coverage to 330 tests. Before that, I spent seven years at
                                Chick-fil-A managing IT systems and leading teams.
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
                                    href="/resume/Tanner_Atkinson_Resume.pdf"
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

            {/* Experience, Education & Service Timeline */}
            <section className="py-16 px-4 bg-white dark:bg-gray-800">
                <div className="max-w-4xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl font-display font-bold text-earth dark:text-gray-100 mb-10 text-center"
                    >
                        Experience & Education
                    </motion.h2>

                    <ol>
                        {TIMELINE.map((entry, index) => (
                            <motion.li
                                key={entry.title}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{ duration: 0.5 }}
                                className="grid grid-cols-[1.5rem_1fr] md:grid-cols-[13rem_1.5rem_1fr] gap-x-4 md:gap-x-6"
                            >
                                <div className="hidden md:block text-right pt-0.5">
                                    <p className="text-earth dark:text-gray-100/70 font-medium whitespace-nowrap">
                                        {entry.date}
                                    </p>
                                    <p className="text-xs font-semibold tracking-widest uppercase text-accent">
                                        {entry.kind}
                                    </p>
                                </div>

                                <div className="relative flex justify-center" aria-hidden="true">
                                    {index < TIMELINE.length - 1 && (
                                        <span className="absolute top-4 bottom-0 w-px bg-accent/30" />
                                    )}
                                    <span
                                        className={`relative mt-1.5 w-3.5 h-3.5 rounded-full ring-4 ring-white dark:ring-gray-800 ${
                                            entry.kind === 'Education'
                                                ? 'bg-white dark:bg-gray-800 border-2 border-accent'
                                                : 'bg-accent'
                                        }`}
                                    />
                                </div>

                                <div className="pb-8">
                                    <p className="md:hidden text-sm text-earth dark:text-gray-100/70 font-medium">
                                        {entry.date}
                                        <span className="text-accent"> / {entry.kind}</span>
                                    </p>
                                    <h3 className="text-xl font-bold text-earth dark:text-gray-100">
                                        {entry.title}
                                    </h3>
                                    <p className="text-sm text-earth dark:text-gray-100/70 mb-2">
                                        {entry.org}
                                        <span className="text-earth/40 dark:text-gray-100/40">
                                            {' '}
                                            / {entry.location}
                                        </span>
                                    </p>
                                    {entry.points.length > 0 && (
                                        <ul className="space-y-1 text-earth dark:text-gray-100/70">
                                            {entry.points.map((point) => (
                                                <li key={point} className="flex gap-3">
                                                    <span
                                                        className="mt-2.5 w-3 h-px bg-accent flex-shrink-0"
                                                        aria-hidden="true"
                                                    />
                                                    <span>{point}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </motion.li>
                        ))}
                    </ol>
                </div>
            </section>

            <AnimatedDivider color="#2E5266" />

            {/* Skills: stack diagram */}
            <section className="py-20 px-4 bg-cream dark:bg-gray-900">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-display font-bold text-earth dark:text-gray-100 mb-3">
                            Technical Skills
                        </h2>
                        <p className="text-earth dark:text-gray-100/70">
                            Organized by where they sit in a running application, from what people
                            see to where it runs.
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-[1fr_18rem] gap-10">
                        <div className="rounded-2xl overflow-hidden border border-accent/20">
                            {STACK.map((layer, index) => (
                                <motion.div
                                    key={layer.name}
                                    initial={{ opacity: 0, x: -24 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: '-30px' }}
                                    transition={{ duration: 0.5, delay: index * 0.08 }}
                                    className={`grid md:grid-cols-[11rem_1fr] gap-x-8 gap-y-2 px-6 py-6 ${layer.tint} ${
                                        index > 0 ? 'border-t border-accent/20' : ''
                                    }`}
                                >
                                    <div>
                                        <p className="text-xs font-semibold tracking-widest uppercase text-accent">
                                            Layer {index + 1}
                                        </p>
                                        <h3 className="text-xl font-bold text-earth dark:text-gray-100">
                                            {layer.name}
                                        </h3>
                                        <p className="text-sm text-earth/60 dark:text-gray-100/50">
                                            {layer.caption}
                                        </p>
                                    </div>
                                    <ul className="flex flex-wrap content-center gap-x-6 gap-y-1.5 text-lg font-medium text-earth dark:text-gray-100/90">
                                        {layer.skills.map((skill) =>
                                            skill === 'TypeScript' ? (
                                                <li
                                                    key={skill}
                                                    className="text-accent font-bold underline decoration-2 underline-offset-4"
                                                >
                                                    TypeScript
                                                    <span className="ml-2 text-xs font-semibold tracking-widest uppercase align-middle no-underline inline-block">
                                                        Primary
                                                    </span>
                                                </li>
                                            ) : (
                                                <li key={skill}>{skill}</li>
                                            ),
                                        )}
                                    </ul>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="lg:border-l-2 lg:border-dashed lg:border-accent/40 lg:pl-8 space-y-8"
                        >
                            <p className="text-xs font-semibold tracking-widest uppercase text-accent">
                                Across every layer
                            </p>
                            {RAIL.map((group) => (
                                <div key={group.name}>
                                    <h3 className="text-lg font-bold text-earth dark:text-gray-100 mb-2">
                                        {group.name}
                                    </h3>
                                    <ul className="space-y-1 text-earth dark:text-gray-100/70">
                                        {group.skills.map((skill) => (
                                            <li key={skill}>{skill}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </motion.div>
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
                                title: 'User-Centered Design',
                                description:
                                    'I build applications with real users in mind, prioritizing accessibility, usability, and intuitive interfaces that solve actual problems.',
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
                                title: 'Clean, Tested Code',
                                description:
                                    'I favor modular service/repository architecture, reusable components, and thorough automated tests, so code stays easy to extend and safe to release.',
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
                                title: 'Technical Ownership',
                                description:
                                    'I take responsibility for the full lifecycle: building the feature, tracing production issues to their root cause, and working with teammates through code review.',
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
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
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
                                    transition={{
                                        delay: index * 0.15 + 0.2,
                                        type: 'spring',
                                        stiffness: 150,
                                    }}
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

            {/* Beyond Code */}
            <section className="py-20 px-4 bg-cream dark:bg-gray-900">
                <div className="max-w-5xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl font-display font-bold text-earth dark:text-gray-100 mb-14 text-center"
                    >
                        Beyond Code
                    </motion.h2>

                    <div className="grid md:grid-cols-[1fr_2fr] md:divide-x divide-accent/30 gap-y-12">
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="md:pr-12 text-center"
                        >
                            <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-4">
                                Languages
                            </p>
                            <p className="text-4xl font-display font-bold text-earth dark:text-gray-100 mb-1">
                                Portuguese
                            </p>
                            <p className="text-earth dark:text-gray-100/70 mb-5">Fluent (C2)</p>
                            <p className="text-2xl font-display font-bold text-earth dark:text-gray-100 mb-1">
                                Spanish
                            </p>
                            <p className="text-earth dark:text-gray-100/70">
                                Limited working proficiency
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="md:pl-12 text-center"
                        >
                            <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-4">
                                Off the clock
                            </p>
                            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-4 text-xl font-display font-bold text-earth dark:text-gray-100">
                                {[
                                    'Competitive rock climbing',
                                    'Hiking',
                                    'State & national parks',
                                    'Cooking',
                                    'Going to the gym',
                                    'Trading cards',
                                ].map((interest) => (
                                    <li key={interest}>{interest}</li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            <AnimatedDivider color="#6B9080" />

            {/* CTA Section */}
            <section className="py-20 px-4 bg-gradient-to-br from-secondary-light via-primary-light to-earth-light dark:from-gray-700 dark:via-gray-900 dark:to-earth text-white transition-colors duration-300">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-display font-bold mb-6">
                            Let&apos;s Work Together
                        </h2>
                        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                            I&apos;m graduating in December 2026 and looking for full-time software
                            engineering roles where I can build reliable, well-tested products
                            alongside a strong team.
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
