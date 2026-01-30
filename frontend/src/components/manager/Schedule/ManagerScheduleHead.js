import React, { useState } from 'react';
import FairnessTrackerModal from './FairnessTrackerModal';
import { getFairnessTrackerData } from '../../../api/fairnessTracker.api';
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
    const [showFairnessModal, setShowFairnessModal] = useState(false);

    // Initial state
    const [fairnessData, setFairnessData] = useState({ 
        nightCounts: {}, 
        rrtCounts: {}, 
        gpapnCounts: {}, 
        nnjCounts: {},   
        employees: [] 
    });
    
    const [isLoadingFairness, setIsLoadingFairness] = useState(false);
    const [fairnessMode, setFairnessMode] = useState('week'); // 'week', 'month', or 'year'
    const [selectedMonth, setSelectedMonth] = useState((new Date(startDate)).getMonth());
    const [selectedYear, setSelectedYear] = useState((new Date(startDate)).getFullYear());

    // ... (Existing formatting and navigation functions: getDateRangeString, goToPreviousWeek, etc.) ...
    // ... Copy them from your existing file ...
    const getDateRangeString = () => {
        const firstDay = weekDays[0];
        const lastDay = weekDays[6];
        return `${firstDay.date} ${firstDay.month} - ${lastDay.date} ${lastDay.month}`;
    };

    const goToPreviousWeek = () => {
        const newDate = new Date(startDate);
        newDate.setDate(startDate.getDate() - 7);
        setStartDate(newDate);
    };

    const goToNextWeek = () => {
        const newDate = new Date(startDate);
        newDate.setDate(startDate.getDate() + 7);
        setStartDate(newDate);
    };

    const handleDateSelect = (date) => {
        setStartDate(date);
        setShowCalendar(false);
    };

    const handleAddShiftOption = async (option) => {
        setShowAddDropdown(false);
        if (option === 'Generate roster') {
            setShowGenerateRosterModal(true);
        } else if (option === 'Fairness tracker') {
            setFairnessMode('week');
            setIsLoadingFairness(true);
            setShowFairnessModal(true);
            try {
                await fetchFairnessData('week');
            } catch (e) {
                toast.error('Failed to load fairness tracker');
            } finally {
                setIsLoadingFairness(false);
            }
        }
    };

    // --- UPDATED: Handle 'year' mode ---
    const fetchFairnessData = async (mode) => {
        let firstDay, lastDay;
        
        if (mode === 'week') {
            const weekStart = new Date(startDate);
            const weekEnd = new Date(startDate);
            weekEnd.setDate(weekEnd.getDate() + 6);
            firstDay = weekStart.toISOString().slice(0, 10);
            lastDay = weekEnd.toISOString().slice(0, 10);
        } 
        else if (mode === 'month') {
            const monthStart = new Date(selectedYear, selectedMonth, 1);
            const monthEnd = new Date(selectedYear, selectedMonth + 1, 0); 
            firstDay = monthStart.toISOString().slice(0, 10);
            lastDay = monthEnd.toISOString().slice(0, 10);
        }
        else if (mode === 'year') {
            // NEW: Whole Year Logic (Jan 1 to Dec 31 of selectedYear)
            const yearStart = new Date(selectedYear, 0, 1);
            const yearEnd = new Date(selectedYear, 11, 31);
            firstDay = yearStart.toISOString().slice(0, 10);
            lastDay = yearEnd.toISOString().slice(0, 10);
        }

        const data = await getFairnessTrackerData(firstDay, lastDay);
        setFairnessData(data);
    };

    const handleGenerateRoster = async () => {
        try {
            setIsGenerating(true);
            const result = await generateRoster(rosterStartDate, rosterEndDate);
            toast.success(
                `Roster generated successfully! ${result.created} shifts created, ${result.skipped} skipped.`,
                { duration: 5000 }
            );
            setShowGenerateRosterModal(false);
            setRosterStartDate('');
            setRosterEndDate('');
            if (onRosterGenerated) onRosterGenerated();
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
                <div className="date-navigation">
                    <button className="nav-arrow" onClick={goToPreviousWeek}>‹</button>
                    <span className="date-range">{getDateRangeString()}</span>
                    <button className="nav-arrow" onClick={goToNextWeek}>›</button>
                </div>

                <div className="calendar-picker-wrapper">
                    <button className="calendar-icon-btn" onClick={() => setShowCalendar(!showCalendar)}>
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

                <div style={{ flex: 1 }}></div>

                <button className="settings-btn">
                    <HiOutlineCog /> Settings
                </button>

                <div className="add-dropdown-wrapper">
                    <button className="add-btn" onClick={() => setShowAddDropdown(!showAddDropdown)}>
                        Add <span className="dropdown-icon">▼</span>
                    </button>
                    {showAddDropdown && (
                        <div className="add-dropdown">
                            <div className="add-option-item" onClick={() => handleAddShiftOption('Generate roster')}>
                                Generate roster
                            </div>
                            <div className="add-option-item" onClick={() => handleAddShiftOption('Fairness tracker')}>
                                Fairness tracker
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Header Row */}
            <div className="schedule-header-row">
                <div className="search-container">
                    <input 
                        type="text" 
                        placeholder="Search.." 
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
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
                            <button className="close-btn" onClick={() => setShowGenerateRosterModal(false)}>×</button>
                        </div>
                        <p className="modal-description">Select range to generate roster.</p>
                        <div className="modal-body">
                            <div className="date-input-group">
                                <label>Start Date</label>
                                <input type="date" value={rosterStartDate} onChange={(e) => setRosterStartDate(e.target.value)} />
                            </div>
                            <div className="date-input-group">
                                <label>End Date</label>
                                <input type="date" value={rosterEndDate} onChange={(e) => setRosterEndDate(e.target.value)} />
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={() => setShowGenerateRosterModal(false)} disabled={isGenerating}>Cancel</button>
                            <button className="generate-btn" onClick={handleGenerateRoster} disabled={!rosterStartDate || !rosterEndDate || isGenerating}>
                                {isGenerating ? 'Generating...' : 'Generate Roster'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Fairness Tracker Modal */}
            <FairnessTrackerModal
                open={showFairnessModal}
                onClose={() => setShowFairnessModal(false)}
                nightCounts={fairnessData.nightCounts}
                rrtCounts={fairnessData.rrtCounts}
                gpapnCounts={fairnessData.gpapnCounts}
                nnjCounts={fairnessData.nnjCounts}
                employees={fairnessData.employees}
                mode={fairnessMode}
                // Updated setMode to handle async fetch
                setMode={async (newMode) => {
                    setFairnessMode(newMode);
                    setIsLoadingFairness(true);
                    try {
                        await fetchFairnessData(newMode);
                    } catch (e) {
                        toast.error('Failed to load fairness tracker');
                    } finally {
                        setIsLoadingFairness(false);
                    }
                }}
                isLoading={isLoadingFairness}
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                fetchFairnessData={fetchFairnessData}
            />
        </div>
    );
}