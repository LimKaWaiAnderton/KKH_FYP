import React, { useState } from 'react';
import { HiOutlineCalendar } from 'react-icons/hi';
import CustomCalendar from './CustomCalendar';
import '../../../styles/EmployeeScheduleHead.css';

export default function EmployeeScheduleHead({ startDate, setStartDate, viewOption, setViewOption, weekDays, searchTerm, setSearchTerm }) {
    const [showCalendar, setShowCalendar] = useState(false);
    const [showViewOptions, setShowViewOptions] = useState(false);

    // Format date range string
    const getDateRangeString = () => {
        const firstDay = weekDays[0];
        const lastDay = weekDays[6];
        return `${firstDay.date} ${firstDay.month} - ${lastDay.date} ${lastDay.month}`;
    };

    // Navigate to previous week
    const goToPreviousWeek = () => {
        const newDate = new Date(startDate);
        newDate.setDate(startDate.getDate() - 7);
        setStartDate(newDate);
    };

    // Navigate to next week
    const goToNextWeek = () => {
        const newDate = new Date(startDate);
        newDate.setDate(startDate.getDate() + 7);
        setStartDate(newDate);
    };

    // Handle calendar date selection
    const handleDateSelect = (date) => {
        setStartDate(date);
        setShowCalendar(false);
    };

    // Handle view option selection
    const handleViewOptionSelect = (option) => {
        setViewOption(option);
        setShowViewOptions(false);
    };

    return (
        <div className="schedule-head">
            {/* Top Controls Row */}
            <div className="schedule-controls">
                {/* View Options Dropdown */}
                <div className="view-options">
                    <button 
                        className="view-options-btn"
                        onClick={() => setShowViewOptions(!showViewOptions)}
                    >
                        View Options
                        <span className="dropdown-icon">▼</span>
                    </button>
                    {showViewOptions && (
                        <div className="view-options-dropdown">
                            <div 
                                className="view-option-item"
                                onClick={() => handleViewOptionSelect('View only me')}
                            >
                                View only me
                            </div>
                            <div 
                                className="view-option-item"
                                onClick={() => handleViewOptionSelect('View everyone')}
                            >
                                View everyone
                            </div>
                        </div>
                    )}
                </div>

                {/* Date Navigation */}
                <div className="date-navigation">
                    <button className="nav-arrow" onClick={goToPreviousWeek}>‹</button>
                    <span className="date-range">{getDateRangeString()}</span>
                    <button className="nav-arrow" onClick={goToNextWeek}>›</button>
                </div>

                {/* Calendar Picker */}
                <div className="calendar-picker-wrapper">
                    <button 
                        className="calendar-icon-btn" 
                        onClick={() => setShowCalendar(!showCalendar)}
                    >
                        <HiOutlineCalendar />
                    </button>
                    {showCalendar && (
                        <div className="calendar-popup">
                            <CustomCalendar
                                selectedDate={startDate}
                                onDateSelect={handleDateSelect}
                                onClose={() => setShowCalendar(false)}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Search and Days Row */}
            <div className="schedule-header-row">
                {/* Search Box */}
                <div className="search-container">
                    <input 
                        type="text" 
                        placeholder="Search.." 
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Days of Week */}
                <div className="days-row">
                    {weekDays.map((day, index) => (
                        <div key={index} className="day-item">
                            <div className="day-number">{day.date}</div>
                            <div className="day-name">{day.day}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
