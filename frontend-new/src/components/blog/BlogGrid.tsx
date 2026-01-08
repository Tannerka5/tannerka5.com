import { motion } from "framer-motion";
import type { FC } from "react";
import { memo, useState, useEffect } from "react";
import BlogCard from "./BlogCard";
import AnimatedDivider from "../AnimatedDivider";
import type { BlogPost } from "../../../data/blog-posts";

interface BlogGridProps {
  posts: BlogPost[];
}

const BlogGrid: FC<BlogGridProps> = memo(({ posts }) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  /* const allTags = Array.from(new Set(posts.flatMap(post => post.tags))); */

  return (
    <main className="bg-cream dark:bg-gray-900 dark:bg-gray-900 dark:bg-dark-bg min-h-screen transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 dark:from-primary/10 dark:via-accent/10 dark:to-secondary/10">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            {...(prefersReducedMotion ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } })}
            className="text-5xl md:text-6xl font-display font-bold text-earth dark:text-gray-100 dark:text-gray-100 dark:text-dark-text mb-6"
          >
            Blog & Articles
          </motion.h1>
          <motion.p
            {...(prefersReducedMotion ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.1 } })}
            className="text-xl text-earth dark:text-gray-100 dark:text-gray-100/70 dark:text-dark-text-secondary max-w-3xl mx-auto"
          >
            Technical insights, project deep-dives, and lessons learned from building web applications.
          </motion.p>
        </div>
      </section>

      <AnimatedDivider color="#6B9080" />

      {/* Blog Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {posts.length === 0 ? (
            <motion.div
              {...(prefersReducedMotion ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } })}
              className="text-center py-20"
            >
              <p className="text-xl text-earth dark:text-gray-100 dark:text-gray-100/70 dark:text-dark-text-secondary">
                Blog posts coming soon! Check back later for technical articles and project insights.
              </p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <BlogCard
                  key={post.slug}
                  post={post}
                  delay={0.1 + index * 0.1}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
});

BlogGrid.displayName = 'BlogGrid';

export default BlogGrid;
