import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "../pagestyles/home.css";
import SlideShow from "../components/slideshow";
import MovieCard from "../components/movieCard";
import SelectTheater from "../components/selecttheater";
import Upcoming from "../components/upcoming";
import CustomDatepicker from "../components/customDatePicker";
import { Context } from "../App";

const formatScheduleDate = (date) => {
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const formattedMonth = month < 10 ? `0${month}` : month.toString();
  const formattedDay = day < 10 ? `0${day}` : day.toString();
  return `${formattedMonth}${formattedDay}${year}`;
};

function Home() {
  const { capShows, parShows, upcoming, loading, scheduleError, slideshow } = useContext(Context);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTheater, setSelectedTheater] = useState("capitol");
  const hasSlideshow = Array.isArray(slideshow) && slideshow.length > 0;

  const selectedTheaterName =
    selectedTheater === "capitol" ? "Capitol Theater" : "Paramount Theater";

  const handleUpcomingDateChange = (date) => {
    setSelectedDate(date);
    window.requestAnimationFrame(() => {
      const heading = document.getElementById("showtimes-heading");
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      heading?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
      heading?.focus({ preventScroll: true });
    });
  };

  if (loading) return null;

  return (
    <div className="page-container home-page">
      <main
        id="main-content"
        className={`home-main${hasSlideshow ? " has-slideshow" : " no-slideshow"}`}
        tabIndex="-1"
      >
        <SlideShow slideshowData={slideshow} />

        <div className="home-container">
          <section className="showtimes-section" aria-labelledby="showtimes-heading">
              <div className="showtimes-header">
                <div className="showtimes-heading-copy">
                  <span className="section-eyebrow">Plan your visit</span>
                  <h1 id="showtimes-heading" tabIndex="-1">Now Showing</h1>
                  <p>Choose a theater and date to find your next movie.</p>
                </div>

                <div className="home-options" aria-label="Showtime filters">
                  <SelectTheater
                    selected={selectedTheater}
                    setSelected={setSelectedTheater}
                  />
                  <CustomDatepicker
                    value={selectedDate}
                    setDate={setSelectedDate}
                  />
                </div>
              </div>

              <div className="showtimes-context" aria-live="polite">
                Showtimes for <strong>{selectedTheaterName}</strong> on{" "}
                <strong>
                  {selectedDate.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </strong>
              </div>

              <div className="movies-container">
                {scheduleError ? (
                  <div className="schedule-error" role="alert">
                    <span className="no-shows-kicker">Schedule unavailable</span>
                    <h2>We couldn’t load the current showtimes.</h2>
                    <p>
                      Please try again in a moment, or visit the{" "}
                      <Link to="/tickets">Tickets page</Link> to continue to the
                      online ticketing portal.
                    </p>
                  </div>
                ) : (
                  <MovieCard
                    date={formatScheduleDate(selectedDate)}
                    capShows={capShows}
                    parShows={parShows}
                    selectedTheater={selectedTheater}
                  />
                )}
              </div>
          </section>
        </div>

        {!scheduleError && (
          <Upcoming upcoming={upcoming} handleDateChange={handleUpcomingDateChange} />
        )}
      </main>
    </div>
  );
}

export default Home;
