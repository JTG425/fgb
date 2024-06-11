import { useState, useEffect } from 'react'
import { motion } from "framer-motion";
import '../pagestyles/tickets.css'

function Gift(props) {
    const buttonVariants = {
        hovered: {
            background: "#940303",
            color: "#fbfbfb",
            boxShadow: "0px 0px 10px 0px rgba(148, 3, 3, 0.75)",
        },
        nothovered: {
            background: "#fbfbfb",
            color: "#940303",
            boxShadow: "0px 0px 0px 0px rgba(148, 3, 3, 0)",
        },
    }
    return (
        <div className='rentals-and-gifts-container'>
            <div className='gift-card'>
                <img
                    src="https://fgbtheatersstoragef2bb9-dev.s3.amazonaws.com/public/gifts/MovieCard.png"
                    alt="gift card"
                />
                <span className='gift-card-text'>
                    <span className='card-header'>
                        <h4>Movie Cards</h4>
                        <h5>Give the Gift of A Night Out At The Movies!</h5>
                    </span>

                    <span className='card-body'>
                        <p>Our versatile Movie Cards can be purchased at the box office in Barre at the Paramount, and in Montpelier at the Capitol Theater. Buy online today, or place an order by phone during business hours to receive a movie card by mail - 802-223-4778. Cards are sold at the value of your choice from $20-$200 per card. Good at both box office and concession stands with NO restrictions! The perfect gift card keeps getting better.</p>
                        <p><b>Replenish with $25 or more and receive a FREE MEDIUM POPCORN.</b></p>
                    </span>
                    <span className='card-footer'>
                        <a
                            href="https://61849.formovietickets.com:2235/app/rtsweb/gift"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <motion.button
                                className='gift-rentals-button'
                                initial="nothovered"
                                whileHover="hovered"
                                variants={buttonVariants}
                                whileTap={{ scale: 0.98 }}
                            >
                                Buy Now</motion.button>
                        </a>
                    </span>
                </span>
            </div>
        </div>
    )
}

export default Gift;
