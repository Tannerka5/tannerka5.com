import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState, type FC, useCallback, memo } from "react";

const BackToTop: FC = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsVisible(latest > 300);
  });

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <motion.button
      initial={false}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        scale: isVisible ? 1 : 0 
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={scrollToTop}
      className="fixed top-24 right-8 z-50 p-4 bg-accent text-white rounded-full shadow-lg dark:shadow-accent/20 hover:bg-accent-dark transition-colors"
      aria-label="Back to top"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </motion.button>
  );
});

BackToTop.displayName = 'BackToTop';

export default BackToTop;
