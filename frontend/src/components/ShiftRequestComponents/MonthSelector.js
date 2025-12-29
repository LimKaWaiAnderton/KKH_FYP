import React from "react";
import "../../styles/ShiftRequest/MonthSelector.css";

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export default function MonthSelector({ month, year, setMonth, setYear, monthNames }) {
  const prev = () => {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else setMonth(month - 1);
  };

  const next = () => {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else setMonth(month + 1);
  };

  return (
    <div className="month-selector">
      <span className="ms-arrow" onClick={prev}>‹</span>
      <span className="ms-label">
        {monthNames[month]} {year}
      </span>
      <span className="ms-arrow" onClick={next}>›</span>
    </div>
  );
}

