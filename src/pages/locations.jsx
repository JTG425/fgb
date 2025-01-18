import "../pagestyles/locations.css";
import "../pagestyles/home.css";
import React, { Suspense } from "react";
import { motion } from "framer-motion";
import { FaPhoneAlt } from "react-icons/fa";
import Map, { Marker } from "react-map-gl";
import masks from "../assets/16.png";
import stars from "../assets/12.png";

function CapitolMap() {
  const key = import.meta.env.VITE_MAPBOX_API_KEY;
  return (
    <Map
      className="Map"
      mapboxAccessToken={key}
      initialViewState={{
        longitude: -72.57836915903455,
        latitude: 44.26092378286133,
        zoom: 14,
      }}
      style={{ width: "400px", height: "400px" }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    >
      <Marker latitude={44.26092378286133} longitude={-72.57836915903455} />
    </Map>
  );
}

function ParamountMap() {
  const key = import.meta.env.VITE_MAPBOX_API_KEY;
  return (
    <Map
      className="Map"
      mapboxAccessToken={key}
      initialViewState={{
        longitude: -72.50370899940566,
        latitude: 44.19952086200256,
        zoom: 14,
      }}
      style={{ width: "400px", height: "400px" }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    >
      <Marker latitude={44.19952086200256} longitude={-72.50370899940566} />
    </Map>
  );
}

function Locations(props) {
  return (
    <div className="page-container">
      <div className="locations">
        <img className="masks-icon" src={masks} />
        <img className="stars-icon" src={stars} />
        <h2>Locations</h2>
        <span className="info">
          <p>
            <b>Hours of Operation:</b> The box office opens 30 minutes before
            the show and remains open for 20 minutes after the last show of the
            day.
          </p>
        </span>
        <div className="maps">
          <motion.div className="cap-map">
            <h3>Capitol Theaters</h3>
            <p>93 State St, Montpelier, VT 05602</p>
            <br />
            <div className="map-container">
              <Suspense fallback={<div>Loading...</div>}>
                <CapitolMap />
              </Suspense>
            </div>
            <div className="map-cover"></div>
            <motion.a href="tel:18022290343" className="call">
              <span className="call-content">
                <FaPhoneAlt />
                <p>(802)-229-0343</p>
              </span>
            </motion.a>
          </motion.div>
          <motion.div className="par-map">
            <h3>Paramount Theaters</h3>
            <p>237 N Main St, Barre, VT 05641</p>
            <br />
            <div className="map-container">
              <Suspense fallback={<div>Loading...</div>}>
                <ParamountMap />
              </Suspense>
            </div>
            <div className="map-cover"></div>
            <motion.a href="tel:18024790078" className="call">
              <span className="call-content">
                <FaPhoneAlt />
                <p>(802)-479-0078</p>
              </span>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Locations;
