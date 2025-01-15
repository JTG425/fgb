import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import '../componentstyles/upcoming.css';

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
  return new Date(year, month - 1, day);
};

function Upcoming({ upcoming, handleDateChange }) {
  const controls = useAnimation();
  const carouselRef = useRef(null);
  const totalShows = upcoming.length;

  useEffect(() => {
    const scrollSpeed = 20;
    let animationFrameId;

    const animate = () => {
      if (carouselRef.current) {
        carouselRef.current.scrollLeft += 1;
        if (carouselRef.current.scrollLeft >= carouselRef.current.scrollWidth / 2) {
          carouselRef.current.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className='upcoming'>
      <h2>Coming Soon</h2>
      <div className='upcoming-shows' ref={carouselRef}>
        <motion.div
          className='carousel-track'
          animate={controls}
          style={{ display: 'flex', width: `${totalShows * 2 * 20}%` }}
        >
          {upcoming.concat(upcoming).map((show, index) => (
            <div
              key={index}
              className='upcoming-show'
              onClick={() => handleDateChange(handleUpcomingDateFormatting(show.StartDate))}
            >
              <span className='title'>
                <a href={show.website} target='_blank' rel='noopener noreferrer'>
                  <h4>{show.name}</h4>
                </a>
                <p>{show.rating}</p>
              </span>
              <img src={show.poster} alt={`${show.name} poster`} />
              <p>{handleUpcomingDate(show.StartDate)}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default Upcoming;
