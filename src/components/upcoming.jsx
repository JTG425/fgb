import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'motion/react';
import '../componentstyles/upcoming.css';
import { use } from 'react';

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
  const totalShows = upcoming.length;
  const carouselRef = useRef();

  useEffect(() => {
    const scrollSpeed = 10;
    const distance = -totalShows * 250;

    controls.start({
      x: [-distance/2.5, distance / 2.5],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: 'reverse',
          duration: totalShows * scrollSpeed,
          ease: 'linear',
        },
      },
    });
  }, [controls, totalShows]);

  return (
    <div className='upcoming'>
      <h2>Coming Soon</h2>
      <div className='upcoming-shows'>
        <motion.div
          ref={carouselRef}
          className='carousel-track'
          animate={controls}
          style={{ display: 'flex', width: `${totalShows * 200}px` }} // Adjust width based on item width
        >
          {upcoming.map((show, index) => (
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
