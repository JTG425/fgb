import { motion } from "framer-motion";
import "../pagestyles/about.css";
import { FaHeart, FaRegCalendarCheck } from "react-icons/fa6";
import { HiOutlineSpeakerWave } from "react-icons/hi2";
import oldCap from "../assets/oldCap.png";
import jiddo from "../assets/jiddo.png";
import oldParamount from "../assets/oldParamount.png";
import newCap from "../assets/newCap.png";

function About() {
  return (
    <div className="page-container site-page-container">
      <main id="main-content" className="content-page about-page" tabIndex="-1">
        <section className="page-hero">
          <div className="page-hero-copy">
            <span className="section-eyebrow">Local screens since 1980</span>
            <h1>About FGB Theaters</h1>
            <p>
              FGB Theaters is a family-owned Vermont cinema group, operating
              the Capitol Theater in Montpelier and the Paramount Theater in Barre.
            </p>
          </div>
          <div className="page-hero-aside about-hero-aside">
            <FaHeart aria-hidden="true" />
            <div>
              <strong>Family owned & operated</strong>
              Two theaters, two downtown communities, and decades of shared
              moviegoing memories.
            </div>
          </div>
        </section>

        <motion.figure
          className="about-feature page-section"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55 }}
        >
          <img src={newCap} alt="The illuminated Capitol Theater marquee in downtown Montpelier" />
          <figcaption>
            <span>Downtown Montpelier</span>
            <strong>The Capitol Theater</strong>
          </figcaption>
        </motion.figure>

        <section className="about-story page-section" aria-labelledby="about-story-heading">
          <div className="page-section-heading">
            <div>
              <span className="section-eyebrow">Our story</span>
              <h2 id="about-story-heading">A Vermont movie tradition</h2>
            </div>
          </div>

          <motion.article
            className="about-story-card history-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            <div className="history-collage">
              <img src={oldCap} alt="Historic exterior of the Capitol Theater" />
              <img src={oldParamount} alt="Historic exterior of the Paramount Theater" />
            </div>
            <div className="about-story-copy">
              <FaRegCalendarCheck className="about-story-icon" aria-hidden="true" />
              <span>Serving central Vermont</span>
              <h3>Part of downtown since 1980</h3>
              <p>
                Our two locations have been staples of Montpelier and Barre,
                bringing popular and anticipated films to local audiences for decades.
              </p>
            </div>
          </motion.article>

          <motion.article
            className="about-story-card technology-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            <div className="about-story-copy">
              <HiOutlineSpeakerWave className="about-story-icon" aria-hidden="true" />
              <span>The big-screen experience</span>
              <h3>Modern picture and sound</h3>
              <p>
                Our theaters use contemporary digital projection and sound
                technology to deliver the first-class moviegoing experience our
                audiences expect.
              </p>
            </div>
            <img
              className="technology-image"
              src={jiddo}
              alt="A film character displayed with vivid theatrical presentation"
            />
          </motion.article>
        </section>
      </main>
    </div>
  );
}

export default About;
