import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import '../pagestyles/about.css'

function About() {
  const [currentImage, setCurrentImage] = useState(0);
  const [images, setImages] = useState([
    "https://fgbtheatersstoragef2bb9-dev.s3.amazonaws.com/public/Other/about1.png",
    "https://fgbtheatersstoragef2bb9-dev.s3.amazonaws.com/public/Other/about2.png"
  ]);
  const length = images.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage(currentImage === length - 1 ? 0 : currentImage + 1);
    }, 10000);
    return () => clearInterval(interval);
  }, [currentImage]);


  return (
    <div className='page-container'>
      <div className='about-container'>
        <h1>About Us</h1>

        <div className='about-image-container'>
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          src={images[currentImage]}
          alt='about'
          className='about-image'
        />
        </div>
        <span className='about-text-container'>
          <p>FGB Theaters, including the Capitol Theater and Paramount Theater, are family owned and operated movie Theaters located in the heart of Vermont.</p>
          <p>Opened in 1980, our two locations have been a staple of downtown Montpelier and Barre VT, bringing the most popular and anticipated movies to our audience for decades</p>
          <p>Our theaters are equipped with the latest in digital projection and sound technology, providing our customers with a first class movie going experience </p>
        </span>
      </div>
    </div>
  )
}

export default About;
