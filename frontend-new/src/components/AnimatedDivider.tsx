import { motion } from "framer-motion";
import type { FC } from "react";
import { memo, useState, useEffect } from "react";

interface AnimatedDividerProps {
  color?: string;
  height?: string;
}

const AnimatedDivider: FC<AnimatedDividerProps> = memo(({ 
  color = "#6B9080",
  height = "2px"
}) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className="w-full flex items-center gap-4 my-12">
      <motion.div
        {...(prefersReducedMotion ? {} : {
          initial: { scaleX: 0 },
          whileInView: { scaleX: 1 },
          viewport: { once: true, margin: "50px" },
          transition: { duration: 0.7, ease: "easeOut" }
        })}
        style={{ 
          height,
          backgroundColor: color,
          transformOrigin: "left"
        }}
        className="flex-1"
      />
      <motion.div
        {...(prefersReducedMotion ? {} : {
          initial: { scale: 0 },
          whileInView: { scale: 1 },
          viewport: { once: true, margin: "50px" },
          transition: { duration: 0.7, ease: "easeOut", delay: 0.3 }
        })}
        style={{ backgroundColor: color }}
        className="w-3 h-3 rounded-full"
      />
      <motion.div
        {...(prefersReducedMotion ? {} : {
          initial: { scaleX: 0 },
          whileInView: { scaleX: 1 },
          viewport: { once: true, margin: "50px" },
          transition: { duration: 0.7, ease: "easeOut" }
        })}
        style={{ 
          height,
          backgroundColor: color,
          transformOrigin: "right"
        }}
        className="flex-1"
      />
    </div>
  );
});

AnimatedDivider.displayName = 'AnimatedDivider';

export default AnimatedDivider;
