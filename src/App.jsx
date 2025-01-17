import "./App.css";
import "react-day-picker/dist/style.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SocialIcon } from "react-social-icons";
import amplifyconfig from "./amplifyconfiguration.json";
import { Amplify } from "aws-amplify";
import NavBar from "./components/navbar";
import Home from "./pages/home";
import Tickets from "./pages/tickets";
import Locations from "./pages/locations";
import About from "./pages/about";
import Rentals from "./pages/rentals";
import Admin from "./pages/admin";
import "./pagestyles/admin.css";
import { useContext } from "react";
import { getUrl } from 'aws-amplify/storage';
import { PulseLoader } from "react-spinners";




Amplify.configure(amplifyconfig);

export const Context = React.createContext(null);


const fetchFile = async (filepath) => {
  try {
    const signedUrl = await getUrl({
      path: filepath,
      options: {
        validateObjectExistence: false,
        expiresIn: 60,
        useAccelerateEndpoint: true
      },
    });
    const response = await fetch(signedUrl.url.href);
    const text = await response.text();
    return text;
  } catch (error) {
    console.error(`Error fetching ${path}:`, error);
    throw error;
  }
};

const fetchAllData = async () => {
  try {
    const [capShows, parShows, slideshow, upcoming, current] = await Promise.all([
      fetchFile("public/schedule/RTS_Schedule_Capitol.json"),
      fetchFile("public/schedule/RTS_Schedule_Paramount.json"),
      fetchFile("public/slideshow/slideshow.json"),
      fetchFile("public/schedule/Upcoming.json"),
      fetchFile("public/schedule/Current.json"),
    ]);

    return {
      capShows: JSON.parse(capShows),
      parShows: JSON.parse(parShows),
      slideshow: JSON.parse(slideshow),
      upcoming: JSON.parse(upcoming),
      current: JSON.parse(current),
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

  useEffect(() => {
    const loadData = async () => {
      const fetchedData = await fetchAllData();
      setCapShows(fetchedData.capShows);
      setParShows(fetchedData.parShows);
      setSlideshow(fetchedData.slideshow);
      setUpcoming(fetchedData.upcoming);
      setCurrent(fetchedData.current);
      setLoading(false);
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
              <PulseLoader color={"#940303"} size={20} />
            </motion.div>
          )}
          </AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
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
          </motion.div>
          <AnimatePresence mode="sync">
          {!loading && (
            <motion.div 
              className="footer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              >
              <span className="footer-socials">
                <SocialIcon
                  key="facebook-icon"
                  bgColor="#f1efef"
                  fgColor="#292323"
                  url="https://www.facebook.com/profile.php?id=61556431721748"
                  target="_blank"
                />
                <SocialIcon
                  key="insta-icon"
                  bgColor="#f1efef"
                  fgColor="#292323"
                  url="https://www.instagram.com/fgbtheaters/"
                  target="_blank"
                />
              </span>
              <p>
                <sup>©</sup>Copyright 2024 FGB Theaters
              </p>
            </motion.div>
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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default App;
