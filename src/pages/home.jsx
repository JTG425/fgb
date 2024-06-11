import { useState, Suspense, useEffect } from "react";
import "../pagestyles/home.css";
import "../componentstyles/datepicker.css";
import SlideShow from "../components/slideshow";
import MovieCard from "../components/movieCard";
import SelectTheater from "../components/selecttheater";
import { CiCalendarDate } from "react-icons/ci";
import { Day, DayPicker } from "react-day-picker";
import { motion } from "framer-motion";

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

const handleUpcomingDate = (date) => {
  const year = date.slice(0, 4);
  const month = date.slice(4, 6);
  const day = date.slice(6, 8);
  return `${month} / ${day} / ${year}`;

};

const handleUpcomingDateFormatting = (date) => {
  const year = date.slice(0, 4);
  const month = date.slice(4, 6);
  const day = date.slice(6, 8);
  return `${month}${day}${year}`;
}

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
  }

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
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <SlideShow slideshow={slideshow} />
      <div className="home-container">
        <h2>Showtimes</h2>
        <SelectTheater selected={selectedTheater} setSelected={handleTheaterChange} />
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
              <div className="blur-date-background" onClick={() => setShowDatePicker(false)} />
              <div className="date-picker">
              <DayPicker
                showOutsideDays={true}
                fixedWeeks={true}
                mode="single"
                selected={selectedDate}
                onSelect={(date) => handleDateChange(date)}
              />
              </div>
              </div>
            )}
        </div>
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
    <div className="upcoming-shows-container">
      <h2>Coming Soon</h2>
      <div className="upcoming-shows">
            {upcoming.map((show, index) => (
              <motion.div 
                key={`upcoming-cap-show-${index}`} 
                className="upcoming-show" 
                whileTap={{ scale: 0.98 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setDate(handleUpcomingDateFormatting(show.StartDate))}
                
                >
                <a href={show.website} target="_blank">
                  <h4>{show.name}</h4>
                </a>
                <p>{show.rating}</p>
                <img src={show.poster} />
                <p>{handleUpcomingDate(show.StartDate)}</p>
              </motion.div>
            ))}
            </div>
    </div>
    </motion.div>
  );
}

export default Home;


