import "./App.css";
import "react-day-picker/dist/style.css";
import React, { useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SocialIcon } from "react-social-icons";
import amplifyconfig from "./amplifyconfiguration.json";
import { Amplify } from "aws-amplify";
import NavBar from "./components/navbar";
import { PulseLoader } from "react-spinners";
import Logo from "./components/logo";
import useSystemTheme from "./useSystemTheme";

// Lazy load pages for better code splitting
const Home = lazy(() => import("./pages/home"));
const Tickets = lazy(() => import("./pages/tickets"));
const Locations = lazy(() => import("./pages/locations"));
const About = lazy(() => import("./pages/about"));
const Rentals = lazy(() => import("./pages/rentals"));
const Admin = lazy(() => import("./pages/admin"));





Amplify.configure(amplifyconfig);

export const Context = React.createContext(null);


const fetchData = async () => {
  try {
    const cacheKey = 'theaterCache';
    const cachedData = JSON.parse(localStorage.getItem(cacheKey)) || {};
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
    localStorage.setItem(cacheKey, JSON.stringify(cachedData));
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
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useSystemTheme();

  useEffect(() => {
    const cacheKey = 'theaterCache';
    const cachedRaw = localStorage.getItem(cacheKey);
    if (cachedRaw) {
      const cachedData = JSON.parse(cachedRaw);
      if (cachedData["Capitol"]) {
        setCapShows(cachedData["Capitol"].data);
      }
      if (cachedData["Paramount"]) {
        setParShows(cachedData["Paramount"].data);
      }
      if (cachedData["Upcoming"]) {
        setUpcoming(cachedData["Upcoming"].data);
      }
      if (cachedData["Slideshow"]) {
        setSlideshow(cachedData["Slideshow"].data);
      }
      setLoading(false);
    }
    
    const loadData = async () => {
      const fetchedData = await fetchData();
      if (fetchedData) {
        setCapShows(fetchedData.capShows);
        setParShows(fetchedData.parShows);
        setSlideshow(fetchedData.slideshow);
        setUpcoming(fetchedData.upcoming);
        setCurrent(fetchedData.current);
        setLoading(false);
      }
    };
    loadData();
  }, []);
  


  /* Determine the Subdomain and setCurrentPage to that (For Navbar Appearance) */
  const location = window.location.pathname;
  var page = 'Home';
  switch (location) {
    case "/":
      page = "Home";
      break;
    case "/tickets":
      page = "Tickets";
      break;
    case "/locations":
      page = "Locations";
      break;
    case "/about":
      page = "About";
      break;
    case "/rentals":
      page = "Rentals";
      break;
    default:
      page = "Home";
      break;
  }

  const [currentPage, setCurrentPage] = useState(page);

  const pages = [
    {
      name: "Home",
      path: "/",
      component: Home,
    },
    {
      name: "Buy Tickets",
      path: "/tickets",
      component: Tickets,
    },
    {
      name: "Locations",
      path: "/locations",
      component: Locations,
    },
    {
      name: "About",
      path: "/about",
      component: About,
    },
  ];

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <Context.Provider value={{
      capShows: capShows,
      parShows: parShows,
      current: current,
      upcoming: upcoming,
      slideshow: slideshow,
      loading: loading,
      pages: pages,
      currentPage: currentPage,
      theme: theme,
      setCurrentPage: handlePageChange
    }}>
      <div className="App">
        <BrowserRouter>
          <NavBar />
          <AnimatePresence>
          {(loading && currentPage=="Home" ) && (
            <motion.div
              className="loading-container"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Logo />
              {/* <PulseLoader color={"#940303"} size={20} /> */}
            </motion.div>
          )}
          </AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Suspense fallback={
              <div className="loading-container">
                <Logo />
              </div>
            }>
              <Routes location={location} key={location.pathname}>
                <Route
                  key="home"
                  path="/"
                  element={
                    <PageWrapper keyString="PW-home-key">
                      <Home />
                    </PageWrapper>
                  }
                />
                <Route
                  key="home"
                  path="/home"
                  element={
                    <PageWrapper keyString="PW-home-key">
                      <Home />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/tickets"
                  element={
                    <PageWrapper keyString="PW-tickets-key">
                      <Tickets />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/locations"
                  element={
                    <PageWrapper keyString="PW-locations-key">
                      <Locations key={import.meta.env.GOOGLE_MAPS_API_KEY} />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/rentals"
                  element={
                    <PageWrapper keyString="PW-rentals-key">
                      <Rentals />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/about"
                  element={
                    <PageWrapper keyString="PW-about-key">
                      <About />
                    </PageWrapper>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </motion.div>
          <AnimatePresence mode="sync">
          {!loading && (
            <>
            <motion.div 
              className="footer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              >
                
              <span className="footer-socials">
                <SocialIcon
                  key="facebook-icon"
                  bgColor="var(--foreground)"
                  fgColor="var(--primary)"
                  url="https://www.facebook.com/profile.php?id=61556431721748"
                  target="_blank"
                />
                <SocialIcon
                  key="insta-icon"
                  bgColor="var(--foreground)"
                  fgColor="var(--primary)"
                  url="https://www.instagram.com/fgbtheaters/"
                  target="_blank"
                />
              </span>
              <p>
                <sup>©</sup>Copyright 2024 FGB Theaters
              </p>
            </motion.div>
            </>
          )}
          </AnimatePresence>
        </BrowserRouter>
      </div>
    </Context.Provider>
  );
}

function PageWrapper({ children, keyString }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={keyString}
        initial={{ opacity: 0}}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default App;
