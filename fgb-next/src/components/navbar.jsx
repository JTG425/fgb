"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import "@/styles/componentstyles/navbar.css";
import DropDown from "./dropdown";
import Logo from "./logo";

const buttonVariants = {
  Selected: {
    background: "var(--primary)",
    color: "#fbfbfb",
    outline: "none",
  },
  NotSelected: {
    background: "var(--foreground-glass)",
    color: "var(--copy)",
    outline: "none",
  },
  hovered: {
    background: "var(--primary)",
    scale: 1.05,
  },
};

export const NAV_PAGES = [
  { name: "Home", path: "/" },
  { name: "Tickets", path: "/tickets" },
  { name: "Locations", path: "/locations" },
  { name: "Rentals", path: "/rentals" },
  { name: "About", path: "/about" },
];

// Deriving the active page from the URL (instead of component state)
// keeps the highlight correct on back/forward navigation and deep links.
export const usePageName = () => {
  const pathname = usePathname();
  const match = NAV_PAGES.find(
    (page) => page.path !== "/" && pathname.startsWith(page.path)
  );
  return match ? match.name : "Home";
};

function NavBar() {
  const currentPage = usePageName();

  return (
    <>
      <DropDown />
      <motion.div
        key="nav-container-key"
        className="nav-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="nav-content-container">
          <Link href="/">
            <Logo />
          </Link>
          <div className="nav-buttons-container">
            {NAV_PAGES.map(({ name, path }) => (
              <Link href={path} key={name}>
                <motion.button
                  key={`nav-${name}-button`}
                  whileTap={{ scale: 0.98 }}
                  className="nav-button"
                  initial={currentPage === name ? "Selected" : "NotSelected"}
                  animate={currentPage === name ? "Selected" : "NotSelected"}
                  variants={buttonVariants}
                  whileHover="hovered"
                  transition={{ duration: 0.25 }}
                >
                  {name}
                </motion.button>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default NavBar;
