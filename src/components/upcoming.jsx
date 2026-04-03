import { motion } from 'motion/react';
import '../componentstyles/upcoming.css';
import leftCurtain from "../assets/leftcurtain.png";
import rightCurtain from "../assets/rightcurtain.png";
import Marquee from 'react-fast-marquee';

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
  return (
    <div className='upcoming-container'>
      <div className='curtains'>
        <img className='leftcurtain' src={leftCurtain} alt='left curtain' />
        <img className='rightcurtain' src={rightCurtain} alt='right curtain' />
      </div>
      <div className='upcoming'>
        <h2>Coming Soon</h2>
        <div className='upcoming-shows'>
          <Marquee gradient={true} gradientColor='var(--background)' gradientWidth={75} >
            {upcoming.map((show, index) => (
              <motion.div
                key={`upcoming-show-${index}`}
                className='upcoming-show'
                whileHover={{ scale: 1.02 }}
                whileTap={{scale: 0.98}}
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
              </motion.div>
            ))}
          </Marquee>
        </div>
      </div>
    </div>
  );
}

export default Upcoming;
