import {
  AnimatePresence,
  m,
  useReducedMotion,
  type Variants,
} from 'framer-motion';

export const motion = m;
export { AnimatePresence, useReducedMotion };

export const MOTION_VIEWPORT = {
  once: true,
  amount: 0.2,
  margin: '0px 0px -10% 0px',
} as const;

export const FADE_UP_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export const SECTION_STAGGER_VARIANTS: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.04,
    },
  },
};
