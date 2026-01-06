import React from 'react';
import EmployeeQuickAction from '../../components/employee/Home/EmployeeQuickAction';
import EmployeeNotification from '../../components/employee/Home/EmployeeNotification';
import '../../styles/EmployeeHome.css';
import EmployeeLayout from "../../layouts/EmployeeLayout.js";

export default function EmployeeHome() {
    return (
        <EmployeeLayout>
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

        </EmployeeLayout>
            
    );
}
