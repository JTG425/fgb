import "./App.css";
import "react-day-picker/dist/style.css";
import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { SocialIcon } from "react-social-icons";
import amplifyconfig from "./amplifyconfiguration.json";
import { Amplify } from "aws-amplify";
import NavBar from "./components/navbar";
import Home from "./pages/home";
import Tickets from "./pages/tickets";
import Locations from "./pages/locations";
import About from "./pages/about";
import Rentals from "./pages/rentals";
import Logo from "./components/logo";
import useSystemTheme from "./useSystemTheme";

Amplify.configure(amplifyconfig);

export const Context = React.createContext(null);

const cacheKey = "theaterCache";

const readCachedData = () => {
  try {
    return JSON.parse(localStorage.getItem(cacheKey)) || {};
  } catch (error) {
    console.warn("Ignoring unreadable theater cache", error);
    return {};
  }
};

const fetchData = async (cachedData = readCachedData()) => {
  try {
    const response = await fetch(import.meta.env.VITE_AWS_API_GATEWAY_URL);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const apiData = await response.json();
    const categories = ["Capitol", "Paramount", "Upcoming", "Slideshow"];
    const newData = {};
    categories.forEach((category) => {
      const apiEntry = apiData[category] && apiData[category][0];
      if (!apiEntry) return;
      if (cachedData[category] && cachedData[category].eTag === apiEntry.eTag) {
        newData[category] = cachedData[category].data;
      } else {
        newData[category] = apiEntry.data;
        cachedData[category] = {
          data: apiEntry.data,
          eTag: apiEntry.eTag,
        };
      }
    });
    try {
      localStorage.setItem(cacheKey, JSON.stringify(cachedData));
    } catch (error) {
      console.warn("Unable to update theater cache", error);
    }
    return {
      capShows: newData["Capitol"],
      parShows: newData["Paramount"],
      upcoming: newData["Upcoming"],
      slideshow: newData["Slideshow"],
      loading: false,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

function App() {
  const [capShows, setCapShows] = useState(null);
  const [parShows, setParShows] = useState(null);
  const [slideshow, setSlideshow] = useState(null);
  const [upcoming, setUpcoming] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scheduleError, setScheduleError] = useState(false);
  const theme = useSystemTheme();

  useEffect(() => {
    const cachedData = readCachedData();
    const hasCachedData = ["Capitol", "Paramount", "Upcoming", "Slideshow"].some(
      (category) => cachedData[category]?.data
    );
    const hasCachedSchedule = Boolean(
      cachedData["Capitol"]?.data || cachedData["Paramount"]?.data
    );

    if (hasCachedData) {
      setCapShows(cachedData["Capitol"]?.data || null);
      setParShows(cachedData["Paramount"]?.data || null);
      setUpcoming(cachedData["Upcoming"]?.data || null);
      setSlideshow(cachedData["Slideshow"]?.data || null);
      if (hasCachedSchedule) setLoading(false);
    }

    const loadData = async () => {
      const fetchedData = await fetchData(cachedData);
      if (fetchedData) {
        setCapShows(fetchedData.capShows);
        setParShows(fetchedData.parShows);
        setSlideshow(fetchedData.slideshow);
        setUpcoming(fetchedData.upcoming);
        setScheduleError(!(fetchedData.capShows || fetchedData.parShows));
      } else if (!hasCachedSchedule) {
        setScheduleError(true);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <Context.Provider value={{
      capShows: capShows,
      parShows: parShows,
      upcoming: upcoming,
      slideshow: slideshow,
      loading: loading,
      scheduleError: scheduleError,
      theme: theme,
    }}>
      <MotionConfig reducedMotion="user">
        <div className="App">
          <BrowserRouter>
            <a className="skip-link" href="#main-content">
              Skip to main content
            </a>
            <NavBar />
            <HomeLoading loading={loading} />
            <AnimatedRoutes />
            <SiteFooter />
          </BrowserRouter>
        </div>
      </MotionConfig>
    </Context.Provider>
  );
}

function HomeLoading({ loading }) {
  const { pathname } = useLocation();
  const isHome = pathname === "/" || pathname === "/home";

  return (
    <AnimatePresence>
      {loading && isHome && (
        <motion.div
          className="loading-container"
          role="status"
          aria-live="polite"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Logo />
          <p>Loading showtimes…</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const routeTitles = {
  "/": "FGB Theaters",
  "/home": "FGB Theaters",
  "/tickets": "Tickets & Pricing | FGB Theaters",
  "/locations": "Locations | FGB Theaters",
  "/rentals": "Theater Rentals | FGB Theaters",
  "/about": "About | FGB Theaters",
};

function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    document.title = routeTitles[location.pathname] || "FGB Theaters";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/home" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/tickets" element={<PageWrapper><Tickets /></PageWrapper>} />
        <Route
          path="/locations"
          element={<PageWrapper><Locations /></PageWrapper>}
        />
        <Route path="/rentals" element={<PageWrapper><Rentals /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function PageWrapper({ children }) {
  return (
    <motion.div
      className="route-shell"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SiteFooter() {
  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="footer-copy">
        <strong>FGB Theaters</strong>
        <p>© {new Date().getFullYear()} FGB Theaters · Montpelier & Barre, Vermont</p>
      </div>
      <div className="footer-socials" aria-label="FGB Theaters on social media">
        <SocialIcon
          bgColor="var(--primary)"
          fgColor="#fff"
          style={{ width: 40, height: 40 }}
          url="https://www.facebook.com/profile.php?id=61556431721748"
          target="_blank"
        />
        <SocialIcon
          bgColor="var(--primary)"
          fgColor="#fff"
          style={{ width: 40, height: 40 }}
          url="https://www.instagram.com/fgbtheaters/"
          target="_blank"
        />
      </div>
    </motion.footer>
  );
}

export default App;
