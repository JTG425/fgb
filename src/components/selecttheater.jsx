"use client";

import { motion } from "framer-motion";
import "../componentstyles/selecttheater.css";

const THEATERS = [
  { id: "capitol", label: "Capitol Theater", town: "Montpelier" },
  { id: "paramount", label: "Paramount Theater", town: "Barre" },
];

const sliderVariants = {
  capitol: { x: 0 },
  paramount: { x: "100%" },
};

const SelectTheater = ({ selected, setSelected }) => {
  return (
    <div
      className="select-theater-container"
      role="tablist"
      aria-label="Choose a theater"
    >
      {THEATERS.map(({ id, label, town }) => (
        <button
          key={id}
          role="tab"
          aria-selected={selected === id}
          className={`toggle-button${selected === id ? " selected" : ""}`}
          onClick={() => setSelected(id)}
        >
          <span className="toggle-label">{label}</span>
          <span className="toggle-town">{town}, VT</span>
        </button>
      ))}
      <motion.span
        className="toggle-slider"
        initial={false}
        animate={selected}
        variants={sliderVariants}
        transition={{ type: "spring", damping: 22, stiffness: 300 }}
        aria-hidden="true"
      />
    </div>
  );
};

export default SelectTheater;
