// ============================================
// ANIMATION UTILITIES & VARIANTS
// Premium, smooth, modern animations
// ============================================

// Easing functions for smooth, premium feel
export const easings = {
  smooth: [0.43, 0.13, 0.23, 0.96],
  spring: { type: "spring", stiffness: 300, damping: 30 },
  springBouncy: { type: "spring", stiffness: 400, damping: 25 },
  springGentle: { type: "spring", stiffness: 200, damping: 35 },
  easeOut: [0.16, 1, 0.3, 1],
  easeInOut: [0.87, 0, 0.13, 1],
};

// Page transition variants
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: easings.smooth,
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: easings.smooth,
    },
  },
};

// Fade in variants
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.4, ease: easings.smooth }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.3, ease: easings.smooth }
  },
};

// Slide up variants
export const slideUp = {
  initial: { opacity: 0, y: 30 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: easings.smooth }
  },
};

// Slide down variants
export const slideDown = {
  initial: { opacity: 0, y: -30 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: easings.smooth }
  },
};

// Scale variants
export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: easings.smooth }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: 0.3, ease: easings.smooth }
  },
};

// Card hover animation
export const cardHover = {
  rest: { 
    scale: 1, 
    y: 0,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  },
  hover: { 
    scale: 1.02,
    y: -8,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: { duration: 0.3, ease: easings.smooth }
  },
  tap: { 
    scale: 0.98,
    transition: { duration: 0.1 }
  },
};

// Button variants
export const buttonVariants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: { duration: 0.2, ease: easings.smooth }
  },
  tap: { 
    scale: 0.95,
    transition: { duration: 0.1 }
  },
};

// Stagger container
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Stagger item
export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: easings.smooth }
  },
};

// Modal variants
export const modalVariants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: easings.smooth }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2, ease: easings.smooth }
  },
};

// Backdrop variants
export const backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

