import { useRef, memo, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import "../pagestyles/about.css";
import oldCap from "../assets/oldCap.png";
import jiddo from "../assets/jiddo.png";
import oldParamount from "../assets/oldParamount.png";
import newCap from "../assets/newCap.png";
import Skeleton from 'react-loading-skeleton'

function About() {
  const cardVariants = useMemo(() => ({
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
  }), []);

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
          {<img src={newCap} alt="newCap" className="newCap" loading="lazy" /> || <Skeleton width={200} height={50} />}
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
              <img src={oldCap} alt="oldCap" className="oldCap" loading="lazy" />
              <img src={oldParamount} alt="oldParamount" className="oldParamount" loading="lazy" />
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
            <img src={jiddo} alt="jiddo" className="jiddo" loading="lazy" />
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

export default memo(About);
