"use client";
import "../componentstyles/slideshow.css";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { wrap } from "@popmotion/popcorn";

const slideVariants = {
    enter: (direction) => ({
        x: direction > 0 ? "100%" : "-100%",
        scale: 0.75,
        opacity: 1,
    }),
    center: {
        x: "0%",
        scale: 1,
        opacity: 1,
    },
    exit: (direction) => ({
        x: direction > 0 ? "-100%" : "100%",
        scale: 0.75,
        opacity: 0,
    }),
};

export default function Slideshow(props) {
    const slideshowData = props.slideshowData
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState(0);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    useEffect(() => {
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
                        if (slide.Background) urls.push(slide.Background);
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

    const handleMove = (dir) => {
        setDirection(dir === "right" ? 1 : -1);
        const newIndex = wrap(0, slideshowData.length, currentSlide + (dir === "right" ? 1 : -1));
        setCurrentSlide(newIndex);
    };

    // Auto-slide every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            handleMove("right");
        }, 5000);
        return () => clearInterval(interval);
    }, [currentSlide]);


    return (
        <>
            <motion.div 
              className="slideshow" 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: "relative", overflow: "hidden" }}
              >
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={`slide-${currentSlide}`}
                        className="slide-current"
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.5 }}
                        style={{
                            backgroundImage: `url(${slideshowData[currentSlide].Background})`,
                            backgroundSize: "cover",
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                        }}
                    >
                        <div className="slideshow-controls">
                            <button onClick={() => handleMove("left")} />
                            <button onClick={() => handleMove("right")} />
                        </div>
                        <div className="blur" />
                        <div className="slide-content">

                            {slideshowData[currentSlide].Image !== "" ? (
                                <span className="slide-left">
                                    <img className="slide-image" src={slideshowData[currentSlide].Image} alt={slideshowData[currentSlide].Title} />
                                </span>
                            ) : null}

                            <span className="slide-right">
                                <h2>{slideshowData[currentSlide].Title}</h2>

                                <p>{slideshowData[currentSlide].Description}</p>
                            </span>
                        </div>
                    </motion.div>
                </AnimatePresence>
                {/* Pre-render incoming slides off-screen */}
                <motion.div
                    className="slide-incoming-left"
                    style={{
                        backgroundImage: `url(${slideshowData[wrap(0, slideshowData.length, currentSlide - 1)].Background})`,
                        backgroundSize: "cover",
                        objectFit: "cover",
                        position: "absolute",
                        top: 0,
                        left: "-100%",
                        width: "100%",
                        height: "100%",
                        opacity: 1,
                    }}
                ></motion.div>
                <motion.div
                    className="slide-incoming-right"
                    style={{
                        backgroundImage: `url(${slideshowData[wrap(0, slideshowData.length, currentSlide + 1)].Background})`,
                        backgroundSize: "contain",
                        objectFit: "cover",
                        position: "absolute",
                        top: 0,
                        right: "-100%",
                        width: "100%",
                        height: "100%",
                        opacity: 1,
                    }}
                ></motion.div>
            </motion.div>
        </>
    );
}
