import "../componentstyles/navbar.css";

import {useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import anime from "animejs/lib/anime.es.js";
import { RxHamburgerMenu } from "react-icons/rx";
import { FiHome } from "react-icons/fi";
import { FaTicketSimple } from "react-icons/fa6";
import { FaMapLocation } from "react-icons/fa6";
import { FaRegCircleQuestion } from "react-icons/fa6";
import { RiMovie2Line } from "react-icons/ri";


function DropDown(props) {
  const [showDropdown, setShowDropdown] = useState(true);

  const toggleDropdown = () => {
switch (showDropdown) {
      case true:
        anime({
          targets: ".dropdown",
          translateY: [300, 855],
          opacity: [0, 1],
          easing: "easeOutExpo",
          duration: 900,
          delay: anime.stagger(100),
          loop: false,
        });

        anime({
          targets: ".dropdown-button",
          translateY: [-100, 0],
          opacity: [0, 1],
          easing: "easeOutExpo",
          duration: 900,
          delay: anime.stagger(100, { from: "last" }),
          loop: false,
        });

        break;
      case false:
        anime({
          targets: ".dropdown",
          translateY: [855, 300],
          opacity: [1, 0],
          easing: "easeOutExpo",
          delay: 200,
          duration: 900,
          loop: false,
        });

        anime({
          targets: ".dropdown-button",
          translateY: [0, -100],
          easing: "easeOutExpo",
          duration: 900,
          delay: anime.stagger(100, { from: "first" }),
          loop: false,
        });

        anime({
          targets: ".dropdown-button",
          opacity: [1, 0],
          easing: "easeOutExpo",
          duration: 300,
          loop: false,
        });

        break;
    }
    setShowDropdown(!showDropdown);
  };

  // useEffect(() => {
  //   toggleDropdown();
  // }, []);

  return (
    <>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="show-dropdown-button"
          onClick={() => toggleDropdown()}
        >
          <RxHamburgerMenu />
        </motion.button>
        <div className="dropdown">
          <Link to="/">
            <button className="dropdown-button" onClick={() => toggleDropdown()}>
              <FiHome className="icon" />
              <p>Home</p>
            </button>
          </Link>
          <Link to="/tickets">
            <button className="dropdown-button" onClick={() => toggleDropdown()}>
              <FaTicketSimple className="icon" />
              <p>Buy Tickets</p>
            </button>
          </Link>

          <Link to="/locations">
            <button className="dropdown-button" onClick={() => toggleDropdown()}>
              <FaMapLocation className="icon" />
              <p>Our Locations</p>
            </button>
          </Link>

          <Link to="/rentals">
            <button className="dropdown-button" onClick={() => toggleDropdown()}>
              <RiMovie2Line className="icon" />
              <p>Rentals</p>
            </button>
          </Link>

          <Link to="/about">
            <button className="dropdown-button" onClick={() => toggleDropdown()}>
              <FaRegCircleQuestion className="icon" />
              <p>About Us</p>
            </button>
          </Link>
              </div>
    </>
  );
}

export default DropDown;
