// Slideshow.jsx
"use client";
import "../componentstyles/slideshow.css";
import { useEffect, useState, useRef, memo, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { wrap } from "@popmotion/popcorn";
import BackgroundTransition from "./BackgroundTransition";

function Slideshow(props) {
  const slideshowData = props.slideshowData;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const slideshowRef = useRef(null);
  const slideCount = slideshowData?.length || 0;

  useEffect(() => {
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
          slideshowData.flatMap((slide) => {
            const urls = [];
            if (slide.Image && slide.Image.trim() !== "") urls.push(slide.Image);
            return urls.map(preloadImage);
          })
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
    setCurrentSlide(curr => wrap(0, slideCount, curr + newDirection));
  };

  // Variants for slide content (memoized)
  const slideContentVariants = useMemo(() => ({
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
  }), []);

  const blurVariants = useMemo(() => ({
    initial: { filter: "blur(10px)" },
    animate: { filter: "blur(0px)" },
  }), []);

  useEffect(() => {
    if (!imagesLoaded || slideCount <= 1) return;
    
    const interval = setInterval(() => {
      if (isAnimating || (slideshowRef.current && slideshowRef.current.matches(':hover'))) {
        return;
      }
      handleMove("right");
    }, 5000);
    
    return () => clearInterval(interval);
  }, [imagesLoaded, isAnimating, slideCount]);


  return (
    <div className="slideshow" ref={slideshowRef} style={{ position: "relative", overflow: "hidden" }}>
      <AnimatePresence mode="popLayout">
        <BackgroundTransition
          key={`bg-${currentSlide}`}
          slide={slideshowData[currentSlide]}
          transitionKey={currentSlide}
        />
      </AnimatePresence>
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={`slide-${currentSlide}-${slideshowData[currentSlide].Title}`}
          custom={direction}
          variants={slideContentVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, 
            type: "spring",
          }}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
          onAnimationComplete={() => setIsAnimating(false)}
        >
          <div className="slideshow-controls">
            <button disabled={isAnimating} onClick={() => handleMove("left")} />
            <button disabled={isAnimating} onClick={() => handleMove("right")} />
          </div>
          <div className="slide-content">
            {slideshowData[currentSlide].Image !== "" && (
              <span className="slide-left">
                <img
                  className="slide-image"
                  src={slideshowData[currentSlide].Image}
                  alt={slideshowData[currentSlide].Title}
                  loading="lazy"
                />
              </span>
            )}
            <span className="slide-right">
              <h2>{slideshowData[currentSlide].Title}</h2>
              <p>{slideshowData[currentSlide].Description}</p>
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default memo(Slideshow);
