"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Logo from "./logo";
import { useSite } from "@/context/SiteProvider";

export default function LoadingOverlay() {
  const { loading } = useSite();
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {loading && pathname === "/" && (
        <motion.div
          className="loading-container"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Logo />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
