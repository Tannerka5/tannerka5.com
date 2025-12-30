import { motion } from "framer-motion";
import type { FC } from "react";

interface AnimatedDividerProps {
  color?: string;
  height?: string;
}

const AnimatedDivider: FC<AnimatedDividerProps> = ({ 
  color = "#6B9080",
  height = "2px"
}) => {
  return (
    <div className="w-full flex items-center gap-4 my-12">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        style={{ 
          height,
          backgroundColor: color,
          transformOrigin: "left"
        }}
        className="flex-1"
      />
      <motion.div
        initial={{ scale: 0, rotate: 0 }}
        whileInView={{ scale: 1, rotate: 360 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        style={{ backgroundColor: color }}
        className="w-3 h-3 rounded-full"
      />
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        style={{ 
          height,
          backgroundColor: color,
          transformOrigin: "right"
        }}
        className="flex-1"
      />
    </div>
  );
};

export default AnimatedDivider;
