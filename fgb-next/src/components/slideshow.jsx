"use client";

import "@/styles/componentstyles/slideshow.css";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BackgroundTransition from "./BackgroundTransition";

// Wrap an index into [min, max) — replaces the @popmotion/popcorn dependency.
const wrap = (min, max, value) => {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
};

const slideContentVariants = {
  enter: (direction) => ({
    x: direction > 0 ? "25%" : "-25%",
    opacity: 0,
    scale: 0.85,
  }),
  center: {
    x: "0%",
    opacity: 1,
    scale: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? "-25%" : "25%",
    opacity: 0,
    scale: 0.85,
  }),
};

export default function Slideshow({ slideshowData }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const slideshowRef = useRef(null);
  const slideCount = slideshowData?.length || 0;

  useEffect(() => {
    if (!slideshowData?.length) return;

    // Preload only the slide images (not the backgrounds)
    const preloadImage = (url) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = resolve;
        img.onerror = reject;
      });

    const preloadAll = async () => {
      try {
        await Promise.all(
          slideshowData
            .filter((slide) => slide.Image && slide.Image.trim() !== "")
            .map((slide) => preloadImage(slide.Image))
        );
      } catch (error) {
        console.error("Error preloading images", error);
      } finally {
        setImagesLoaded(true);
      }
    };

    preloadAll();
  }, [slideshowData]);

  // Handle slide transitions with safety checks
  const handleMove = (dir) => {
    if (isAnimating || !imagesLoaded) return;

    const newDirection = dir === "right" ? 1 : -1;
    setIsAnimating(true);
    setDirection(newDirection);
    setCurrentSlide((curr) => wrap(0, slideCount, curr + newDirection));
  };

  useEffect(() => {
    if (!imagesLoaded || slideCount <= 1) return;

    const interval = setInterval(() => {
      if (
        isAnimating ||
        (slideshowRef.current && slideshowRef.current.matches(":hover"))
      ) {
        return;
      }
      handleMove("right");
    }, 5000);

    return () => clearInterval(interval);
  }, [imagesLoaded, isAnimating, slideCount]);

  if (!slideshowData || slideshowData.length === 0) return null;

  const slide = slideshowData[currentSlide];

  return (
    <div
      className="slideshow"
      ref={slideshowRef}
      style={{ position: "relative", overflow: "hidden" }}
    >
      <AnimatePresence mode="popLayout">
        <BackgroundTransition
          key={`bg-${currentSlide}`}
          slide={slide}
          transitionKey={currentSlide}
        />
      </AnimatePresence>
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={`slide-${currentSlide}-${slide.Title}`}
          custom={direction}
          variants={slideContentVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, type: "spring" }}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
          onAnimationComplete={() => setIsAnimating(false)}
        >
          <div className="slideshow-controls">
            <button
              disabled={isAnimating}
              onClick={() => handleMove("left")}
              aria-label="Previous slide"
            />
            <button
              disabled={isAnimating}
              onClick={() => handleMove("right")}
              aria-label="Next slide"
            />
          </div>
          <div className="slide-content">
            {slide.Image !== "" && (
              <span className="slide-left">
                <img
                  className="slide-image"
                  src={slide.Image}
                  alt={slide.Title}
                />
              </span>
            )}
            <span className="slide-right">
              <h2>{slide.Title}</h2>
              <p>{slide.Description}</p>
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
