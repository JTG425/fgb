import { useState, useEffect } from 'react'
import { motion } from "framer-motion";
import '../pagestyles/rentalsandgifts.css'
import Gift from './gift.jsx'
import Rentals from './rentals'

function RentalsAndGifts(props) {
    return (
        <div className='page-container'>
            <Gift />
            <Rentals />
        </div>
    )
}

export default RentalsAndGifts;
