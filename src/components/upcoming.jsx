import { motion } from "motion/react";
import { IoArrowForward } from "react-icons/io5";
import "../componentstyles/upcoming.css";
import noImage from "../assets/noimage.png";

const formatUpcomingDate = (date) => {
  const year = date.slice(0, 4);
  const month = date.slice(4, 6);
  const day = date.slice(6, 8);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
};

const parseUpcomingDate = (date) => {
  const year = date.slice(0, 4);
  const month = date.slice(4, 6);
  const day = date.slice(6, 8);
  return new Date(year, month - 1, day);
};

function Upcoming({ upcoming = [], handleDateChange }) {
  if (!upcoming.length) return null;

  return (
    <section className="upcoming-container" aria-labelledby="coming-soon-heading">
      <div className="upcoming">
        <div className="upcoming-heading">
          <div>
            <span className="section-eyebrow">On the horizon</span>
            <h2 id="coming-soon-heading">Coming Soon</h2>
          </div>
          <p>Preview what’s next and jump directly to a film’s opening date.</p>
        </div>

        <div className="upcoming-shows" role="list" aria-label="Upcoming films">
          {upcoming.map((show, index) => (
            <motion.article
              key={`${show.RtsCode || show.name}-${index}`}
              className="upcoming-show"
              role="listitem"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.24) }}
            >
              <div className="upcoming-poster-wrap">
                <img
                  src={show.poster || noImage}
                  alt={`${show.name} poster`}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.src = noImage;
                  }}
                />
                {show.rating && <span className="upcoming-rating">{show.rating}</span>}
              </div>

              <div className="upcoming-card-content">
                {show.website ? (
                  <a href={show.website} target="_blank" rel="noopener noreferrer">
                    <h3>{show.name}</h3>
                  </a>
                ) : (
                  <h3>{show.name}</h3>
                )}

                <span className="upcoming-date">{formatUpcomingDate(show.StartDate)}</span>

                <button
                  type="button"
                  className="upcoming-date-action"
                  onClick={() => handleDateChange(parseUpcomingDate(show.StartDate))}
                  aria-label={`View showtimes for ${show.name} starting ${formatUpcomingDate(show.StartDate)}`}
                >
                  View opening day
                  <IoArrowForward aria-hidden="true" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Upcoming;
