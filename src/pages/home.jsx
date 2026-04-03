import { useState, useContext } from "react";
import "../pagestyles/home.css";
import SlideShow from "../components/slideshow";
import MovieCard from "../components/movieCard";
import SelectTheater from "../components/selecttheater";
import Upcoming from "../components/upcoming";
import { motion, AnimatePresence } from "motion/react"
import icon7 from "../assets/7.png";
import CustomDatepicker from "../components/customDatePicker";
import { Context } from "../App";



const handleDateFormating = (date) => {
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const formattedMonth = month < 10 ? `0${month}` : month.toString();
  const formattedDay = day < 10 ? `0${day}` : day.toString();
  return `${formattedMonth}${formattedDay}${year}`;
};

const buttonVariants = {
  hovered: {
    backgroundColor: "var(--primary)",
    color: "var(--copy)",
    boxShadow: "0px 0px 10px rgba(148, 3, 3, 0.5)",
    transition: { duration: 0.2 }
  },
  nothovered: {
    backgroundColor: "var(--foreground)",
    color: "var(--copy)",
    boxShadow: "var(--box-shadow)",
    transition: { duration: 0.2 }
  },
};




function Home() {
  const { capShows, parShows, upcoming, loading, slideshow } = useContext(Context);
  const [date, setDate] = useState(handleDateFormating(new Date()));
  const [selectedTheater, setSelectedTheater] = useState("capitol");

  const handleTheaterChange = (theater) => {
    setSelectedTheater(theater);
  };

  const handleDateChange = (date) => {
    setDate(handleDateFormating(date));
  }


  return (
    <AnimatePresence mode="wait">
      {!loading && (
        <motion.div
          className="page-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}

        >
          <SlideShow slideshowData={slideshow} />
          <div className="home-container">
            <div className="giftcard-container">
            <h2>Happy Holidays!</h2>
            <p>Give the Gift of an FGB Theaters Gift Card this year!</p>
            <a href="https://61849.formovietickets.com:2235/app/rtsweb/gift" target="_blank" rel="noopener noreferrer">
              <motion.button
                className="giftcard-button"
                initial="nothovered"
                whileHover="hovered"
                whileTap={{ scale: 0.98 }}
                variants={buttonVariants}
              >
                <motion.p whileHover={{ color: "#fbfbfb" }}>Buy Now</motion.p>
              </motion.button>
            </a>
            </div>

            <SelectTheater
              selected={selectedTheater}
              setSelected={handleTheaterChange}
            />
            <CustomDatepicker setDate={handleDateChange} />
            <img className="home-icon1" src={icon7} alt="Decorative film reel" />
            <img className="home-icon2" src={icon7} alt="Decorative film reel" />
            <div className="movies-container">
              <MovieCard
                date={date}
                capShows={capShows}
                parShows={parShows}
                selectedTheater={selectedTheater}
              />
            </div>
          </div>
          <Upcoming upcoming={upcoming} handleDateChange={handleDateChange} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Home;
