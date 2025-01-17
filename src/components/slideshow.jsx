import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import firstSlide from "../assets/firstSlide.png";
import "../componentstyles/slideshow.css";
import icon8 from "../assets/8.png";

const SlideShow = (props) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const slideshow = props.slideshow;

  const imageVariants = {
    hidden: {
      opacity: 0,
      zIndex: 0,
    },
    visible: {
      opacity: 1,
      zIndex: 2,
    },
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((currentImageIndex + 1) % slideshow.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [currentImageIndex]);

  return (
    <div className="slideshow-container">
      {slideshow.map((slide, index) => (
        <motion.div
          className="slideshow-div"
          key={`slideshow-div-${index}`}
          initial="hidden"
          animate={currentImageIndex === index ? "visible" : "hidden"}
          variants={imageVariants}
          style={{
            backgroundImage: currentImageIndex === 0 ? `url(${firstSlide})` : `url(${slide.Background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div
            key={`slideshow-content-${index}`}
            className="slideshow-content-container"
          >
            <div
              key={`slideshow-content-${index}`}
              className="slideshow-content"
            >
              {slide.Image === "" ? null : (
                <img
                  key={`slide-image-${index}`}
                  className="slide-image"
                  src={slide.Image}
                />
              )}
              {/* <img
                key={`slide-image-${index}`}
                className='slide-image'
                src={slide.Image}

              /> */}
              <div key={`slide-text-div-${index}`} className="slide-text-div">
                <h2 key={`slide-title-${index}`} className="slide-title">
                  {slide.Title}
                </h2>
                <p key={`slide-text-${index}`} className="slide-text">
                  {slide.Description}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
      <div className="slideshow-buttons">
        <button
          key={`slideshow-button-left`}
          className="slideshow-button"
          onClick={() =>
            setCurrentImageIndex(currentImageIndex === 0 ? slideshow.length - 1 : (currentImageIndex - 1) % slideshow.length)
          }
        >
        </button>
        <button
          key={`slideshow-button-right`}
          className="slideshow-button"
          onClick={() =>
            setCurrentImageIndex((currentImageIndex + 1) % slideshow.length)
          }
        >
        </button>
      </div>
    </div>
  );
};

export default SlideShow;
