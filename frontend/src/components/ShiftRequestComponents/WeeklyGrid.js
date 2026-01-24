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
                <div
                  className="shift-card"
                  style={{
                    backgroundColor: shift.bgColor,
                  }}
                >
                  <div className="shift-left">
                    <span className="shift-date">{shift.day}</span>
                    <span className="shift-day">{shift.dayName}</span>
                  </div>
                  <div className="shift-divider" style={{ backgroundColor: shift.borderColor }}></div>
                  <div className="shift-right">
                    <div className="shift-info-row">
                      <div className="shift-details">
                        {shift.time && <span className="shift-time">{shift.time}</span>}
                        <span className="shift-label" style={{ color: shift.borderColor }}>{shift.label}</span>
                      </div>
                      {shift.status && (
                        <span className={`shift-status-badge ${shift.status}`}>
                          {shift.status === 'pending' ? 'Pending' : shift.status === 'approved' ? 'Approved' : 'Rejected'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
