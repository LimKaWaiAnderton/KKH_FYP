import React, { useState } from 'react';
import { HiOutlineCalendar, HiOutlineCog } from 'react-icons/hi';
import CustomCalendar from './CustomCalendar';
import { generateRoster } from '../../../api/schedule.api';
import toast from 'react-hot-toast';
import '../../../styles/ManagerScheduleHead.css';

export default function ManagerScheduleHead({ startDate, setStartDate, weekDays, searchTerm, setSearchTerm, onRosterGenerated }) {
    const [showCalendar, setShowCalendar] = useState(false);
    const [showAddDropdown, setShowAddDropdown] = useState(false);
    const [showGenerateRosterModal, setShowGenerateRosterModal] = useState(false);
    const [rosterStartDate, setRosterStartDate] = useState('');
    const [rosterEndDate, setRosterEndDate] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

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

    // Handle add shift option selection
    const handleAddShiftOption = (option) => {
        console.log(`Selected: ${option}`);
        setShowAddDropdown(false);
        if (option === 'Generate roster') {
            setShowGenerateRosterModal(true);
        }
    };

    // Handle generate roster submission
    const handleGenerateRoster = async () => {
        try {
            setIsGenerating(true);
            const result = await generateRoster(rosterStartDate, rosterEndDate);
            
            // Show success message
            toast.success(
                `Roster generated successfully! ${result.shiftsCreated} shifts created, ${result.shiftsSkipped} skipped (existing).`,
                { duration: 5000 }
            );
            
            // Close modal and reset
            setShowGenerateRosterModal(false);
            setRosterStartDate('');
            setRosterEndDate('');
            
            // Callback to parent to refresh data
            if (onRosterGenerated) {
                onRosterGenerated();
            }
        } catch (error) {
            toast.error(`Failed to generate roster: ${error.message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div>
            {/* Top Controls Row */}
            <div className="schedule-controls">
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

                {/* Spacer to push Settings and Add to the right */}
                <div style={{ flex: 1 }}></div>

                {/* Settings Button */}
                <button className="settings-btn">
                    <HiOutlineCog /> Settings
                </button>

                {/* Add Dropdown */}
                <div className="add-dropdown-wrapper">
                    <button 
                        className="add-btn"
                        onClick={() => setShowAddDropdown(!showAddDropdown)}
                    >
                        Add
                        <span className="dropdown-icon">▼</span>
                    </button>
                    {showAddDropdown && (
                        <div className="add-dropdown">
                            <div 
                                className="add-option-item"
                                onClick={() => handleAddShiftOption('Generate roster')}
                            >
                                Generate roster
                            </div>
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

            {/* Generate Roster Modal */}
            {showGenerateRosterModal && (
                <div className="modal-overlay" onClick={() => setShowGenerateRosterModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Generate Roster</h2>
                            <button 
                                className="close-btn" 
                                onClick={() => setShowGenerateRosterModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <p className="modal-description">
                            Select the date range for roster generation. The system will automatically assign shifts to available employees.
                        </p>
                        <div className="modal-body">
                            <div className="date-input-group">
                                <label>Start Date</label>
                                <input 
                                    type="date" 
                                    value={rosterStartDate}
                                    onChange={(e) => setRosterStartDate(e.target.value)}
                                />
                            </div>
                            <div className="date-input-group">
                                <label>End Date</label>
                                <input 
                                    type="date" 
                                    value={rosterEndDate}
                                    onChange={(e) => setRosterEndDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button 
                                className="cancel-btn" 
                                onClick={() => setShowGenerateRosterModal(false)}
                                disabled={isGenerating}
                            >
                                Cancel
                            </button>
                            <button 
                                className="generate-btn" 
                                onClick={handleGenerateRoster}
                                disabled={!rosterStartDate || !rosterEndDate || isGenerating}
                            >
                                {isGenerating ? 'Generating...' : 'Generate Roster'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
