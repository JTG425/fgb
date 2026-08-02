import "../componentstyles/dropdown.css";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import { RxCross2, RxHamburgerMenu } from "react-icons/rx";
import { FiHome } from "react-icons/fi";
import { FaMapLocation, FaRegCircleQuestion, FaTicketSimple } from "react-icons/fa6";
import { RiMovie2Line } from "react-icons/ri";
import Logo from "./logo";

const mobileNavItems = [
  { route: "/", label: "Home", Icon: FiHome },
  { route: "/tickets", label: "Buy Tickets", Icon: FaTicketSimple },
  { route: "/locations", label: "Our Locations", Icon: FaMapLocation },
  { route: "/rentals", label: "Rentals", Icon: RiMovie2Line },
  { route: "/about", label: "About Us", Icon: FaRegCircleQuestion },
];

function DropDown() {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const headerRef = useRef(null);
  const menuButtonRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    const handlePointerDown = (event) => {
      if (!headerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  const isCurrentPath = (route) =>
    route === "/" ? pathname === "/" || pathname === "/home" : pathname === route;

  return (
    <header className="dropdown-top-bar" ref={headerRef}>
      <div className="dropdown-header">
        <Link
          to="/"
          className="mobile-nav-brand"
          aria-label="FGB Theaters home"
        >
          <Logo />
        </Link>
        <button
          type="button"
          className="show-dropdown-button"
          ref={menuButtonRef}
          onClick={() => setIsOpen((open) => !open)}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
        >
          {isOpen ? <RxCross2 aria-hidden="true" /> : <RxHamburgerMenu aria-hidden="true" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            id="mobile-navigation"
            className="dropdown-content"
            ref={menuRef}
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="mobile-menu-eyebrow">Explore FGB</span>
            {mobileNavItems.map(({ route, label, Icon }, index) => {
              const active = isCurrentPath(route);

              return (
                <motion.div
                  key={route}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.24, delay: index * 0.035 }}
                >
                  <Link
                    to={route}
                    className={`dropdown-button${active ? " active" : ""}`}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon className="dropdown-icon" aria-hidden="true" />
                    <span>{label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

export default DropDown;
