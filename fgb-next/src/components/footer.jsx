"use client";

import { motion, AnimatePresence } from "framer-motion";
import { SocialIcon } from "react-social-icons";
import { useSite } from "@/context/SiteProvider";

export default function Footer() {
  const { loading } = useSite();

  return (
    <AnimatePresence mode="sync">
      {!loading && (
        <motion.div
          className="footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <span className="footer-socials">
            <SocialIcon
              key="facebook-icon"
              bgColor="var(--foreground)"
              fgColor="var(--primary)"
              url="https://www.facebook.com/profile.php?id=61556431721748"
              target="_blank"
            />
            <SocialIcon
              key="insta-icon"
              bgColor="var(--foreground)"
              fgColor="var(--primary)"
              url="https://www.instagram.com/fgbtheaters/"
              target="_blank"
            />
          </span>
          <p>
            <sup>©</sup>Copyright {new Date().getFullYear()} FGB Theaters
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
