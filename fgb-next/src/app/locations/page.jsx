"use client";

import "@/styles/pagestyles/locations.css";
import dynamic from "next/dynamic";
import { motion as m } from "framer-motion";
import { FaPhoneAlt } from "react-icons/fa";

// mapbox-gl touches `window` at import time, so the map must only load
// in the browser (never during server rendering).
const TheaterMap = dynamic(() => import("@/components/theaterMap"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

const buttonVariants = {
  hovered: {
    background: "var(--primary)",
    color: "#fbfbfb",
    boxShadow: "0px 0px 10px 0px rgba(148, 3, 3, 0.75)",
  },
  nothovered: {
    background: "var(--foreground)",
    color: "var(--copy)",
    boxShadow: "0px 0px 0px 0px rgba(148, 3, 3, 0)",
  },
};

const THEATERS = [
  {
    name: "Capitol Theaters",
    address: "93 State St, Montpelier, VT 05602",
    longitude: -72.57836915903455,
    latitude: 44.26092378286133,
    phoneHref: "tel:18022290343",
    phoneDisplay: "(802)-229-0343",
  },
  {
    name: "Paramount Theaters",
    address: "237 N Main St, Barre, VT 05641",
    longitude: -72.50370899940566,
    latitude: 44.19952086200256,
    phoneHref: "tel:18024790078",
    phoneDisplay: "(802)-479-0078",
  },
];

export default function Locations() {
  return (
    <div className="page-container">
      <div className="locations">
        <img className="masks-icon" src="/assets/16.png" alt="" aria-hidden="true" />
        <img className="stars-icon" src="/assets/12.png" alt="" aria-hidden="true" />
        <h2>Locations</h2>
        <span className="info">
          <p>
            <b>Hours of Operation:</b> The box office opens 30 minutes before
            the show and remains open for 20 minutes after the last show of the
            day.
          </p>
        </span>
        <div className="maps">
          {THEATERS.map((theater) => (
            <div className="map" key={theater.name}>
              <h3>{theater.name}</h3>
              <p>{theater.address}</p>
              <br />
              <div className="map-container">
                <TheaterMap
                  longitude={theater.longitude}
                  latitude={theater.latitude}
                />
              </div>
              <m.a
                href={theater.phoneHref}
                className="call"
                whileHover="hovered"
                whileTap="hovered"
                initial="nothovered"
                variants={buttonVariants}
              >
                <span className="call-content">
                  <FaPhoneAlt />
                  <p>{theater.phoneDisplay}</p>
                </span>
              </m.a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
