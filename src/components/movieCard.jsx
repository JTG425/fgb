import "../componentstyles/moviecard.css";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import noImage from "../assets/noimage.png";

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
  const [trailerButtonHovered, setTrailerButtonHovered] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerIndex, setTrailerIndex] = useState(0);

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 100,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
      },
    },
  };

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
  };

  const trailerButtonVariants = {
    hovered: {
      background: "#940303",
      color: "#fbfbfb",
      boxShadow: "0px 0px 10px 0px rgba(148, 3, 3, 0.75)",
      overflowX: "shown",
      overflowY: "hidden",
      width: "100px",
    },
    nothovered: {
      background: "#fbfbfb",
      color: "#940303",
      boxShadow: "0px 0px 0px 0px rgba(148, 3, 3, 0)",
      overflowX: "hidden",
      overflowY: "hidden",
      width: "50px",
    },
  };

  useEffect(() => {
    const currentShows = selectedTheater === "capitol" ? capShows : parShows;
    setShows(currentShows);
    const hasMovies = currentShows.some((film) =>
      film.show.some((show) => show.date === date)
    );
    setIsAnyMovies(hasMovies);
  }, [selectedTheater, capShows, parShows, date]);

  return (
    <motion.div className="movieCard">
      <AnimatePresence mode="popLayout">
        {isAnyMovies ? (
          shows
            .filter((film) => film.show.some((show) => show.date === date))
            .map((film, filmIndex) => (
              <motion.div
                className="film"
                key={`movie-${filmIndex}-${film.name}`}
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100}}
                transition={{ duration: 0.5, type: "spring" }}
              >
                <motion.img
                  key={`movie-${filmIndex}-${film.name}-poster`}
                  className="poster"
                  src={film.poster === "https://fgbtheatersstoragef2bb9-dev.s3.amazonaws.com/public/images/noimage.png" ? noImage : film.poster}
                  alt={film.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <motion.div
                  key={`movie-${filmIndex}-${film.name}-header`}
                  className="film-header"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  >
                  <a
                    href={film.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <h3 className="film-name">{film.name}</h3>
                  </a>
                  <span className="film-info">
                    <p>{film.rating}</p>
                    <p>{film.length} minutes</p>
                  </span>
                  <span className="film-trailer-desc">
                    <motion.button
                      key={film.trailer}
                      className="film-trailer"
                      initial="nothovered"
                      whileHover="hovered"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowTrailer(true);
                        setTrailerIndex(filmIndex);
                      }}
                      onMouseEnter={() => {
                        setTrailerButtonHovered(true);
                        setTrailerIndex(filmIndex);
                      }}
                      onMouseLeave={() => {
                        setTrailerButtonHovered(false);
                      }}
                      variants={trailerButtonVariants}
                    >
                      <FaPlay />
                      {trailerButtonHovered && trailerIndex === filmIndex ? (
                        <p>Trailer</p>
                      ) : null}
                    </motion.button>
                    {showTrailer && trailerIndex === filmIndex ? (
                      <motion.div
                        className="trailer-background"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        onClick={() => setShowTrailer(false)}
                      >
                        <motion.button
                          className="close-trailer"
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setShowTrailer(false)}
                        >
                          <IoCloseOutline />
                        </motion.button>

                        <motion.div
                          className="trailer-container"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <iframe
                            className="trailer-frame"
                            src={`${film.trailer}?autoplay=1`}
                          />
                        </motion.div>
                      </motion.div>
                    ) : null}
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
                </motion.div>
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
