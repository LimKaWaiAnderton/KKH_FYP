import React from "react";
import "../../styles/ShiftRequest/WeeklyGrid.css";

export default function WeeklyGrid({ week }) {
  return (
    <div className="week-column">

      {/* Week header */}
      <div className="week-header">
        <h4>Week {week.weekNumber}</h4>
        <span>
          {String(week.start).padStart(2, "0")}/{String(week.month).padStart(2, "0")} –{" "}
          {String(week.end).padStart(2, "0")}/{String(week.month).padStart(2, "0")}
        </span>
      </div>

      {/* 5 rows */}
      <div className="week-rows">
        {[...Array(5)].map((_, index) => {
          const shift = week.shifts.find((s) => s.rowIndex === index);

          return (
            <div key={index} className="week-slot">
              {shift && (
                <div className="shift-card">
                  <span className="day">{shift.day}</span>
                  <span className="label">{shift.label}</span>
                  {shift.time && <span className="time">{shift.time}</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
