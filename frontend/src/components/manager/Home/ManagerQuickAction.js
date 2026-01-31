import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineUserAdd, HiOutlineCalendar, HiOutlineClipboardCheck } from 'react-icons/hi';
import '../../../styles/ManagerQuickAction.css';

export default function ManagerQuickAction() {
    const navigate = useNavigate();

    // Handle button clicks
    const handleAddUser = () => {
        navigate('/manager/add-user');
    };

    const handleManageSchedule = () => {
        navigate('/manager/schedule');
    };

    const handleViewRequest = () => {
        navigate('/manager/requests/leave');
    };

    return (
        <div className="container">
            {/* Section Title */}
            <div className="manager-quick-actions-header">
                <span className="manager-refresh-icon">↻</span>
                <h2 className="manager-quick-actions-title">Quick Actions</h2>
            </div>

            {/* Action Buttons Row */}
            <div className="manager-quick-actions-row">
                {/* Add User Button */}
                <button className="manager-action-button" onClick={handleAddUser}>
                    <span className="manager-action-icon"><HiOutlineUserAdd /></span>
                    <span className="manager-action-text">Add User</span>
                </button>

                {/* Manage Schedule Button */}
                <button className="manager-action-button" onClick={handleManageSchedule}>
                    <span className="manager-action-icon"><HiOutlineCalendar /></span>
                    <span className="manager-action-text">Manage Schedule</span>
                </button>

                {/* View Request Button */}
                <button className="manager-action-button" onClick={handleViewRequest}>
                    <span className="manager-action-icon"><HiOutlineClipboardCheck /></span>
                    <span className="manager-action-text">View Request</span>
                </button>
            </div>
        </div>
    );
}
