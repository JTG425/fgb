import "../componentstyles/dropdown.css";
import NavLogo from "../assets/navLogo.svg";
import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { FiHome } from "react-icons/fi";
import { FaTicketSimple } from "react-icons/fa6";
import { FaMapLocation } from "react-icons/fa6";
import { FaRegCircleQuestion } from "react-icons/fa6";
import { RiMovie2Line } from "react-icons/ri";
import { useContext } from "react";
import { Context } from "../App";


function DropDown() {
  const props = useContext(Context);
  const currentPage = props.currentPage;
  const setCurrentPage = props.setCurrentPage;

  const [showDropdown, setShowDropdown] = useState(false);



  const toggleDropdown = (page) => {
    setShowDropdown(!showDropdown);
    setCurrentPage(page)
  }

  const handleIconClick = (page) => {
    setCurrentPage(page);
  }

  const dropdownVariants = {
    hidden: {
      opacity: 1,
      y: -700,
      transition: {
        duration: 0.5,
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };


  return (
    <>
      <motion.div 
        key="dropdown-top-bar-key"
        className="dropdown-top-bar"
        initial={{y: -125}}

      >
        <Link to="/">
          <motion.img
            key="nav-home-logo"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            src={NavLogo}
            alt="nav-logo"
            className="mobile-logo"
            onClick={() => handleIconClick("Home")}
          />
        </Link>
        <motion.button
          key="dropdown-toggle-key"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="show-dropdown-button"
          onClick={() => toggleDropdown()}
        >
          <RxHamburgerMenu />
        </motion.button>
      </motion.div>
      <motion.div
        key="dropdown-key"
        className="dropdown"
        initial="hidden"
        animate={showDropdown ? "visible" : "hidden"}
        variants={dropdownVariants}
      >
        <Link to="/">
          <button className="dropdown-button" onClick={() => toggleDropdown("Home")}>
            <FiHome className="icon" />
            <p>Home</p>
          </button>
        </Link>
        <Link to="/tickets">
          <button className="dropdown-button" onClick={() => toggleDropdown("Tickets")}>
            <FaTicketSimple className="icon" />
            <p>Buy Tickets</p>
          </button>
        </Link>

        <Link to="/locations">
          <button className="dropdown-button" onClick={() => toggleDropdown("Locations")}>
            <FaMapLocation className="icon" />
            <p>Our Locations</p>
          </button>
        </Link>

        <Link to="/rentals">
          <button className="dropdown-button" onClick={() => toggleDropdown("Rentals")}>
            <RiMovie2Line className="icon" />
            <p>Rentals</p>
          </button>
        </Link>

        <Link to="/about">
          <button className="dropdown-button" onClick={() => toggleDropdown("About")}>
            <FaRegCircleQuestion className="icon" />
            <p>About Us</p>
          </button>
        </Link>
      </motion.div>
    </>
  );
}

export default DropDown;
