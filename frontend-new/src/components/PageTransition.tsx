import { motion } from "framer-motion";
import type { FC, ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition: FC<PageTransitionProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
