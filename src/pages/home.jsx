import { useState, Suspense, useEffect } from "react";
import "../pagestyles/home.css";
import "../componentstyles/datepicker.css";
import SlideShow from "../components/slideshow";
import MovieCard from "../components/movieCard";
import SelectTheater from "../components/selecttheater";
import Upcoming from "../components/upcoming";
import { CiCalendarDate } from "react-icons/ci";
import { Day, DayPicker } from "react-day-picker";
import { motion } from "framer-motion";
import icon7 from "../assets/7.png";

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




function Home(props) {
  const capShows = props.capShows;
  const parShows = props.parShows;
  const upcoming = props.upcomingShows;
  const dataReceived = props.dataReceived;
  const slideshow = props.slideshow;
  const [startDate, setStartDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [date, setDate] = useState(handleDateFormating(new Date()));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTheater, setSelectedTheater] = useState("capitol");
  const [testingDate, setTestingDate] = useState(new Date());

  const handleTheaterChange = (theater) => {
    setSelectedTheater(theater);
  };

  const handleDateChange = (newDate) => {
    if (newDate === undefined) {
      setShowDatePicker(false);
      return;
    } else {
      setSelectedDate(newDate);
      setDate(handleDateFormating(newDate));
      setShowDatePicker(false);
    }
  };

  return (
    <>
    <motion.div className="page-container">
      <SlideShow slideshow={slideshow} />
      <div className="home-container">
        <h2>Showtimes</h2>
        <SelectTheater
          selected={selectedTheater}
          setSelected={handleTheaterChange}
        />
        <div className="datepicker-container">
          <motion.button
            className="date-button"
            onClick={() => setShowDatePicker(!showDatePicker)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {date ? handleDisplayDate(date) : "Select Date"}
            <CiCalendarDate className="date-icon" />
          </motion.button>
          {showDatePicker && (
            <div className="date-picker-container">
              <div
                className="blur-date-background"
                onClick={() => setShowDatePicker(false)}
              />
              <div className="date-picker">
                <DayPicker
                  showOutsideDays={true}
                  fixedWeeks={true}
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => handleDateChange(date)}
                />
                <motion.button
                  className="date-picker-today-button"
                  onClick={() => handleDateChange(new Date())}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Today
                </motion.button>
              </div>
            </div>
          )}
        </div>

        <img className="home-icon1" src={icon7} />
        <img className="home-icon2" src={icon7} />
        <div className="movies-container">
          {dataReceived && selectedTheater === "capitol" ? (
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
    </>
  );
}

export default Home;
