import React, { useState, useEffect } from 'react';
import { CiCalendar } from "react-icons/ci";
import { motion, AnimatePresence } from "framer-motion";
import '../componentstyles/customDatePicker.css';

const CustomDatepicker = ({ setDate }) => {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [selectedDate, setSelectedDate] = useState(today);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Helper function to format the display date on the button
    const formatDisplayDate = (dateObj) => {
        const monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const mm = dateObj.getMonth() + 1;
        const dd = dateObj.getDate();
        const yyyy = dateObj.getFullYear();

        const monthStr = monthNamesShort[mm - 1] || '';

        const getSuffix = (day) => {
            if ([11, 12, 13].includes(day)) return 'th';
            switch (day % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };
        const suffix = getSuffix(dd);

        return `${monthStr} ${dd}${suffix} ${yyyy}`;
    };

    const [buttonText, setButtonText] = useState(formatDisplayDate(today));

    useEffect(() => {
        // On mount, set today's date as default and inform parent
        if (setDate) setDate(today);
        setButtonText(formatDisplayDate(today));
    }, []);

    const getDaysInMonth = (month, year) => {
        const date = new Date(year, month, 1);
        const days = [];
        const firstDayIndex = date.getDay();
        const lastDay = new Date(year, month + 1, 0).getDate();

        for (let x = 0; x < firstDayIndex; x++) {
            days.push(null);
        }
        for (let d = 1; d <= lastDay; d++) {
            days.push(d);
        }
        return days;
    };

    const days = getDaysInMonth(currentMonth, currentYear);

    const handlePrevMonth = () => {
        let newMonth = currentMonth - 1;
        let newYear = currentYear;
        if (newMonth < 0) {
            newMonth = 11;
            newYear = currentYear - 1;
        }
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
    };

    const handleNextMonth = () => {
        let newMonth = currentMonth + 1;
        let newYear = currentYear;
        if (newMonth > 11) {
            newMonth = 0;
            newYear = currentYear + 1;
        }
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
    };

    const handleSelectDate = (day) => {
        if (!day) return;

        const chosenDate = new Date(currentYear, currentMonth, day);
        const chosenDateMidnight = new Date(chosenDate.getFullYear(), chosenDate.getMonth(), chosenDate.getDate());
        const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        // Only allow today's date or future dates
        if (chosenDateMidnight.getTime() < todayMidnight.getTime()) return;

        setSelectedDate(chosenDate);
        if (setDate) setDate(chosenDate);
        setButtonText(formatDisplayDate(chosenDate));
        setShowDatePicker(false);
    };

    const toggleDatePicker = () => {
        setShowDatePicker((prev) => !prev);
    };

    // Framer Motion variants for the toggle button
    const buttonVariants = {
        hovered: {
          backgroundColor: "var(--primary)",
          color: "var(--foreground)",
          boxShadow: "0px 0px 10px rgba(148, 3, 3, 0.5)",
          transition: { duration: 0.2 }
        },
        nothovered: {
          backgroundColor: "var(--foreground)",
          color: "var(--copy)",
          boxShadow: "var(--box-shadow)",
          transition: { duration: 0.2 }
        },
    };

    // Framer Motion container variants
    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.3 }
        },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
    };

    return (
        <div className="datepicker-wrapper">
            <motion.button
                key='datepicker-button'
                className="datepicker-button"
                variants={buttonVariants}
                initial="nothovered"
                whileHover="hovered"
                whileTap="nothovered"
                onClick={toggleDatePicker}
            >
                <CiCalendar size='25px' />
                {buttonText}
            </motion.button>

            <AnimatePresence>
            {showDatePicker && (
                <motion.div
                    className='datepicker-background'
                    onClick={() => setShowDatePicker(false)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div
                        className="datepicker-container"
                        onClick={(e) => e.stopPropagation()} // Prevent clicks inside container from closing datepicker
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <div className="datepicker-header">
                            <button className="month-nav prev" onClick={handlePrevMonth}>&lt;</button>
                            <div className="current-month">
                                {monthNames[currentMonth]} {currentYear}
                            </div>
                            <button className="month-nav next" onClick={handleNextMonth}>&gt;</button>
                        </div>
                        <div className="datepicker-grid">
                            <div className="datepicker-day-label">Sun</div>
                            <div className="datepicker-day-label">Mon</div>
                            <div className="datepicker-day-label">Tue</div>
                            <div className="datepicker-day-label">Wed</div>
                            <div className="datepicker-day-label">Thu</div>
                            <div className="datepicker-day-label">Fri</div>
                            <div className="datepicker-day-label">Sat</div>

                            {days.map((day, idx) => {
                                const cellDate = day ? new Date(currentYear, currentMonth, day) : null;
                                const cellDateCompare = cellDate ? new Date(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate()) : null;
                                const todayCompare = new Date(today.getFullYear(), today.getMonth(), today.getDate());

                                const isToday = cellDateCompare && cellDateCompare.getTime() === todayCompare.getTime();
                                const isSelected = cellDateCompare && selectedDate &&
                                    cellDateCompare.getTime() === new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()).getTime();

                                const isDisabled = cellDateCompare && cellDateCompare.getTime() < todayCompare.getTime();

                                return (
                                    <motion.div
                                        key={idx}
                                        className={[
                                            'datepicker-cell',
                                            isToday ? 'today' : '',
                                            isSelected ? 'selected' : '',
                                            isDisabled ? 'disabled' : ''
                                        ].join(' ')}
                                        onClick={() => !isDisabled && handleSelectDate(day)}
                                        whileHover={{ scale: !isDisabled ? 1.08 : 1, transition: { duration: 0.1 } }}
                                        whileTap={{ scale: !isDisabled ? 0.95 : 1 }}
                                    >
                                        {day || ''}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
};

export default CustomDatepicker;
