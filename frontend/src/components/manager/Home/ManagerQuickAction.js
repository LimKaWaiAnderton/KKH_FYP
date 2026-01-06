import React from 'react';
import '../../../styles/ManagerQuickAction.css';

export default function ManagerQuickAction() {
    // Handle button clicks
    const handleRequestLeave = () => {
        console.log('Request leave clicked');
    };

    const handleRequestShift = () => {
        console.log('Request shift clicked');
    };

    const handleViewShifts = () => {
        console.log('View shifts clicked');
    };

    return (
        <div className="quick-actions-container">
            {/* Section Title */}
            <div className="quick-actions-header">
                <span className="refresh-icon">↻</span>
                <h2 className="quick-actions-title">Quick Actions</h2>
            </div>

            {/* Action Buttons Row */}
            <div className="quick-actions-row">
                {/* Request Leave Button */}
                <button className="action-button" onClick={handleRequestLeave}>
                    <span className="action-icon">📄</span>
                    <span className="action-text">Request leave</span>
                </button>

                {/* Request Shift Button */}
                <button className="action-button" onClick={handleRequestShift}>
                    <span className="action-icon">📅</span>
                    <span className="action-text">Request shift</span>
                </button>

                {/* View My Shifts Button */}
                <button className="action-button" onClick={handleViewShifts}>
                    <span className="action-icon">📋</span>
                    <span className="action-text">View my shifts</span>
                </button>
            </div>
        </div>
    );
}
