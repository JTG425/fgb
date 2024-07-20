import { motion } from "framer-motion";
import '../pagestyles/tickets.css'
import soda from "../assets/5.png";
import popcornbucket from "../assets/6.png";
import { GiSodaCan } from "react-icons/gi";
import { TbCandy } from "react-icons/tb";



function Concessions(props) {
    return (
        <div className='concessions'>
            <h4>Concessions</h4>
            <span className="concessions-header-buttons">
            <motion.button className="concessions-button" 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}>
                <img className='popcorn' src={popcornbucket} alt="soda" />
            </motion.button>
            <motion.button className="concessions-button" 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}>
                <img className='soda' src={soda} alt="soda" />
            </motion.button>
            <motion.button className="concessions-button" 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}>
                <TbCandy className='concession-icon' />
            </motion.button>
            <motion.button className="concessions-button" 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}>
                <GiSodaCan className='concession-icon' />
            </motion.button>
            </span>
        </div>
    )
}

export default Concessions;
