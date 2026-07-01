"use client";

import "@/styles/componentstyles/dropdown.css";
import Logo from "./logo";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { RxHamburgerMenu } from "react-icons/rx";
import { FiHome } from "react-icons/fi";
import { FaTicketSimple, FaMapLocation, FaRegCircleQuestion } from "react-icons/fa6";
import { RiMovie2Line } from "react-icons/ri";

const dropdownVariants = {
  hidden: { opacity: 1, height: "75px" },
  visible: { opacity: 1, height: "500px" },
};

const buttons = [
  {
    key: "dropdown-button-key-home",
    route: "/",
    label: "Home",
    Icon: FiHome,
    enterDelay: 0,
    exitDelay: 0.4,
  },
  {
    key: "dropdown-button-key-tickets",
    route: "/tickets",
    label: "Buy Tickets",
    Icon: FaTicketSimple,
    enterDelay: 0.1,
    exitDelay: 0.3,
  },
  {
    key: "dropdown-button-key-locations",
    route: "/locations",
    label: "Our Locations",
    Icon: FaMapLocation,
    enterDelay: 0.2,
    exitDelay: 0.2,
  },
  {
    key: "dropdown-button-key-rentals",
    route: "/rentals",
    label: "Rentals",
    Icon: RiMovie2Line,
    enterDelay: 0.3,
    exitDelay: 0.1,
  },
  {
    key: "dropdown-button-key-about",
    route: "/about",
    label: "About Us",
    Icon: FaRegCircleQuestion,
    enterDelay: 0.4,
    exitDelay: 0,
  },
];

function DropDown() {
  const [isContainerOpen, setIsContainerOpen] = useState(false);
  const [areChildrenVisible, setAreChildrenVisible] = useState(false);

  const toggleDropdown = () => {
    if (!isContainerOpen) {
      setIsContainerOpen(true);
      setTimeout(() => {
        setAreChildrenVisible(true);
      }, 250);
    } else {
      setAreChildrenVisible(false);
    }
  };

  return (
    <motion.div
      className="dropdown-top-bar"
      initial="hidden"
      animate={isContainerOpen ? "visible" : "hidden"}
      variants={dropdownVariants}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      <span className="dropdown-header">
        <Link href="/">
          <Logo />
        </Link>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="show-dropdown-button"
          onClick={toggleDropdown}
          aria-label="Toggle navigation menu"
        >
          <RxHamburgerMenu />
        </motion.button>
      </span>
      <motion.div className="dropdown-content">
        <AnimatePresence
          mode="popLayout"
          onExitComplete={() => setIsContainerOpen(false)}
        >
          {areChildrenVisible &&
            buttons.map(({ key, route, label, Icon, enterDelay, exitDelay }) => (
              <motion.span
                key={key}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{
                  opacity: 0,
                  x: 10,
                  transition: { duration: 0.25, delay: exitDelay },
                }}
                transition={{ duration: 0.25, delay: enterDelay }}
              >
                <Link href={route}>
                  <button className="dropdown-button" onClick={toggleDropdown}>
                    <Icon className="icon" />
                    <p>{label}</p>
                  </button>
                </Link>
              </motion.span>
            ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default DropDown;
