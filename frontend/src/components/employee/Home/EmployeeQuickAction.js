import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineClipboardList, HiOutlineCalendar, HiOutlineClock } from 'react-icons/hi';
import '../../../styles/EmployeeQuickAction.css';

export default function EmployeeQuickAction() {
    const navigate = useNavigate();

    // Handle button clicks
    const handleRequestLeave = () => {
        navigate('/employee/requests/leave');
    };

    const handleRequestShift = () => {
        navigate('/employee/requests/shift');
    };

    const handleViewShifts = () => {
        navigate('/employee/schedule');
    };

    return (
        <div className="container">
            {/* Section Title */}
            <div className="quick-actions-header">
                <span className="refresh-icon">↻</span>
                <h2 className="quick-actions-title">Quick Actions</h2>
            </div>

            {/* Action Buttons Row */}
            <div className="quick-actions-row">
                {/* Request Leave Button */}
                <button className="action-button" onClick={handleRequestLeave}>
                    <span className="action-icon"><HiOutlineClipboardList /></span>
                    <span className="action-text">Request leave</span>
                </button>

                {/* Request Shift Button */}
                <button className="action-button" onClick={handleRequestShift}>
                    <span className="action-icon"><HiOutlineCalendar /></span>
                    <span className="action-text">Request shift</span>
                </button>

                {/* View My Shifts Button */}
                <button className="action-button" onClick={handleViewShifts}>
                    <span className="action-icon"><HiOutlineClock /></span>
                    <span className="action-text">View my shifts</span>
                </button>
            </div>
        </div>
    );
}
