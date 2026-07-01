"use client";

import "@/styles/pagestyles/about.css";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 25,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
    },
  },
};

export default function About() {
  const oldContainerRef1 = useRef(null);
  const oldContainerRef2 = useRef(null);
  const inView1 = useInView(oldContainerRef1, { once: true });
  const inView2 = useInView(oldContainerRef2, { once: true });

  return (
    <div className="page-container">
      <div className="about-container">
        <div className="about-header">
          <h2>About Us</h2>
        </div>
        <img
          src="/assets/newCap.png"
          alt="The Capitol Theater today"
          className="newCap"
        />
        <span className="about-top-text-container">
          <p>
            FGB Theaters, including the Capitol Theater and Paramount Theater,
            are family owned and operated movie Theaters located in the heart
            of Vermont.
          </p>
        </span>
        <div className="about-content">
          <motion.div
            className="old-container"
            ref={oldContainerRef1}
            initial="hidden"
            animate={inView1 ? "visible" : "hidden"}
            variants={cardVariants}
          >
            <span className="old-images">
              <img
                src="/assets/oldCap.png"
                alt="The Capitol Theater in 1980"
                className="oldCap"
              />
              <img
                src="/assets/oldParamount.png"
                alt="The Paramount Theater in 1980"
                className="oldParamount"
              />
            </span>
            <span className="about-text-container">
              <p>
                Opened in 1980, our two locations have been a staple of downtown
                Montpelier and Barre VT, bringing the most popular and
                anticipated movies to our audience for decades
              </p>
            </span>
          </motion.div>
          <motion.div
            className="old-container"
            ref={oldContainerRef2}
            initial="hidden"
            animate={inView2 ? "visible" : "hidden"}
            variants={cardVariants}
          >
            <img src="/assets/jiddo.png" alt="Theater founder" className="jiddo" />
            <span className="about-text-container">
              <p>
                Our theaters are equipped with the latest in digital projection
                and sound technology, providing our customers with a first class
                movie going experience.
              </p>
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
