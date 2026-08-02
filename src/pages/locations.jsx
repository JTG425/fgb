import "../pagestyles/locations.css";
import { Suspense, useContext } from "react";
import { motion } from "framer-motion";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { MdOutlineAccessTime } from "react-icons/md";
import Map, { Marker } from "react-map-gl";
import { Context } from "../App";

function TheaterMap({ latitude, longitude, label }) {
  const key = import.meta.env.VITE_MAPBOX_API_KEY;
  const { theme } = useContext(Context);

  return (
    <Map
      className="Map"
      mapboxAccessToken={key}
      initialViewState={{ longitude, latitude, zoom: 14 }}
      style={{ width: "100%", height: "100%" }}
      mapStyle={`mapbox://styles/mapbox/${theme}-v11`}
      aria-label={`${label} map`}
    >
      <Marker latitude={latitude} longitude={longitude} />
    </Map>
  );
}

const locations = [
  {
    name: "Capitol Theater",
    city: "Montpelier, Vermont",
    address: "93 State St, Montpelier, VT 05602",
    phoneDisplay: "(802) 229-0343",
    phoneHref: "tel:18022290343",
    latitude: 44.26092378286133,
    longitude: -72.57836915903455,
  },
  {
    name: "Paramount Theater",
    city: "Barre, Vermont",
    address: "237 N Main St, Barre, VT 05641",
    phoneDisplay: "(802) 479-0078",
    phoneHref: "tel:18024790078",
    latitude: 44.19952086200256,
    longitude: -72.50370899940566,
  },
];

function Locations() {
  return (
    <div className="page-container site-page-container">
      <main id="main-content" className="content-page locations-page" tabIndex="-1">
        <section className="page-hero">
          <div className="page-hero-copy">
            <span className="section-eyebrow">Montpelier, VT • Barre, VT</span>
            <h1>Our Locations</h1>
            <p>
              Plan your next movie night at our downtown locations in
              Montpelier and Barre.
            </p>
          </div>
          <div className="page-hero-aside hours-summary">
            <MdOutlineAccessTime aria-hidden="true" />
            <div>
              <strong>Box-office hours</strong>
              Opens 30 minutes before the first show and remains open for 20
              minutes after the last show begins.
            </div>
          </div>
        </section>

        <section className="locations-section page-section" aria-labelledby="location-list-heading">
          <div className="page-section-heading">
            <div>
              <span className="section-eyebrow">Choose your theater</span>
              <h2 id="location-list-heading">Two downtown theaters</h2>
            </div>
            <p>
              Call either box office for location-specific questions, or explore
              the maps below before your visit.
            </p>
          </div>
          <div className="location-grid">
            {locations.map((location, index) => (
              <motion.article
                className="location-card"
                key={location.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <div className="location-card-heading">
                  <span className="location-number">0{index + 1}</span>
                  <div>
                    <span>{location.city}</span>
                    <h3>{location.name}</h3>
                  </div>
                </div>

                <div className="location-map-frame">
                  <Suspense fallback={<div className="map-loading">Loading map…</div>}>
                    <TheaterMap
                      latitude={location.latitude}
                      longitude={location.longitude}
                      label={location.name}
                    />
                  </Suspense>
                </div>

                <div className="location-details">
                  <p>
                    <FaLocationDot aria-hidden="true" />
                    <span>{location.address}</span>
                  </p>
                  <a href={location.phoneHref} className="call">
                    <FaPhoneAlt aria-hidden="true" />
                    <span>{location.phoneDisplay}</span>
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Locations;
