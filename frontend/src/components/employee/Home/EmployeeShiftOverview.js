import React from 'react';
import { HiOutlineClock } from 'react-icons/hi';
import '../../../styles/EmployeeShiftOverview.css';
import { scheduleData } from '../../../mock/ScheduleData';
import { getShiftColor, getShiftTime } from '../../../mock/ShiftColorConfig';

export default function EmployeeShiftOverview() {
    // Get current user's shifts (for demo, using first employee in data)
    const currentUserName = scheduleData[0]?.name || 'User';
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    // Filter shifts for current user
    const userShifts = scheduleData.filter(shift => shift.name === currentUserName);
    
    // Find today's shift
    const todayShift = userShifts.find(shift => shift.date === todayString);
    
    // Get upcoming shifts (next 3 shifts after today)
    const upcomingShifts = userShifts
        .filter(shift => shift.date > todayString)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3);
    
    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
        const dayName = dayNames[date.getDay()];
        return { day, dayName };
    };
    
    // Get shift display info
    const getShiftInfo = (shift) => {
        const color = getShiftColor(shift.shift_type, shift.leave_type);
        const time = getShiftTime(shift.shift_type);
        const type = shift.leave_type || shift.shift_type;
        return { color, time, type };
    };
    
    return (
        <div className="employee-shift-overview-container">
            {/* Today's Shift Section */}
            <div className="shift-overview-section">
                <div className="shift-overview-header">
                    <HiOutlineClock className="shift-overview-icon" />
                    <h3 className="shift-overview-title">Today's Shift</h3>
                </div>
                
                {todayShift ? (
                    <div className="shift-overview-item today">
                        <div className="shift-date-box">
                            <div className="shift-day-number">{formatDate(todayShift.date).day}</div>
                            <div className="shift-day-name">{formatDate(todayShift.date).dayName}</div>
                        </div>
                        <div className="shift-divider"></div>
                        <div className="shift-time-info">
                            {getShiftInfo(todayShift).time ? (
                                <div className="shift-time">{getShiftInfo(todayShift).time}</div>
                            ) : (
                                <div className="shift-type-label">{getShiftInfo(todayShift).type}</div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="no-shift-message">No shift scheduled for today</div>
                )}
            </div>
            
            {/* Upcoming Shifts Section */}
            <div className="shift-overview-section">
                <div className="shift-overview-header">
                    <HiOutlineClock className="shift-overview-icon" />
                    <h3 className="shift-overview-title">Upcoming Shifts</h3>
                </div>
                
                <div className="upcoming-shifts-list">
                    {upcomingShifts.length > 0 ? (
                        upcomingShifts.map((shift, index) => {
                            const { day, dayName } = formatDate(shift.date);
                            const { color, time, type } = getShiftInfo(shift);
                            
                            return (
                                <div key={index} className={`shift-overview-item ${color}`}>
                                    <div className="shift-date-box">
                                        <div className="shift-day-number">{day}</div>
                                        <div className="shift-day-name">{dayName}</div>
                                    </div>
                                    <div className="shift-divider"></div>
                                    <div className="shift-time-info">
                                        {time ? (
                                            <div className="shift-time">{time}</div>
                                        ) : (
                                            <div className="shift-type-label">{type}</div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="no-shift-message">No upcoming shifts</div>
                    )}
                </div>
            </div>
        </div>
    );
}
