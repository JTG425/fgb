import { useState, Suspense, useEffect } from "react";
import "../pagestyles/home.css";
import "../componentstyles/datepicker.css";
import SlideShow from "../components/slideshow";
import MovieCard from "../components/movieCard";
import SelectTheater from "../components/selecttheater";
import Upcoming from "../components/upcoming";
import { CiCalendarDate } from "react-icons/ci";
import { Day, DayPicker } from "react-day-picker";
import { motion, AnimatePresence } from "motion/react"
import icon7 from "../assets/7.png";
import CustomDatepicker from "../components/customDatePicker";
import { Context } from "../App";
import { useContext } from "react";



const handleDateFormating = (date) => {
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const formattedMonth = month < 10 ? `0${month}` : month.toString();
  const formattedDay = day < 10 ? `0${day}` : day.toString();
  return `${formattedMonth}${formattedDay}${year}`;
};

const handleDisplayDate = (date) => {
  const month = date.slice(0, 2);
  const day = date.slice(2, 4);
  const year = date.slice(4, 8);
  return `${month} / ${day} / ${year}`;
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
      <SlideShow slideshow={slideshow} />
      <div className="home-container">
        <h2>Showtimes</h2>
        <SelectTheater
          selected={selectedTheater}
          setSelected={handleTheaterChange}
        />
        <CustomDatepicker setDate={handleDateChange} />
        <img className="home-icon1" src={icon7} />
        <img className="home-icon2" src={icon7} />
        <div className="movies-container">
          {selectedTheater === "capitol" ? (
            <MovieCard
              date={date}
              capShows={capShows}
              parShows={parShows}
              selectedTheater={selectedTheater}
            />
          ) : (
            <MovieCard
              date={date}
              capShows={capShows}
              parShows={parShows}
              selectedTheater={selectedTheater}
            />
          )}
        </div>
      </div>
        <Upcoming upcoming={upcoming} handleDateChange={handleDateChange} />
    </motion.div>
    )}
    </AnimatePresence>
  );
}

export default Home;
