"use client";

import { useEffect, useRef, useState } from "react";
import { CiCalendar } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import "../componentstyles/customDatePicker.css";

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, scale: 0.95, y: 12, transition: { duration: 0.2 } },
};

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const monthNamesShort = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const getSuffix = (day) => {
  if ([11, 12, 13].includes(day)) return "th";
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
};

const formatDisplayDate = (dateObj) => {
  const mm = dateObj.getMonth() + 1;
  const dd = dateObj.getDate();
  const yyyy = dateObj.getFullYear();
  const monthStr = monthNamesShort[mm - 1] || "";
  return `${monthStr} ${dd}${getSuffix(dd)} ${yyyy}`;
};

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

const atMidnight = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const CustomDatepicker = ({ setDate, value }) => {
  const today = new Date();
  const initialDate = value instanceof Date ? value : today;
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const triggerRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) return;
    setSelectedDate(value);
    setCurrentMonth(value.getMonth());
    setCurrentYear(value.getFullYear());
  }, [value]);

  useEffect(() => {
    if (!showDatePicker) return undefined;

    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    document.body.style.overflow = "hidden";

    const focusFrame = window.requestAnimationFrame(() => {
      const selectedButton = dialogRef.current?.querySelector("[data-selected='true']");
      const firstAvailableDate = dialogRef.current?.querySelector(
        ".datepicker-cell:not(:disabled):not(.empty)"
      );
      (selectedButton || firstAvailableDate)?.focus();
    });

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setShowDatePicker(false);
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll("button:not(:disabled)")
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [showDatePicker]);

  const days = getDaysInMonth(currentMonth, currentYear);
  const todayTime = atMidnight(today).getTime();
  const selectedTime = atMidnight(selectedDate).getTime();

  const handlePrevMonth = () => {
    setCurrentMonth((m) => (m === 0 ? 11 : m - 1));
    if (currentMonth === 0) setCurrentYear((y) => y - 1);
  };

  const handleNextMonth = () => {
    setCurrentMonth((m) => (m === 11 ? 0 : m + 1));
    if (currentMonth === 11) setCurrentYear((y) => y + 1);
  };

  const handleSelectDate = (day) => {
    if (!day) return;
    const chosenDate = new Date(currentYear, currentMonth, day);

    // Only allow today's date or future dates
    if (atMidnight(chosenDate).getTime() < todayTime) return;

    setSelectedDate(chosenDate);
    if (setDate) setDate(chosenDate);
    setShowDatePicker(false);
  };

  return (
    <div className="datepicker-wrapper">
      <button
        type="button"
        className="datepicker-button"
        ref={triggerRef}
        onClick={() => setShowDatePicker((prev) => !prev)}
        aria-haspopup="dialog"
        aria-expanded={showDatePicker}
        aria-label={`Choose show date, selected ${formatDisplayDate(selectedDate)}`}
      >
        <CiCalendar size="22px" aria-hidden="true" />
        {formatDisplayDate(selectedDate)}
      </button>

      <AnimatePresence>
        {showDatePicker && (
          <motion.div
            className="datepicker-background"
            onClick={() => setShowDatePicker(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              className="datepicker-container"
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="datepicker-title"
              onClick={(e) => e.stopPropagation()}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="datepicker-dialog-heading">
                <div>
                  <span>Showtimes</span>
                  <h2 id="datepicker-title">Choose a date</h2>
                </div>
                <button
                  type="button"
                  className="datepicker-close"
                  onClick={() => setShowDatePicker(false)}
                  aria-label="Close date picker"
                >
                  <IoCloseOutline aria-hidden="true" />
                </button>
              </div>
              <div className="datepicker-header">
                <button
                  type="button"
                  className="month-nav"
                  onClick={handlePrevMonth}
                  aria-label="Previous month"
                >
                  &lt;
                </button>
                <div className="current-month">
                  {monthNames[currentMonth]} {currentYear}
                </div>
                <button
                  type="button"
                  className="month-nav"
                  onClick={handleNextMonth}
                  aria-label="Next month"
                >
                  &gt;
                </button>
              </div>
              <div className="datepicker-grid">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div className="datepicker-day-label" key={d}>
                    {d}
                  </div>
                ))}

                {days.map((day, idx) => {
                  if (!day) {
                    return <div className="datepicker-cell empty" key={idx} />;
                  }
                  const cellDate = new Date(currentYear, currentMonth, day);
                  const cellTime = cellDate.getTime();
                  const isToday = cellTime === todayTime;
                  const isSelected = cellTime === selectedTime;
                  const isDisabled = cellTime < todayTime;

                  return (
                    <button
                      type="button"
                      key={idx}
                      className={[
                        "datepicker-cell",
                        isToday ? "today" : "",
                        isSelected ? "selected" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      disabled={isDisabled}
                      onClick={() => handleSelectDate(day)}
                      data-selected={isSelected ? "true" : undefined}
                      aria-current={isToday ? "date" : undefined}
                      aria-pressed={isSelected}
                      aria-label={cellDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    >
                      {day}
                    </button>
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
