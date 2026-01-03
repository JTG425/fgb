import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import "../pagestyles/rentals.css";
import { FaPhoneAlt } from "react-icons/fa";

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 25,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

function Rentals() {
  const rentalCardRef1 = useRef(null);
  const rentalCardRef2 = useRef(null);
  const rentalCardRef3 = useRef(null);
  const inView1 = useInView(rentalCardRef1, { once: true });
  const inView2 = useInView(rentalCardRef2, { once: true });
  const inView3 = useInView(rentalCardRef3, { once: true });

  return (
    <div className="page-container">
      <div className="rentals-container">
        <div className="rentals-header">
          <h2>Rentals</h2>
        </div>
        <div className="rentals-contact-card">
          <p>
            <i>
              <b>For more information contact the Capitol Theater</b>
            </i>
          </p>
          <a href="tel:18025223576" className="rentals-phone-link">
            <span className="rentals-phone-content">
              <FaPhoneAlt />
              <p>(802)-522-3576</p>
            </span>
          </a>
        </div>
        <div className="rentals-content">
          <motion.div
            className="rentals-info-card"
            ref={rentalCardRef1}
            initial="hidden"
            animate={inView1 ? "visible" : "hidden"}
            variants={cardVariants}
          >
            <div className="rentals-info-text">
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
            </div>
          </motion.div>
          <motion.div
            className="rentals-info-card"
            ref={rentalCardRef2}
            initial="hidden"
            animate={inView2 ? "visible" : "hidden"}
            variants={cardVariants}
          >
            <div className="rentals-info-text">
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
            </div>
          </motion.div>
          <motion.div
            className="rentals-info-card"
            ref={rentalCardRef3}
            initial="hidden"
            animate={inView3 ? "visible" : "hidden"}
            variants={cardVariants}
          >
            <div className="rentals-info-text">
              <h3>Advertisements</h3>
              <p>
                Advertise your business on the big screen! Reach a larger
                audience with our digital projection. As the leader in cinema
                advertising, Screenvision connects your business with consumers
                through on-screen advertising available here at FGB Theaters.
                Showcase your business with the power of Hollywood and let
                advertising on our big screens deliver blockbuster results.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Rentals;
