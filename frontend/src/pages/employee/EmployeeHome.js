import React from 'react';
import EmployeeQuickAction from '../../components/EmployeeQuickAction';
import EmployeeNotification from '../../components/EmployeeNotification';
import '../../styles/EmployeeHome.css';

export default function EmployeeHome() {
    return (
        <div className="employee-home-page">
            {/* Page Header */}
            <div className="home-header">
                <h1 className="home-title">Home</h1>
            </div>

            {/* Main Content Area */}
            <div className="home-content">
                {/* Quick Actions Section */}
                <EmployeeQuickAction />

                {/* Notifications Section */}
                <EmployeeNotification />
                <EmployeeNotification />
                <EmployeeNotification />
                <EmployeeNotification />
            </div>
        </div>
    );
}
