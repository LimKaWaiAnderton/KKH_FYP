import React, { useState } from 'react';
import '../../../styles/CustomCalendar.css';

export default function CustomCalendar({ selectedDate, onDateSelect, onClose }) {
    const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    
    const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    // Get days in month
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    // Get first day of month (0 = Sunday, 6 = Saturday)
    const getFirstDayOfMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    // Generate calendar days
    const generateCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentMonth);
        const firstDay = getFirstDayOfMonth(currentMonth);
        const days = [];

        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }

        return days;
    };

    // Navigate to previous month
    const goToPreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    // Navigate to next month
    const goToNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    // Handle date selection
    const handleDateClick = (day) => {
        if (day) {
            const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            onDateSelect(newDate);
            if (onClose) onClose();
        }
    };

    // Handle today button click
    const handleTodayClick = () => {
        const today = new Date();
        setCurrentMonth(today);
        onDateSelect(today);
        if (onClose) onClose();
    };

    // Check if date is today
    const isToday = (day) => {
        if (!day) return false;
        const today = new Date();
        return day === today.getDate() &&
               currentMonth.getMonth() === today.getMonth() &&
               currentMonth.getFullYear() === today.getFullYear();
    };

    // Check if date is selected
    const isSelected = (day) => {
        if (!day || !selectedDate) return false;
        return day === selectedDate.getDate() &&
               currentMonth.getMonth() === selectedDate.getMonth() &&
               currentMonth.getFullYear() === selectedDate.getFullYear();
    };

    const calendarDays = generateCalendarDays();

    return (
        <div className="custom-calendar">
            {/* Calendar Header */}
            <div className="calendar-header">
                <button className="calendar-nav-btn" onClick={goToPreviousMonth}>
                    ←
                </button>
                <div className="calendar-month-year">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </div>
                <button className="calendar-nav-btn" onClick={goToNextMonth}>
                    →
                </button>
            </div>

            {/* Days of Week */}
            <div className="calendar-days-header">
                {daysOfWeek.map((day, index) => (
                    <div key={index} className="calendar-day-name">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="calendar-grid">
                {calendarDays.map((day, index) => (
                    <div
                        key={index}
                        className={`calendar-day ${day ? 'active' : 'empty'} ${isToday(day) ? 'today' : ''} ${isSelected(day) ? 'selected' : ''}`}
                        onClick={() => handleDateClick(day)}
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="calendar-footer">
                <button className="calendar-clear-btn" onClick={onClose}>
                    Clear
                </button>
                <button className="calendar-today-btn" onClick={handleTodayClick}>
                    Today
                </button>
            </div>
        </div>
    );
}
