import "../componentstyles/moviecard.css";
import { useCallback, useEffect, useRef, useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaInfoCircle } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { RiMovie2Line } from "react-icons/ri";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import noImage from "../assets/noimage.png";
import { SuspenseImage } from "./suspenseImage";

const convertToStandardTime = (militaryTime) => {
  const hoursMinutes = String(militaryTime || "").match(/(\d{2})(\d{2})/);
  if (!hoursMinutes) return militaryTime || "Time TBA";

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

const createDisplayTime = (time) => {
  const totalMinutes = Number(time);
  if (!Number.isFinite(totalMinutes)) return "Runtime TBA";

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return [hours ? `${hours}h` : "", minutes ? `${minutes}m` : ""].filter(Boolean).join(" ");
};

function MovieCard({ date, capShows, parShows, selectedTheater }) {
  const [detailFilmIndex, setDetailFilmIndex] = useState(null);
  const detailDialogRef = useRef(null);
  const detailTriggerRef = useRef(null);
  const displayDate = createDisplayDate(date);
  const selectedShows = selectedTheater === "capitol" ? capShows : parShows;
  const shows = Array.isArray(selectedShows) ? selectedShows : [];
  const filmsForDate = shows.filter(
    (film) =>
      Array.isArray(film?.show) &&
      film.show.some((show) => show?.date === date)
  );

  const closeDetails = useCallback(() => setDetailFilmIndex(null), []);

  useEffect(() => {
    if (detailFilmIndex === null) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = window.requestAnimationFrame(() => {
      detailDialogRef.current?.querySelector(".close-trailer")?.focus();
    });

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDetails();
        return;
      }

      if (event.key !== "Tab" || !detailDialogRef.current) return;
      const focusable = Array.from(
        detailDialogRef.current.querySelectorAll(
          "a[href], button:not(:disabled), iframe, [tabindex]:not([tabindex='-1'])"
        )
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      detailTriggerRef.current?.focus();
    };
  }, [closeDetails, detailFilmIndex]);

  return (
    <motion.div className="movieCard">
      <AnimatePresence mode="popLayout">
        {filmsForDate.length > 0 ? (
          filmsForDate.map((film, filmIndex) => (
            <motion.article
              className="film"
              key={`${film.RtsCode || film.name}-${filmIndex}`}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="poster-container">
                <Suspense
                  fallback={
                    <div className="poster-skeleton">
                      <SkeletonTheme
                        baseColor="var(--background)"
                        highlightColor="var(--foreground)"
                      >
                        <Skeleton width="100%" height="100%" />
                      </SkeletonTheme>
                    </div>
                  }
                >
                  <SuspenseImage
                    className="poster"
                    src={
                      !film.poster ||
                      film.poster ===
                        "https://fgbtheatersstoragef2bb9-dev.s3.amazonaws.com/public/images/noimage.png"
                        ? noImage
                        : film.poster
                    }
                    fallbackSrc={noImage}
                    alt={`${film.name} poster`}
                  />
                </Suspense>
              </div>

              <div className="film-header">
                <div className="film-heading">
                  <div>
                    {film.website ? (
                      <a
                        className="film-title-link"
                        href={film.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <h3 className="film-name">{film.name}</h3>
                      </a>
                    ) : (
                      <h3 className="film-name">{film.name}</h3>
                    )}

                    <div className="film-info">
                      {film.rating && <span>{film.rating}</span>}
                      <span>{createDisplayTime(film.length)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="film-trailer"
                    onClick={(event) => {
                      detailTriggerRef.current = event.currentTarget;
                      setDetailFilmIndex(filmIndex);
                    }}
                    aria-label={`View trailer and details for ${film.name}`}
                  >
                    <FaInfoCircle aria-hidden="true" />
                    <span>{film.trailer ? "Trailer & details" : "Movie details"}</span>
                  </button>
                </div>

                <div className="film-showtimes">
                  <span className="showtimes-label">Choose a showtime</span>
                  <div className="showtime-grid">
                    {film.show
                      .filter((show) => show?.date === date)
                      .map((show, showIndex) => {
                        const showtime = convertToStandardTime(show.time);
                        const isSubtitled = show.Subtitles === "True";
                        const key = `${show.time}-${show.screen}-${showIndex}`;

                        if (!show.salelink) {
                          return (
                            <span
                              className="showtime-button unavailable"
                              key={key}
                              aria-disabled="true"
                              aria-label={`Tickets unavailable for ${film.name} at ${showtime}${isSubtitled ? ", with subtitles" : ""}`}
                            >
                              <strong>{showtime}</strong>
                              <span>
                                {isSubtitled
                                  ? "Subtitled · Tickets unavailable"
                                  : "Tickets unavailable"}
                              </span>
                            </span>
                          );
                        }

                        return (
                          <motion.a
                            className="showtime-button"
                            href={show.salelink}
                            target="_blank"
                            rel="noopener noreferrer"
                            key={key}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            aria-label={`Buy tickets for ${film.name} at ${showtime}${isSubtitled ? ", with subtitles" : ""}`}
                          >
                            <strong>{showtime}</strong>
                            <span>{isSubtitled ? "Subtitled · Tickets" : "Tickets"}</span>
                          </motion.a>
                        );
                      })}
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {detailFilmIndex === filmIndex && (
                  <motion.div
                    className="trailer-background"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    onClick={closeDetails}
                  >
                    <motion.div
                      className="trailer-container"
                      ref={detailDialogRef}
                      role="dialog"
                      aria-modal="true"
                      aria-label={`${film.name} details`}
                      initial={{ opacity: 0, y: 24, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 18, scale: 0.98 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <div className="trailer-header">
                        <div>
                          <span>Movie details</span>
                          <h2>{film.name}</h2>
                        </div>
                        <button
                          type="button"
                          className="close-trailer"
                          onClick={closeDetails}
                          aria-label="Close movie details"
                        >
                          <IoCloseOutline aria-hidden="true" />
                        </button>
                      </div>

                      {film.trailer && (
                        <iframe
                          title={`${film.name} trailer`}
                          className="youtube-trailer"
                          src={film.trailer}
                          allow="encrypted-media; picture-in-picture"
                          allowFullScreen
                        />
                      )}

                      <div className="movie-info-container">
                        <div className="movie-stats">
                          {film.rating && <span>{film.rating}</span>}
                          <span>{createDisplayTime(film.length)}</span>
                        </div>
                        <p className="movie-description">
                          {film.description || "More details are coming soon."}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          ))
        ) : (
          <motion.div
            className="no-shows"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="no-shows-icon" aria-hidden="true">
              <RiMovie2Line />
            </span>
            <div>
              <span className="no-shows-kicker">Nothing scheduled yet</span>
              <h2>No movies listed for {displayDate}</h2>
              <p>Try another date or switch theaters to see more showtimes.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default MovieCard;
