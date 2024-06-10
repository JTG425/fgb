import "./App.css";
import "react-day-picker/dist/style.css";
import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SocialIcon } from 'react-social-icons';
import loading from "./assets/loading.svg";
import NavBar from "./components/navbar";
import Home from "./pages/home";
import Tickets from "./pages/tickets";
import Locations from "./pages/locations";
import About from "./pages/about";
import RentalsAndGifts from "./pages/rentalsandgiftcards";
import Admin from "./pages/admin";
import './pagestyles/admin.css';



function App(props) {
  const [currentPage, setCurrentPage] = useState("Home");
  const capitolShows = props.capShows;
  const paramountShows = props.parShows;
  const upcomingShows = props.upcomingShows;
  const slideshow = props.slideshow;
  const dataReceived = props.dataReceived;
  const currentShows = props.currentShows;


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

  const scrollVariants = {
    disable: {
      opacity: 0,
      overflowY: "hidden",
    },
    enable: {
      opacity: 1,
      overflowY: "scroll",
    }
  }



  return (
    <div className="App">
      <BrowserRouter>
        <NavBar
          pages={pages}
          handlePageChange={handlePageChange}
          currentPage={currentPage.name}
        />
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Routes location={location} key={location.pathname}>
              <Route
                key="home"
                path="/"
                element={
                  <PageWrapper>
                    <Home
                      capShows={capitolShows}
                      parShows={paramountShows}
                      upcomingShows={upcomingShows}
                      slideshow={slideshow}
                      dataReceived={dataReceived}
                    />
                  </PageWrapper>
                }
              />
              <Route
                key="home"
                path="/home"
                element={
                  <PageWrapper>
                    <Home
                      capShows={capitolShows}
                      parShows={paramountShows}
                      upcomingShows={upcomingShows}
                      slideshow={slideshow}
                      dataReceived={dataReceived}
                    />
                  </PageWrapper>
                }
              />
              <Route
                path="/tickets"
                element={
                  <PageWrapper>
                    <Tickets />
                  </PageWrapper>
                }
              />
              <Route
                path="/locations"
                element={
                  <PageWrapper>
                    <Locations key={import.meta.env.GOOGLE_MAPS_API_KEY} />
                  </PageWrapper>
                }
              />
              <Route
                path="/gifts"
                element={
                  <PageWrapper>
                    <RentalsAndGifts />
                  </PageWrapper>
                }
              />
              <Route
                path="/about"
                element={
                  <PageWrapper>
                    <About />
                  </PageWrapper>
                }
              />
              <Route
                path="*"
                element={<Navigate to="/" replace />}
              />
            </Routes>
          </motion.div>
        </AnimatePresence>
        <div className='footer'>
          <span className="footer-socials">
            <SocialIcon key='facebook-icon' bgColor='#f1efef' fgColor='#292323' url="https://www.facebook.com/pages/Capitol%20Theatre/113448652021770/" target='_blank' />
            <SocialIcon key='insta-icon' bgColor='#f1efef' fgColor='#292323' url="https://www.instagram.com/fgbtheaters/" target='_blank' />
          </span>
          <p><sup>©</sup>Copyright 2024 FGB Theaters</p>
        </div>
      </BrowserRouter>
    </div>
  );
}

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
}

export default App;
