"use client";

import { motion } from "framer-motion";

// Replaces the Vite app's PageWrapper: template.jsx remounts on every
// navigation, giving each page the same fade-in transition.
export default function Template({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}
