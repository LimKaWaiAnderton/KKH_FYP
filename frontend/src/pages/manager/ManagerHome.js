import React from 'react';
import ManagerQuickAction from '../../components/manager/Home/ManagerQuickAction';
import ManagerNotification from '../../components/manager/Home/ManagerNotification';
import Header from '../../components/Header/Header';
import '../../styles/ManagerHome.css';

export default function ManagerHome() {
    return (
        <div className="manager-home-page">
            <Header title="Home" />
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
