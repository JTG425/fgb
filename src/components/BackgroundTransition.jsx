import { memo } from "react";
import { motion } from "motion/react";
import React, { forwardRef } from "react";

export const BackgroundTransition = forwardRef(({ slide, transitionKey }, ref) => {
  const isFirstSlide =
    slide.Background === "https://fgbtheatersstoragec850c-main.s3.us-east-1.amazonaws.com/public/slideshow/firstSlide.webp";
  const gradient =
    !isFirstSlide &&
    `linear-gradient(75deg, ${slide.Background[0]}, ${slide.Background[1]}, ${slide.Background[2]})`;

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
        background: isFirstSlide ? "#262626" : gradient,
      }}
    >
      {isFirstSlide && (
        <motion.img
          src="https://fgbtheatersstoragec850c-main.s3.us-east-1.amazonaws.com/public/slideshow/firstSlide.webp"
          alt="First Slide"
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

export default memo(BackgroundTransition);
