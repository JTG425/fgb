import { useState } from "react";
import {Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../componentstyles/navbar.css";
import DropDown from "./dropdown";
import NavLogo from "../assets/navLogo.svg";

function NavBar(props) {
  const pages = props.pages;
  const handlePageChange = props.handlePageChange;
  const [page, setPage] = useState("Home");
  const [showDropdown, setShowDropdown] = useState(false);

  const buttonVariants = {
    Selected: {
      background: "#940303",
      color: "#fbfbfb",
      fontWeight: "700",
    },
    NotSelected: {
      background: "#fbfbfb",
      fontWeight: "400",
      color: "#292323",
    },
    hovered: {
      boxShadow: "0px 0px 10px 0px rgba(148, 3, 3, 0.75)",
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
          <Link to="/">
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
              Home
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
                {pageName}
              </motion.button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NavBar;
