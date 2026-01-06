import React, { useState } from 'react';
import NotificationData from '../mock/NotificationData';
import '../styles/EmployeeNotification.css';

export default function EmployeeNotification() {
    // State to track read notifications
    const [readNotifications, setReadNotifications] = useState([]);

    // Limit to first 3 notifications for display
    const displayedNotifications = NotificationData.slice(0, 3);

    // Function to get icon based on notification type
    const getNotificationIcon = (type) => {
        if (type === 'info') {
            return 'ℹ️'; // Info icon
        } else if (type === 'warning') {
            return '⚠️'; // Warning icon
        }
        return 'ℹ️'; // Default to info
    };

    // Function to handle notification click
    const handleNotificationClick = (notificationId) => {
        if (!readNotifications.includes(notificationId)) {
            setReadNotifications([...readNotifications, notificationId]);
        }
    };

    return (
        <div className="notifications-container">
            {/* Header Section */}
            <div className="notifications-header">
                <h2 className="notifications-title">Notifications</h2>
            </div>

            {/* Notifications List */}
            <div className="notifications-list">
                {displayedNotifications.map((notification) => {
                    const isRead = readNotifications.includes(notification.id);
                    return (
                        <div 
                            key={notification.id} 
                            className={`notification-item ${isRead ? 'read' : ''}`}
                            onClick={() => handleNotificationClick(notification.id)}
                        >
                            {/* Icon Section */}
                            <div className={`notification-icon notification-${notification.type}`}>
                                <span>{getNotificationIcon(notification.type)}</span>
                            </div>

                            {/* Content Section */}
                            <div className="notification-content">
                                <p className="notification-message">{notification.message}</p>
                                <span className="notification-time">{notification.time}</span>
                            </div>

                            {/* New Badge (only show if isNew is true) */}
                            {notification.isNew && (
                                <span className="notification-badge">New</span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* View More Link */}
            <div className="notifications-footer">
                <button className="view-more-link" onClick={() => console.log('View more clicked')}>View More</button>
            </div>
        </div>
    );
}
