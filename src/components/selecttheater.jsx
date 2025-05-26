// Source: https://www.hover.dev/components/toggles

import { motion } from "framer-motion";
import '../componentstyles/selecttheater.css';

const SelectTheater = (props) => {
    const selected = props.selected;
    const setSelected = props.setSelected;

    return (
        <div
            className='select-theater-container'
        >
            <SliderToggle selected={selected} setSelected={setSelected} />
        </div>
    );
};

const SliderToggle = ({ selected, setSelected }) => {
    const textVariants = {
        selected: {
            color: "#ffffff",
            fontSize: "0.80rem",
        },
        notselected: {
            color: "var(--copy)",
            fontSize: "0.75rem",
        },
        hovered: {
            color: "var(--copy-light)",
        }
    }

    const sliderVariants = {
        capitol: {
            x: 0,
        },
        paramount: {
            x: "100%",
        },
    };

    return (
        <div className="toggle-background">
            <button
                className="toggle-button"
                onClick={() => {
                    setSelected("capitol");
                }}
            >
                <motion.span
                    className="button-text"
                    initial='selected'
                    whileHover='hovered'
                ><motion.p
                    initial='selected'
                    whileHover='hovered'
                    animate={selected === 'capitol' ? 'selected' : 'notselected'}
                    variants={textVariants}
                    transition={{ duration: 0.25 }}
                >Capitol Theater</motion.p></motion.span>
            </button>
            <button
                className="toggle-button"
                onClick={() => {
                    setSelected("paramount");
                }}
            >
                <motion.span
                    className="button-text"
                    initial='notselected'
                    whileHover='hovered'
                    animate={selected === 'paramount' ? 'selected' : 'notselected'}
                    variants={textVariants}
                    transition={{ duration: 0.25 }}
                >
                    <motion.p
                        initial='notselected'
                        whileHover='hovered'
                        animate={selected === 'paramount' ? 'selected' : 'notselected'}
                        variants={textVariants}
                        transition={{ duration: 0.25 }}

                    >Paramount Theater</motion.p></motion.span>
            </button>
            <div
                className="toggle-slider"
            >
                <motion.span
                    initial='capitol'
                    animate={selected}
                    variants={sliderVariants}
                    transition={{ type: "spring", damping: 15, stiffness: 250 }}
                    className="slider"
                />
            </div>
        </div>
    );
};

export default SelectTheater;