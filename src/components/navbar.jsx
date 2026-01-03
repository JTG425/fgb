import { useState } from "react";
import {Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../componentstyles/navbar.css";
import DropDown from "./dropdown";
import Logo from "./logo";
import { Context } from "../App";
import { useContext } from "react";

const buttonVariants = {
  Selected: {
    background: "var(--primary)",
    color: "#fbfbfb",
    outline: "none"
  },
  NotSelected: {
    background: "var(--foreground-glass)",
    color: "var(--copy)",
    outline: "none"
  },
  hovered: {
    background: "var(--primary)",
    scale: 1.05,

  }
};

function NavBar() {
  const {currentPage, setCurrentPage} = useContext(Context);

  const handleButtonClick = (pageName) => {
    setCurrentPage(pageName);
  };

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
        <Link to="/">
          <Logo />
        </Link>
        <div className="nav-buttons-container">
          <Link to="/">
            <motion.button
              key="nav-home-button"
              whileTap={{ scale: 0.98 }}
              className="nav-button"
              initial={currentPage === "Home" ? "Selected" : "NotSelected"}
              animate={currentPage === "Home" ? "Selected" : "NotSelected"}
              variants={buttonVariants}
              whileHover="hovered"
              transition={{ duration: 0.25 }}
              onClick={() => handleButtonClick("Home")}
            >
              Home
            </motion.button>
          </Link>
          {["Tickets", "Locations", "Rentals", "About"].map((pageName) => (
            <Link to={`/${pageName.toLowerCase()}`} key={pageName}>
              <motion.button
                key={`nav-${pageName}-button`}
                whileTap={{ scale: 0.98 }}
                className="nav-button"
                initial={currentPage === pageName ? "Selected" : "NotSelected"}
                animate={currentPage === pageName ? "Selected" : "NotSelected"}
                variants={buttonVariants}
                whileHover="hovered"
                transition={{ duration: 0.25 }}
                onClick={() => handleButtonClick(pageName)}
              >
                {pageName}
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
