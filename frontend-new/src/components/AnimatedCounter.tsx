import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, type FC, memo } from "react";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface AnimatedCounterProps {
  from?: number;
  to: number;
  duration?: number;
  suffix?: string;
}

const AnimatedCounter: FC<AnimatedCounterProps> = memo(({ 
  from = 0, 
  to, 
  duration = 2,
  suffix = ""
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, to, { duration, ease: "easeOut" });
      return controls.stop;
    }
  }, [isInView, count, to, duration]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
});

AnimatedCounter.displayName = 'AnimatedCounter';

export default AnimatedCounter;
