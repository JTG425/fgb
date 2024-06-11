import { useState, useEffect } from "react";
import { BrowserRouter, Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../componentstyles/navbar.css";
import DropDown from "./dropdown";
import NavLogo from '../assets/navLogo.svg';

function NavBar(props) {
  const pages = props.pages;
  const handlePageChange = props.handlePageChange;
  const [page, setPage] = useState("Home");
  const [showDropdown, setShowDropdown] = useState(false);

  const buttonVariants = {
    Selected: {
      background: "#940303",
    },
    NotSelected: {
      background: "#fbfbfb",
    },
    hovered: {
      boxShadow: "0px 0px 10px 0px rgba(148, 3, 3, 0.75)",
    },
  };

  const textVariants = {
    selected: {
      color: "#fbfbfb",
      fontWeight: "700",
    },
    notselected: {
      color: "#292323",
      fontWeight: "400",
    },
    hovered: {
      fontWeight: "700",
    },
  };

  const handleShowDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleButtonClick = (pageName) => {
    handlePageChange(pageName);
    setPage(pageName);
  };

  return (
    <div className="nav-container">
      <div className="nav-content-container">
        <Link to="/">
          <motion.img
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            src={NavLogo}
            alt="nav-logo"
            className="nav-logo"
            onClick={() => handleButtonClick("Home")}
          />
        </Link>
        <DropDown />
        <div className="nav-buttons-container">
          <Link to = "/" >
            <motion.button
              whileHover="hovered"
              whileTap={{ scale: 0.9 }}
              className="nav-button"
              initial={page === "Home" ? "Selected" : "NotSelected"}
              animate={page === "Home" ? "Selected" : "NotSelected"}
              variants={buttonVariants}
              transition={{ duration: 0.25 }}
              onClick={() => handleButtonClick("Home")}
            >
              <motion.p
                initial={page === "Home" ? "selected" : "notselected"}
                whileHover="hovered"
                animate={page === "Home" ? "selected" : "notselected"}
                variants={textVariants}
                transition={{ duration: 0.3 }}
              >
                Home
              </motion.p>
            </motion.button>
          </Link>
          {["Tickets", "Locations", "Rentals", "About"].map((pageName) => (
            <Link to={`/${pageName.toLowerCase()}`} key={pageName}>
              <motion.button
                whileHover="hovered"
                whileTap={{ scale: 0.9 }}
                className="nav-button"
                initial={page === pageName ? "Selected" : "NotSelected"}
                animate={page === pageName ? "Selected" : "NotSelected"}
                variants={buttonVariants}
                transition={{ duration: 0.25 }}
                onClick={() => handleButtonClick(pageName)}
              >
                <motion.p
                  initial={page === pageName ? "selected" : "notselected"}
                  whileHover="hovered"
                  animate={page === pageName ? "selected" : "notselected"}
                  variants={textVariants}
                  transition={{ duration: 0.3 }}
                >
                  {pageName}
                </motion.p>
              </motion.button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NavBar;
