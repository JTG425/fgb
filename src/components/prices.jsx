import { motion } from "framer-motion";
import '../componentstyles/prices.css';

const prices = {
    "Standard": {
        "Adult": "$12.84",
        "Child": "$9.63",
        "Senior": "$9.37",
        "Military": "$9.37"
    },
    "Matinee": {
        "Adult": "$9.37",
        "Child": "$9.37",
        "Senior": "$9.37",
        "Military": "$9.37"
    },
}

function Prices() {
    return (
        <div className='prices'>
            {Object.keys(prices).map((key) => (
                <div className="showtype" key={key}>
                    <p>{key}</p>
                    {Object.keys(prices[key]).map((subKey) => (
                        <div key={subKey} className='price-item'>
                            <p>{subKey}</p>
                            <p>{prices[key][subKey]}</p>
                        </div>
                    ))}
                </div>
            ))}

        </div>
    )
}

export default Prices;
