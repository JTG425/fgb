import { useState, useEffect } from 'react'
import { motion } from "framer-motion";
import '../componentstyles/upcoming.css'
import { wrap } from 'popmotion';

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
    const newDate = new Date(year, month - 1, day);
    return newDate;
  };

function Upcoming(props) {
    const upcoming = props.upcoming;
    const handleDateChange = props.handleDateChange;


    return (
        <div className='upcoming'>        
        <h2>Coming Soon</h2>
        <div className="upcoming-shows">
            
        {upcoming.map((show, index) => (
          <motion.div
            key={`upcoming-cap-show-${index}`}
            className="upcoming-show"
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.02 }}
            onClick={() =>
              handleDateChange(handleUpcomingDateFormatting(show.StartDate))
            }
          >
            <span className="title">
              <a href={show.website} target="_blank">
                <h4>{show.name}</h4>
              </a>
              <p>{show.rating}</p>
            </span>
            <img src={show.poster} />
            <p>{handleUpcomingDate(show.StartDate)}</p>
          </motion.div>
        ))}
      </div>
      </div>
    )
}

export default Upcoming;
