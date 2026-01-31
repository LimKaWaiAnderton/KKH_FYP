import React, { useState, useEffect } from 'react';
import { HiOutlineInformationCircle, HiOutlineExclamationTriangle, HiOutlineBell } from 'react-icons/hi2';
import { authFetch } from '../../../utils/authFetch';
import '../../../styles/ManagerNotification.css';

export default function ManagerNotification() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadNotifications = async () => {
            try {
                const userRes = await authFetch('http://localhost:5000/auth/me');
                if (!userRes || !userRes.ok) return;
                
                const userData = await userRes.json();
                
                const notifRes = await authFetch(`http://localhost:5000/api/notifications/user/${userData.id}`);
                if (notifRes && notifRes.ok) {
                    const data = await notifRes.json();
                    setNotifications(data);
                }
            } catch (error) {
                console.error('Error loading notifications:', error);
            } finally {
                setLoading(false);
            }
        };
        
        loadNotifications();
    }, []);

    // Limit to first 3 notifications for display
    const displayedNotifications = notifications.slice(0, 3);
    
    // Calculate unread notifications count
    const unreadCount = displayedNotifications.filter(n => !n.is_read).length;

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
    const handleNotificationClick = async (notificationId, isRead) => {
        if (!isRead) {
            try {
                await authFetch(`http://localhost:5000/api/notifications/${notificationId}/read`, {
                    method: 'PUT'
                });
                
                // Update local state
                setNotifications(prev => 
                    prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
                );
            } catch (error) {
                console.error('Error marking notification as read:', error);
            }
        }
    };

    // Function to format time ago
    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now - date;
        const diffInMins = Math.floor(diffInMs / 60000);
        const diffInHours = Math.floor(diffInMs / 3600000);
        const diffInDays = Math.floor(diffInMs / 86400000);
        
        if (diffInMins < 1) return 'Just now';
        if (diffInMins < 60) return `${diffInMins} min ago`;
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    };

    if (loading) {
        return (
            <div className="container">
                <div className="manager-notifications-header">
                    <HiOutlineBell className="manager-notifications-icon" />
                    <h2 className="manager-notifications-title">Notifications</h2>
                </div>
                <p style={{ padding: '20px', textAlign: 'center' }}>Loading...</p>
            </div>
        );
    }

    return (
        <div className="container">
            {/* Header Section */}
            <div className="manager-notifications-header">
                <HiOutlineBell className="manager-notifications-icon" />
                <h2 className="manager-notifications-title">Notifications</h2>
                {unreadCount > 0 && <span className="manager-notifications-count">({unreadCount})</span>}
            </div>

            {/* Notifications List */}
            <div className="manager-notifications-list">
                {displayedNotifications.length === 0 ? (
                    <p style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No notifications</p>
                ) : (
                    displayedNotifications.map((notification) => {
                        const isRead = notification.is_read;
                        return (
                            <div 
                                key={notification.id} 
                                className={`manager-notification-item ${isRead ? 'read' : ''}`}
                                onClick={() => handleNotificationClick(notification.id, isRead)}
                            >
                                {/* Icon Section */}
                                <div className={`manager-notification-icon manager-notification-${notification.type}`}>
                                    {getNotificationIcon(notification.type)}
                                </div>

                                {/* Content Section */}
                                <div className="manager-notification-content">
                                    <p className="manager-notification-message">{notification.message}</p>
                                    <span className="manager-notification-time">{formatTimeAgo(notification.created_at)}</span>
                                </div>

                                {/* New Badge (only show if not read) */}
                                {!isRead && (
                                    <span className="manager-notification-badge">New</span>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* View More Link */}
            <div className="manager-notifications-footer">
                <button className="manager-view-more-link" onClick={() => console.log('View more clicked')}>View More</button>
            </div>
        </div>
    );
}
