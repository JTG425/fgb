import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import "../pagestyles/rentals.css";
import { FaPhoneAlt } from "react-icons/fa";

function Rentals(props) {

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

  const rentalCardRef1 = useRef(null);
  const rentalCardRef2 = useRef(null);
  const rentalCardRef3 = useRef(null);
  const inView1 = useInView(rentalCardRef1, { once: true });
  const inView2 = useInView(rentalCardRef2, { once: true });
  const inView3 = useInView(rentalCardRef3, { once: true });


  return (
    <div className="rentals-and-gifts-container">
      <h2>Rentals</h2>
      <div className="rental-card">
        <div className="card-text">
          <p>
            <i>
              <b>For more information contact the Capitol Theater</b>
            </i>
          </p>
        </div>
        <motion.a href="tel:18025223576" className="call">
          <span className="call-content">
            <FaPhoneAlt />
            <p>(802)-522-3576</p>
          </span>
        </motion.a>
      </div>
      <div className="rentals-container">
        <motion.div 
          className="rental-card"
          ref={rentalCardRef1}
          initial="hidden"
          animate={inView1 ? "visible" : "hidden"}
          variants={cardVariants}

          >
          <div className="card-content">
            <span className="card-text">
              <h3>Special Events</h3>
              <p>
                Do you have something "Big" planned? Our Neon lit Marquee will
                leave a lasting memory.
              </p>
              <h3>Business Meetings</h3>
              <p>
                Our auditoriums hold up to 200 people. Captivate your clients
                attention while they sit comfortably in our theater.
              </p>
              <h3>Schools</h3>
              <p>
                Special group rates for parties of 80 or more! We can fit the
                whole School! Our digital projection offers more flexiblility
                than ever before!
              </p>
            </span>
          </div>
        </motion.div>
        <motion.div 
          className="rental-card"
          ref={rentalCardRef2}
          initial="hidden"
          animate={inView2 ? "visible" : "hidden"}
          variants={cardVariants}
          >
          <div className="card-content">
            <span className="card-text-2">
              <h3>Birthday Parties</h3>
              <p>Celebrate Your Childs Birthday at the Movies!</p>
              <p>
                <i>
                  <b>(6 person minimum)</b>
                </i>
              </p>
              <p>
                <b>$16.75</b> <i>per person</i>
              </p>
              <ul>
                <li>
                  <b>Reserved Seating</b> to the movie showing of your choice.
                </li>
                <li>
                  <b>FREE movie ticket and kids pack for the birthday child!</b>
                </li>
              </ul>
            </span>
          </div>
        </motion.div>
        <motion.div 
          className="rental-card"
          ref={rentalCardRef3}
          initial="hidden"
          animate={inView3 ? "visible" : "hidden"}
          variants={cardVariants}
          
          >
          <div className="card-content-3">
            <span className="card-text-3">
              <h3>Advertisements</h3>
              <p>
                Advertise your business on the big screen! Reach a larger
                audience with our digital projection. As the leader in cinema
                advertising, Screenvision connects your business with consumers
                through on-screen advertising available here at FGB Theaters.
                Showcase your business with the power of Hollywood and let
                advertising on our big screens deliver blockbuster results.
              </p>
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Rentals;
