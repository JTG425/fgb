import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../pagestyles/rentalsandgifts.css";
import { FaPhoneAlt } from "react-icons/fa";

function Rentals(props) {
  return (
    <div className="rentals-and-gifts-container">
      <h2>Rentals</h2>
      <div className="rentals-container">
        <div className="rental-card">
          <div className="card-content">
            <img
              src="https://fgbtheatersstoragef2bb9-dev.s3.amazonaws.com/public/gifts/rentals1.png"
              alt="rental"
            />
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
              <p>
                <i>
                  <b>For more information contact the Capitol Theater</b>
                </i>
              </p>
            </span>
          </div>
          <motion.a href="tel:18022290343" className="call">
                <span className="call-content">
                  <FaPhoneAlt />
                  <p>(802)-229-0343</p>
                </span>
              </motion.a>
        </div>
        <div className="rental-card">
          <div className="card-content">
            <img
              src="https://fgbtheatersstoragef2bb9-dev.s3.amazonaws.com/public/gifts/rentals2.png"
              alt="rental"
            />
            <span className="card-text-2">
              <h3>Birthday Parties</h3>
              <p>Celebrate Your Childs Birthday at the Movies!</p>
              <p>
                <i>
                  <b>(6 person minimum)</b>
                </i>
              </p>
              <p>
                <b>$10.50</b> For Matinee Shows <i>per person</i>
              </p>
              <p>
                <b>$12.50</b> For Evening Shows <i>per person</i>
              </p>
              <ul>
                <li>
                  <b>Reserved Seating</b> to the movie showing of your choice.
                </li>
                <li>
                  <b>FREE movie ticket for the birthday child!</b>
                </li>
                <li>
                  <b>FREE kids pack</b> including soda, popcorn, and small
                  candy!
                </li>
                <li>
                  <b>Exclusive private tour</b> of the projection booth!
                </li>
              </ul>
              <p>
                <i>
                  <b>For more information contact the Capitol Theater</b>
                </i>
              </p>
            </span>
          </div>
          <motion.a href="tel:18022290343" className="call">
                <span className="call-content">
                  <FaPhoneAlt />
                  <p>(802)-229-0343</p>
                </span>
              </motion.a>
        </div>
        <div className="rental-card">
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
              <p>
                <i>
                  <b>For more information contact the Capitol Theater</b>
                </i>
              </p>
            </span>
          </div>
          <motion.a href="tel:18022290343" className="call">
                <span className="call-content">
                  <FaPhoneAlt />
                  <p>(802)-229-0343</p>
                </span>
              </motion.a>
        </div>
      </div>
    </div>
  );
}

export default Rentals;
