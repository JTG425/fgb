"use client";

import { motion } from "framer-motion";
import { forwardRef } from "react";

export const BackgroundTransition = forwardRef(({ slide, transitionKey }, ref) => {
  // A string Background is an image URL (announcement slides); an array is a
  // color palette extracted from the movie poster (movie slides).
  const isImageBackground =
    typeof slide.Background === "string" && slide.Background.trim() !== "";
  const hasPalette =
    Array.isArray(slide.Background) && slide.Background.length >= 3;
  const gradient = hasPalette
    ? `linear-gradient(75deg, ${slide.Background[0]}, ${slide.Background[1]}, ${slide.Background[2]})`
    : "#262626";

  return (
    <motion.div
      ref={ref}
      key={transitionKey}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: isImageBackground ? "#262626" : gradient,
      }}
    >
      {isImageBackground && (
        <motion.img
          src={slide.Background}
          alt=""
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(10px)",
          }}
        />
      )}
    </motion.div>
  );
});

BackgroundTransition.displayName = "BackgroundTransition";

export default BackgroundTransition;
