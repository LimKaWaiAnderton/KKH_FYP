import React from 'react';
import EmployeeQuickAction from '../../components/employee/Home/EmployeeQuickAction';
import EmployeeNotification from '../../components/employee/Home/EmployeeNotification';
import EmployeeShiftOverview from '../../components/employee/Home/EmployeeShiftOverview';
import Header from '../../components/Header/Header';
import '../../styles/EmployeeHome.css';

export default function EmployeeHome() {
    return (
        <div className="employee-home-page">
            {/* Page Header */}
            {/* <div className="home-header">
                <h1 className="home-title">Home</h1>
            </div> */}
            <Header title="Home" />
            {/* Quick Actions Section */}
                <EmployeeQuickAction />
            {/* Two Column Layout for Notifications and Shift Overview */}
            <div className="home-two-column">
                {/* Shift Overview Section */}
                <EmployeeShiftOverview />

                {/* Notifications Section */}
                <EmployeeNotification />
            </div>
        </div>
    );
}
