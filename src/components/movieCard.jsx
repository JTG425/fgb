import "../componentstyles/moviecard.css";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const convertToStandardTime = (militaryTime) => {
  const hoursMinutes = militaryTime.match(/(\d{2})(\d{2})/);
  let hours = parseInt(hoursMinutes[1], 10);
  const minutes = hoursMinutes[2];
  const suffix = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${hours}:${minutes} ${suffix}`;
};

const createDisplayDate = (date) => {
  const month = date.slice(0, 2);
  const day = date.slice(2, 4);
  const year = date.slice(4, 8);
  return `${month} / ${day} / ${year}`;
};




function MovieCard(props) {
  const date = props.date;
  const displayDate = createDisplayDate(date);
  const capShows = props.capShows;
  const parShows = props.parShows;
  const [shows, setShows] = useState(capShows);
  const selectedTheater = props.selectedTheater;
  const [isAnyMovies, setIsAnyMovies] = useState(true);
  const [inView, setInView] = useState(false);




  useEffect(() => {
    setShows(selectedTheater === "capitol" ? capShows : parShows);
  }, [selectedTheater]);


  const buttonVariants = {
    hovered: {
      background: "#940303",
      color: "#fbfbfb",
      boxShadow: "0px 0px 10px 0px rgba(148, 3, 3, 0.75)",
    },
    nothovered: {
      background: "#fbfbfb",
      color: "#940303",
      boxShadow: "0px 0px 0px 0px rgba(148, 3, 3, 0)",
    },
  }

  useEffect(() => {
    const currentShows = selectedTheater === "capitol" ? capShows : parShows;
    setShows(currentShows);
    const hasMovies = currentShows.some(film => film.show.some(show => show.date === date));
    setIsAnyMovies(hasMovies);
  }, [selectedTheater, capShows, parShows, date]);

  return (
    <motion.div className="movieCard">
      <AnimatePresence>
        {isAnyMovies ? (
          shows
            .filter((film) => film.show.some((show) => show.date === date))
            .map((film, filmIndex) => (
              <motion.div 
                className="film" 
                key={filmIndex}
                >
                <motion.img
                  className="poster"
                  src={film.poster}
                  alt={film.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <div className="film-header">
                  <a href={film.website} target="_blank" rel="noopener noreferrer">
                    <h3 className="film-name">{film.name}</h3>
                  </a>
                  <span className="film-info">
                    <p>{film.rating}</p>
                    <p>{film.length} minutes</p>
                  </span>
                  {film.show
                    .filter((show) => show.date === date)
                    .map((show, showIndex) => (
                      <div className="showtime" key={showIndex}>
                        <a
                          className="showtime-link"
                          href={show.salelink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <motion.button
                            className="showtime-button"
                            initial="nothovered"
                            whileHover="hovered"
                            whileTap={{ scale: 0.98 }}
                            variants={buttonVariants}
                          >
                            <motion.p whileHover={{ color: "#fbfbfb" }}>
                              {convertToStandardTime(show.time)}
                              {show.Subtitles === "True" ? " (Subtitles)" : ""}
                            </motion.p>
                          </motion.button>
                        </a>
                      </div>
                    ))}
                </div>
              </motion.div>
            ))
        ) : (
          <div className="no-shows">
            <h2>No Scheduled Movies for {displayDate}</h2>
            <h3>Grab some popcorn and hang tight!</h3>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default MovieCard;