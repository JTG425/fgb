import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTicketSimple } from "react-icons/fa6";
import "../componentstyles/navbar.css";
import DropDown from "./dropdown";
import Logo from "./logo";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Buy Tickets", path: "/tickets", featured: true },
  { label: "Locations", path: "/locations" },
  { label: "Rentals", path: "/rentals" },
  { label: "About", path: "/about" },
];

function NavBar() {
  const { pathname } = useLocation();

  const isCurrentPath = (path) =>
    path === "/" ? pathname === "/" || pathname === "/home" : pathname === path;

  return (
    <>
      <DropDown />
      <motion.header
        className="nav-container"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav className="nav-content-container" aria-label="Primary navigation">
          <Link
            to="/"
            className="nav-brand"
            aria-label="FGB Theaters home"
          >
            <Logo />
          </Link>

          <div className="nav-buttons-container">
            {navItems.map(({ label, path, featured }) => {
              const active = isCurrentPath(path);

              return (
                <motion.div key={path} whileTap={{ scale: 0.97 }}>
                  <Link
                    to={path}
                    className={`nav-button${active ? " active" : ""}${featured ? " featured" : ""}`}
                    aria-current={active ? "page" : undefined}
                  >
                    {featured && <FaTicketSimple aria-hidden="true" />}
                    <span>{label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </nav>
      </motion.header>
    </>
  );
}

export default NavBar;
