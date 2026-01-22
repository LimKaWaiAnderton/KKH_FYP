import React, { useState } from 'react';
import { HiOutlineInformationCircle, HiOutlineExclamationTriangle, HiOutlineBell } from 'react-icons/hi2';
import NotificationData from '../../../mock/NotificationData';
import '../../../styles/ManagerNotification.css';

export default function ManagerNotification() {
    // State to track read notifications
    const [readNotifications, setReadNotifications] = useState([]);

    // Limit to first 3 notifications for display
    const displayedNotifications = NotificationData.slice(0, 3);
    
    // Calculate unread notifications count
    const unreadCount = displayedNotifications.filter(n => !readNotifications.includes(n.id)).length;

    // Function to get icon based on notification type
    const getNotificationIcon = (type) => {
        if (type === 'info') {
            return <HiOutlineInformationCircle />; // Info icon
        } else if (type === 'warning') {
            return <HiOutlineExclamationTriangle />; // Warning icon
        }
        return <HiOutlineInformationCircle />; // Default to info
    };

    // Function to handle notification click
    const handleNotificationClick = (notificationId) => {
        if (!readNotifications.includes(notificationId)) {
            setReadNotifications([...readNotifications, notificationId]);
        }
    };

    return (
        <div className="manager-notifications-container">
            {/* Header Section */}
            <div className="manager-notifications-header">
                <HiOutlineBell className="manager-notifications-icon" />
                <h2 className="manager-notifications-title">Notifications</h2>
                {unreadCount > 0 && <span className="manager-notifications-count">({unreadCount})</span>}
            </div>

            {/* Notifications List */}
            <div className="manager-notifications-list">
                {displayedNotifications.map((notification) => {
                    const isRead = readNotifications.includes(notification.id);
                    return (
                        <div 
                            key={notification.id} 
                            className={`manager-notification-item ${isRead ? 'read' : ''}`}
                            onClick={() => handleNotificationClick(notification.id)}
                        >
                            {/* Icon Section */}
                            <div className={`manager-notification-icon manager-notification-${notification.type}`}>
                                {getNotificationIcon(notification.type)}
                            </div>

                            {/* Content Section */}
                            <div className="manager-notification-content">
                                <p className="manager-notification-message">{notification.message}</p>
                                <span className="manager-notification-time">{notification.time}</span>
                            </div>

                            {/* New Badge (only show if isNew is true and not read) */}
                            {notification.isNew && !isRead && (
                                <span className="manager-notification-badge">New</span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* View More Link */}
            <div className="manager-notifications-footer">
                <button className="manager-view-more-link" onClick={() => console.log('View more clicked')}>View More</button>
            </div>
        </div>
    );
}
