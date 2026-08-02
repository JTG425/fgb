"use client";

import "../componentstyles/slideshow.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { wrap } from "@popmotion/popcorn";
import {
  IoChevronBack,
  IoChevronForward,
  IoPause,
  IoPlay,
} from "react-icons/io5";
import BackgroundTransition from "./BackgroundTransition";

export default function Slideshow({ slideshowData }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const slideshowRef = useRef(null);
  const slideCount = slideshowData?.length || 0;
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) setIsPaused(true);
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (!slideshowData?.length) return;

    const preloadImage = (url) =>
      new Promise((resolve, reject) => {
        const image = new Image();
        image.src = url;
        image.onload = resolve;
        image.onerror = reject;
      });

    const preloadAll = async () => {
      try {
        await Promise.all(
          slideshowData.flatMap((slide) =>
            slide.Image?.trim() ? [preloadImage(slide.Image)] : []
          )
        );
      } catch (error) {
        console.error("Error preloading images", error);
      } finally {
        setImagesLoaded(true);
      }
    };

    preloadAll();
  }, [slideshowData]);

  const handleMove = useCallback((nextDirection, announce = false) => {
    if (isAnimating || !imagesLoaded || slideCount <= 1) return;

    const step = nextDirection === "right" ? 1 : -1;
    const nextSlide = wrap(0, slideCount, currentSlide + step);
    setIsAnimating(true);
    setDirection(step);
    setCurrentSlide(nextSlide);
    if (announce) {
      setAnnouncement(
        `Featured slide ${nextSlide + 1} of ${slideCount}: ${slideshowData[nextSlide]?.Title || "Untitled"}`
      );
    }
  }, [currentSlide, imagesLoaded, isAnimating, slideCount, slideshowData]);

  const handleSelectSlide = (index) => {
    if (index === currentSlide || isAnimating) return;
    setDirection(index > currentSlide ? 1 : -1);
    setIsAnimating(true);
    setCurrentSlide(index);
    setAnnouncement(
      `Featured slide ${index + 1} of ${slideCount}: ${slideshowData[index]?.Title || "Untitled"}`
    );
  };

  useEffect(() => {
    if (!imagesLoaded || slideCount <= 1 || isPaused) return;

    const interval = setInterval(() => {
      if (
        !isAnimating &&
        !document.hidden &&
        !(slideshowRef.current && slideshowRef.current.matches(":hover, :focus-within"))
      ) {
        handleMove("right");
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [handleMove, imagesLoaded, isAnimating, isPaused, slideCount]);

  if (!slideCount) return null;

  const slide = slideshowData[currentSlide];
  const hasImage = Boolean(slide.Image?.trim());

  const slideContentVariants = {
    enter: (slideDirection) => ({
      x: shouldReduceMotion ? 0 : slideDirection > 0 ? "7%" : "-7%",
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (slideDirection) => ({
      x: shouldReduceMotion ? 0 : slideDirection > 0 ? "-5%" : "5%",
      opacity: 0,
    }),
  };

  return (
    <section
      className="slideshow"
      ref={slideshowRef}
      aria-label="Featured movies and announcements"
    >
      <AnimatePresence mode="popLayout">
        <BackgroundTransition
          key={`bg-${currentSlide}`}
          slide={slide}
          transitionKey={currentSlide}
        />
      </AnimatePresence>

      <button
        type="button"
        className="slideshow-nav slideshow-nav-previous"
        disabled={isAnimating || slideCount <= 1}
        onClick={() => handleMove("left", true)}
        aria-label="Previous featured slide"
      >
        <IoChevronBack aria-hidden="true" />
      </button>

      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={`slide-${currentSlide}-${slide.Title}`}
          className="slide-stage"
          custom={direction}
          variants={slideContentVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration: shouldReduceMotion ? 0 : 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          onAnimationComplete={() => setIsAnimating(false)}
        >
          <div
            className={`slide-content${hasImage ? "" : " slide-content-no-image"}`}
          >
            {hasImage && (
              <div className="slide-left">
                <img
                  className="slide-image"
                  src={slide.Image}
                  alt={slide.Title || "Featured movie"}
                />
              </div>
            )}

            <div className="slide-right">
              <div className="slide-title">{slide.Title}</div>
              {slide.Description && <p>{slide.Description}</p>}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        type="button"
        className="slideshow-nav slideshow-nav-next"
        disabled={isAnimating || slideCount <= 1}
        onClick={() => handleMove("right", true)}
        aria-label="Next featured slide"
      >
        <IoChevronForward aria-hidden="true" />
      </button>

      {slideCount > 1 && (
        <div className="slideshow-controls">
          <button
            type="button"
            className="slideshow-autoplay"
            onClick={() => setIsPaused((paused) => !paused)}
            aria-label={isPaused ? "Play featured slides" : "Pause featured slides"}
            aria-pressed={isPaused}
          >
            {isPaused ? <IoPlay aria-hidden="true" /> : <IoPause aria-hidden="true" />}
          </button>
          <div className="slideshow-pagination" aria-label="Choose a featured slide">
            {slideshowData.map((item, index) => (
              <button
                type="button"
                key={`${item.Title}-${index}`}
                className={index === currentSlide ? "active" : ""}
                onClick={() => handleSelectSlide(index)}
                aria-label={`Show featured slide ${index + 1}: ${item.Title}`}
                aria-current={index === currentSlide ? "true" : undefined}
              />
            ))}
          </div>
        </div>
      )}

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
    </section>
  );
}
