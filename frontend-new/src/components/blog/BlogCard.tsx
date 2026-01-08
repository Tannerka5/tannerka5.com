import { motion } from "framer-motion";
import type { FC } from "react";
import { useMemo, memo } from "react";
import type { BlogPost } from "../../../data/blog-posts";

interface BlogCardProps {
  post: BlogPost;
  delay?: number;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const BlogCard: FC<BlogCardProps> = memo(({ post, delay = 0 }) => {
  const formattedDate = useMemo(() => formatDate(post.date), [post.date]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "50px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group"
    >
      <a
        href={`/blog/${post.slug}`}
        className="block bg-white dark:bg-gray-800 dark:bg-gray-800 dark:bg-dark-card rounded-xl shadow-md dark:shadow-gray-900 overflow-hidden transition-all duration-300 hover:shadow-2xl dark:hover:shadow-accent/20 h-full flex flex-col"
      >
        {/* Cover Image */}
        {post.coverImage && (
          <div className="h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
              width="400"
              height="192"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 bg-sage/10 dark:bg-sage/20 dark:bg-sage/20 text-sage-dark dark:text-sage-light rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <h3 className="text-xl font-bold text-earth dark:text-gray-100 dark:text-gray-100 dark:text-dark-text mb-2 group-hover:text-primary dark:group-hover:text-accent transition-colors">
            {post.title}
          </h3>
          
          <p className="text-earth dark:text-gray-100 dark:text-gray-100/70 dark:text-dark-text-secondary text-sm mb-4 flex-1 line-clamp-3">
            {post.excerpt}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between text-xs text-earth dark:text-gray-100 dark:text-gray-100/50 dark:text-dark-text-secondary pt-4 border-t dark:border-gray-700 dark:border-dark-border">
            <span>{formattedDate}</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </a>
    </motion.div>
  );
});

BlogCard.displayName = 'BlogCard';

export default BlogCard;
