import { motion } from 'framer-motion';
import type { FC } from 'react';
import { memo, useState, useEffect } from 'react';

interface AnimatedDividerProps {
    color?: string;
    height?: string;
}

const AnimatedDivider: FC<AnimatedDividerProps> = memo(({ color = '#6B9080', height = '2px' }) => {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);
        const handleChange = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // A single observer on the container drives all three pieces. Observing the
    // lines themselves is unreliable: at scaleX(0) the right line collapses to a
    // zero-width sliver at the viewport edge and may never be seen as "in view".
    const lineVariants = {
        hidden: { scaleX: 0 },
        visible: { scaleX: 1, transition: { duration: 0.7, ease: 'easeOut' as const } },
    };
    const dotVariants = {
        hidden: { scale: 0 },
        visible: { scale: 1, transition: { duration: 0.7, ease: 'easeOut' as const, delay: 0.3 } },
    };

    return (
        <motion.div
            className="w-full flex items-center gap-4 my-12"
            {...(prefersReducedMotion
                ? {}
                : {
                      initial: 'hidden',
                      whileInView: 'visible',
                      viewport: { once: true, margin: '50px' },
                  })}
        >
            <motion.div
                variants={lineVariants}
                style={{
                    height,
                    backgroundColor: color,
                    transformOrigin: 'left',
                }}
                className="flex-1"
            />
            <motion.div
                variants={dotVariants}
                style={{ backgroundColor: color }}
                className="w-3 h-3 rounded-full"
            />
            <motion.div
                variants={lineVariants}
                style={{
                    height,
                    backgroundColor: color,
                    transformOrigin: 'right',
                }}
                className="flex-1"
            />
        </motion.div>
    );
});

AnimatedDivider.displayName = 'AnimatedDivider';

export default AnimatedDivider;
