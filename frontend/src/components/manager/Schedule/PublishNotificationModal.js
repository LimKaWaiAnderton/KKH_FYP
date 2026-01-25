import React, { useState } from 'react';
import '../../../styles/PublishNotificationModal.css';

export default function PublishNotificationModal({ isOpen, onClose, onPublish, publishData }) {
    const [notifyUsers, setNotifyUsers] = useState(true);
    const [notificationMessage, setNotificationMessage] = useState('Your schedule has been updated with new shifts');

    if (!isOpen) return null;

    const handlePublish = () => {
        onPublish({
            notifyUsers,
            notificationMessage
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Notify users</h2>
                    <button className="modal-close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    {/* Publish Info Banner */}
                    <div className="publish-info-banner">
                        <span className="banner-icon">▶</span>
                        <span className="banner-text">
                            {publishData ? `${publishData.shiftCount} shift${publishData.shiftCount !== 1 ? 's' : ''} will be published for ${publishData.startDateDisplay} - ${publishData.endDateDisplay}` : 'Loading...'}
                        </span>
                    </div>

                    {/* Notify Users Toggle */}
                    <div className="notify-toggle-section">
                        <div className="notify-toggle-content">
                            <div className="notify-toggle-text">
                                <div className="notify-label">Notify users</div>
                                <div className="notify-sublabel">Users with assigned shifts</div>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={notifyUsers}
                                    onChange={(e) => setNotifyUsers(e.target.checked)}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                    </div>

                    {/* Notification Message */}
                    <div className="notification-message-section">
                        <label className="message-label">
                            Write the notifications that these users will receive
                        </label>
                        <textarea
                            className="message-textarea"
                            value={notificationMessage}
                            onChange={(e) => setNotificationMessage(e.target.value)}
                            rows={4}
                            disabled={!notifyUsers}
                        />
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="cancel-btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="publish-btn" onClick={handlePublish}>
                        Confirm & Publish
                    </button>
                </div>
            </div>
        </div>
    );
}
