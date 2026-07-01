"use client";

import "@/styles/componentstyles/moviecard.css";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState, Suspense } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { SuspenseImage } from "./suspenseImage";

const NO_IMAGE_URL =
  "https://fgbtheatersstoragef2bb9-dev.s3.amazonaws.com/public/images/noimage.png";

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

// Takes in length in mins (String) and returns a string in hours and minutes
const createDisplayTime = (time) => {
  const hours = Math.floor(time / 60);
  const minutes = time % 60;
  return `${hours}HR ${minutes}MIN`;
};

// A trailer link is only playable if it points at an actual video
// (the data sometimes contains bare "https://www.youtube.com/embed/" stubs).
const hasTrailer = (trailer) =>
  Boolean(trailer) && !trailer.endsWith("/embed/") && trailer.trim() !== "";

const buttonVariants = {
  hovered: {
    background: "#940303",
    color: "#fbfbfb",
    boxShadow: "0px 0px 10px 0px rgba(148, 3, 3, 0.75)",
  },
  nothovered: {
    background: "var(--foreground)",
    color: "#940303",
    boxShadow: "0px 0px 0px 0px rgba(148, 3, 3, 0)",
  },
};

const trailerButtonVariants = {
  hovered: {
    background: "#940303",
    color: "#fbfbfb",
    boxShadow: "0px 0px 10px 0px rgba(148, 3, 3, 0.75)",
    overflowX: "visible",
    overflowY: "hidden",
    width: "100px",
  },
  nothovered: {
    background: "var(--foreground)",
    color: "#940303",
    boxShadow: "0px 0px 0px 0px rgba(148, 3, 3, 0)",
    overflowX: "hidden",
    overflowY: "hidden",
    width: "50px",
  },
};

function MovieCard({ date, capShows, parShows, selectedTheater }) {
  const displayDate = createDisplayDate(date);
  const [trailerButtonHovered, setTrailerButtonHovered] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerIndex, setTrailerIndex] = useState(0);

  // Derive the visible films directly — no state/effect round-trips.
  const films = useMemo(() => {
    const shows = selectedTheater === "capitol" ? capShows : parShows;
    if (!shows) return [];
    return shows.filter((film) =>
      film.show.some((show) => show.date === date)
    );
  }, [selectedTheater, capShows, parShows, date]);

  const isAnyMovies = films.length > 0;

  return (
    <motion.div className="movieCard">
      <AnimatePresence mode="popLayout">
        {isAnyMovies ? (
          films.map((film, filmIndex) => (
            <motion.div
              className="film"
              key={`movie-${filmIndex}-${film.name}`}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <div className="poster-container">
                <Suspense
                  fallback={
                    <div className="poster-skeleton">
                      <SkeletonTheme
                        baseColor="var(--background)"
                        highlightColor="var(--foreground)"
                      >
                        <Skeleton width={200} height={300} />
                      </SkeletonTheme>
                    </div>
                  }
                >
                  <SuspenseImage
                    className="poster"
                    src={
                      film.poster === NO_IMAGE_URL
                        ? "/assets/noimage.png"
                        : film.poster
                    }
                    alt={film.name}
                  />
                </Suspense>
              </div>
              <motion.div
                key={`movie-${filmIndex}-${film.name}-header`}
                className="film-header"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <a href={film.website} target="_blank" rel="noopener noreferrer">
                  <h3 className="film-name">{film.name}</h3>
                </a>
                <span className="film-info">
                  <p>{film.rating}</p>
                  <p>|</p>
                  <p>{createDisplayTime(film.length)}</p>
                </span>
                <span className="film-trailer-desc">
                  <motion.button
                    key={`${film.trailer}-${film.name}-${filmIndex}`}
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
                    <FaInfoCircle />
                    {trailerButtonHovered && trailerIndex === filmIndex ? (
                      <p>Info</p>
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
                        aria-label="Close trailer"
                      >
                        <IoCloseOutline />
                      </motion.button>

                      <motion.div
                        key={`movie-${filmIndex}-${film.name}-trailer-container`}
                        className="trailer-container"
                        initial={{ opacity: 0, y: "0" }}
                        animate={{ opacity: 1, y: "0" }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <span className="trailer-header">
                          <h2>{film.name}</h2>
                        </span>
                        {hasTrailer(film.trailer) && (
                          <iframe
                            title="trailer"
                            className="youtube-trailer"
                            type="text/html"
                            src={`${film.trailer}?autoplay=1`}
                            width="480"
                            height="390"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                          />
                        )}
                        <div className="movie-info-container">
                          <div className="movie-info">
                            <span className="movie-stats">
                              <p>{film.rating}</p>
                              <p>|</p>
                              <p>{createDisplayTime(film.length)}</p>
                            </span>
                            <span className="movie-description">
                              <p>{film.description}</p>
                            </span>
                          </div>
                        </div>
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
