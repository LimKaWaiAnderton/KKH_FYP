import React from 'react';
import ManagerQuickAction from '../../components/ManagerQuickAction';
import ManagerNotification from '../../components/ManagerNotification';
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
                <ManagerNotification />
                <ManagerNotification />
            </div>
        </div>
    );
}
