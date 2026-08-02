import "../pagestyles/tickets.css";
import { motion } from "framer-motion";
import { FaRegCreditCard, FaTicketSimple } from "react-icons/fa6";
import { FiArrowUpRight, FiMail } from "react-icons/fi";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import Prices from "../components/prices";

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function Tickets() {
  return (
    <div className="page-container site-page-container">
      <main id="main-content" className="content-page tickets-page" tabIndex="-1">
        <section className="page-hero">
          <div className="page-hero-copy">
            <span className="section-eyebrow">Plan your visit</span>
            <h1>Tickets & pricing</h1>
            <p>
              Check admission prices, review online order details, and continue
              to the FGB ticketing portal when you are ready to choose a show.
            </p>
          </div>
          <div className="page-hero-aside">
            <strong>Skip the box-office line</strong>
            Purchase ahead, keep your confirmation handy, and bring it directly
            to the ticket-taker or the ticket window.
          </div>
        </section>

        <motion.section
          className="ticket-purchase-panel page-section"
          aria-labelledby="ticket-prices-heading"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={cardVariants}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="purchase-panel-heading">
            <span className="purchase-icon" aria-hidden="true">
              <FaTicketSimple />
            </span>
            <div>
              <span className="purchase-kicker">Ticket Prices</span>
              <h2 id="ticket-prices-heading">Admission at a glance</h2>
            </div>
          </div>

          <Prices />

          <a
            href="https://app.formovietickets.com/?id=fgbtheatres"
            target="_blank"
            rel="noopener noreferrer"
            className="buy-button"
          >
            <span>Buy tickets online</span>
            <FiArrowUpRight aria-hidden="true" />
          </a>
        </motion.section>

        <section className="ticket-policies page-section" aria-labelledby="ticket-policy-heading">
          <div className="page-section-heading">
            <div>
              <span className="section-eyebrow">Before checkout</span>
              <h2 id="ticket-policy-heading">Online ticket information</h2>
            </div>
          </div>

          <div className="tickets-policy-grid">
            <motion.article
              className="ticket-policy-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              variants={cardVariants}
              transition={{ duration: 0.45 }}
            >
              <FiMail className="policy-icon" aria-hidden="true" />
              <h3>Confirmation & entry</h3>
              <p>
                When you purchase online, a confirmation email will be sent with
                barcodes and a 12-digit purchase number.
              </p>
              <br />
              <p>Take this barcode to either the ticket counter or to the projectionist in the doorway.</p>
            </motion.article>

            <motion.article
              className="ticket-policy-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              variants={cardVariants}
              transition={{ duration: 0.45, delay: 0.06 }}
            >
              <FaRegCreditCard className="policy-icon" aria-hidden="true" />
              <h3>Ordering & pickup</h3>
              <p>
                Check the date and showtime carefully. Tickets are valid only for
                the performance purchased. A credit card is required and a
                non-refundable $1.00 service fee applies to each ticket.
              </p>
              <p>
                Some email providers may block the confirmation message; that
                does not necessarily mean the transaction failed. Bring the
                confirmation or the card used to purchase.
              </p>
            </motion.article>

            <motion.article
              className="ticket-policy-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              variants={cardVariants}
              transition={{ duration: 0.45, delay: 0.12 }}
            >
              <IoShieldCheckmarkOutline className="policy-icon" aria-hidden="true" />
              <h3>Cancellations</h3>
              <p>
                Present the same credit card at the theater for refunds,
                cancellations, or exchanges. Third-party service charges are not
                refundable.
              </p>
            </motion.article>
          </div>

          <div className="ticket-policy-alert">
            <strong>Refund timing</strong>
            <p>
              Refunds can only be issued on or before the specific start time on
              the purchased ticket. If you cannot attend, contact the theater
              before showtime at <a href="tel:18022234778">(802) 223-4778</a>.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Tickets;
