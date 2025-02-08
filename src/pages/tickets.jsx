import "../pagestyles/tickets.css";
import "../pagestyles/home.css";
import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Gift from "./gift";
import icon9 from "../assets/9.png";
import icon1 from "../assets/1.png";

function Tickets() {
  const [confirmed, setConfirmed] = useState(true);

  const handleCheckbox = (e) => {
    setConfirmed(e.target.checked);
  };

  const buttonVariants = {
    hovered: {
      background: "#940303",
      color: "#fbfbfb",
      boxShadow: "0px 0px 10px 0px rgba(148, 3, 3, 0.75)",
    },
    nothovered: {
      background: "#fbfbfb",
      color: "#940303",
      boxShadow: "0px 0px 0px 0px rgba(148, 3, 3, 0)",
    },
  };

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

  const tickRef1 = useRef(null);
  const tickRef2 = useRef(null);
  const tickRef3 = useRef(null);
  const inView1 = useInView(tickRef1, { once: true });
  const inView2 = useInView(tickRef2, { once: true });
  const inView3 = useInView(tickRef3, { once: true });

  return (
    <div className="page-container">
      <div className="tickets">
        <div className="tickets-header">
          <h2>Buy Tickets</h2>
          <h3>Skip The Line, Buy Online!</h3>
        </div>
        <img className="film-reel1" src={icon9} />
        <img className="tickets-icon" src={icon1} />
        <div className="buy-ticket-container">
          <div className="prices">
            <table>
              <thead>
                <tr className="prices-row">
                  <th className="prices-cell" colSpan="5">Prices</th>
                </tr>
                <tr>
                  <th>Show</th>
                  <th>Adult</th>
                  <th>Child</th>
                  <th>Senior</th>
                  <th>Military</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Standard</td>
                  <td>$12.84</td>
                  <td>$9.63</td>
                  <td>$9.37</td>
                  <td>$9.37</td>
                </tr>
                <tr>
                  <td>Matinee</td>
                  <td>$9.37</td>
                  <td>$9.37</td>
                  <td>$9.37</td>
                  <td>$9.37</td>
                </tr>
              </tbody>
            </table>
          </div>
          <motion.div className="tickets-button">
            <a
              href="https://app.formovietickets.com/?id=fgbtheatres"
              target="_blank"
              rel="noreferrer"
            >
              <motion.button
                className="buy-button"
                initial="nothovered"
                whileHover="hovered"
                whileTap={{ scale: 0.98 }}
                variants={buttonVariants}
                disabled={confirmed === false}
              >
                Buy Tickets Now
              </motion.button>
            </a>
          </motion.div>
        </div>
        <img className="film-reel2" src={icon9} />
        <motion.div
          ref={tickRef1}
          initial="hidden"
          animate={inView1 ? "visible" : "hidden"}
          variants={cardVariants}
        >
          <Gift />
        </motion.div>
        <motion.div
          className="tickets-terms"
          ref={tickRef3}
          initial="hidden"
          animate={inView3 ? "visible" : "hidden"}
          variants={cardVariants}
        >
          <h3>Print At Home</h3>
          <p>
            When you purchase your tickets online, a confirmation email will be
            sent to you, accompanied by a set of bar codes, and 12 numbers.
            These can be brought straight to the ticket-taker stationed in front
            of the theatre or the will call window.
          </p>

          <h3>Order & Pick-up Online Tickets</h3>
          <p>
            Please make sure to check the date and showtime of the movie you
            wish to buy tickets for. Tickets are valid only for the date and
            showtime purchased. You will need a credit card to purchase online
            tickets, and there is a non-refundable $1.00 service fee for each
            ticket.
          </p>
          <p>
            You will receive an email confirmation receipt with the purchase
            number and a set of bar codes. Some ISP's will block the
            confirmation email, but that does NOT mean that there was a problem
            with the transaction.
          </p>
          <p>
            <b>
              <i>
                *You need the confirmation email and/or credit card you used to
                purchase the tickets in order to pick them up at the theatre.*
              </i>
            </b>
          </p>
          <h3>Cancellations</h3>
          <p>
            You will need to present the same credit card at the theatre to
            process any refunds, cancellations or exchanges. Service charges are
            not refundable due to 3rd party fees.
          </p>
          <p>
            <span>
              <b>
                <i>
                  Refunds can only be issued on or before the specific start
                  time on the ticket purchased. Please contact the theatre prior
                  to showtime if unable to attend (802-223-4778).
                </i>
              </b>
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Tickets;
