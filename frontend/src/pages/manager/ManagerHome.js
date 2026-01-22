import React from 'react';
import ManagerQuickAction from '../../components/manager/Home/ManagerQuickAction';
import ManagerNotification from '../../components/manager/Home/ManagerNotification';
import '../../styles/ManagerHome.css';

export default function ManagerHome() {
    return (
        <div className="manager-home-page">
            {/* Page Header */}
            <div className="home-header">
                <h1 className="home-title">Home</h1>
            </div>

            {/* Main Content Area */}
            <div className="home-content">
                {/* Quick Actions Section */}
                <ManagerQuickAction />

                {/* Notifications Section */}
                <ManagerNotification />
            </div>
        </div>
    );
}
