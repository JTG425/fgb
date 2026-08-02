import { motion } from "framer-motion";
import "../pagestyles/rentals.css";
import { FaBirthdayCake, FaPhoneAlt, FaRegBuilding } from "react-icons/fa";
import { HiOutlineMegaphone } from "react-icons/hi2";
import { RiMovie2Line } from "react-icons/ri";

const offerings = [
  {
    title: "Events, meetings & schools",
    eyebrow: "Make it cinematic",
    Icon: FaRegBuilding,
    content: (
      <div className="rental-feature-list">
        <div>
          <strong>Special events</strong>
          <p>Put something big on the marquee and create a gathering guests will remember.</p>
        </div>
        <div>
          <strong>Business meetings</strong>
          <p>Present to groups of up to 200 in a comfortable auditorium setting.</p>
        </div>
        <div>
          <strong>Schools</strong>
          <p>Special group rates are available for parties of 80 or more.</p>
        </div>
      </div>
    ),
  },
  {
    title: "Birthday parties",
    eyebrow: "Celebrate together",
    Icon: FaBirthdayCake,
    content: (
      <>
        <div className="rental-price-callout">
          <strong>$16.75</strong>
          <span>per person · 6-person minimum</span>
        </div>
        <ul className="rental-benefits">
          <li>Reserved seating for the movie showing of your choice.</li>
          <li>Free movie ticket and kids pack for the birthday child.</li>
        </ul>
      </>
    ),
  },
  {
    title: "On-screen advertising",
    eyebrow: "Reach local audiences",
    Icon: HiOutlineMegaphone,
    content: (
      <p className="rental-card-copy">
        Showcase your business on the big screen. Through Screenvision,
        local cinema advertising connects your message with moviegoers before
        the feature begins.
      </p>
    ),
  },
];

function Rentals() {
  return (
    <div className="page-container site-page-container">
      <main id="main-content" className="content-page rentals-page" tabIndex="-1">
        <section className="page-hero">
          <div className="page-hero-copy">
            <span className="section-eyebrow">Your event, our screen</span>
            <h1>Rent the theater</h1>
            <p>
              Bring groups, celebrations, presentations, and local messages to
              a setting built to hold everyone’s attention.
            </p>
          </div>
          <div className="page-hero-aside rental-hero-aside">
            <RiMovie2Line aria-hidden="true" />
            <div>
              <strong>Start with the Capitol team</strong>
              Tell us what you are planning and we will help you understand the
              available theater options.
            </div>
          </div>
        </section>

        <section className="rental-contact-banner page-section" aria-label="Rental contact">
          <div>
            <span>Ready to start planning?</span>
            <h2>Give us a call to schedule today</h2>
          </div>
          <a href="tel:18025223576" className="rentals-phone-link">
            <FaPhoneAlt aria-hidden="true" />
            <span>(802) 522-3576</span>
          </a>
        </section>

        <section className="rental-options page-section" aria-labelledby="rental-options-heading">
          <div className="page-section-heading">
            <div>
              <span className="section-eyebrow">Ways to use the space</span>
              <h2 id="rental-options-heading">More than movie night</h2>
            </div>
            <p>Flexible options for private groups, community events, and local businesses.</p>
          </div>

          <div className="rental-card-grid">
            {offerings.map(({ title, eyebrow, Icon, content }, index) => (
              <motion.article
                className="rental-info-card"
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.48, delay: index * 0.07 }}
              >
                <Icon className="rental-card-icon" aria-hidden="true" />
                <span className="rental-card-eyebrow">{eyebrow}</span>
                <h3>{title}</h3>
                {content}
              </motion.article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Rentals;
