import React, { useState } from 'react';
import '../../../styles/ScheduleGroupsModal.css';

export default function ScheduleGroupsModal({ isOpen, onClose, onSave, initialGroups = [] }) {
    const [groups, setGroups] = useState(initialGroups);

    if (!isOpen) return null;

    const handleAddGroup = () => {
        const newGroup = {
            id: Date.now(),
            name: '',
            userCount: 0
        };
        setGroups([...groups, newGroup]);
    };

    const handleGroupNameChange = (id, newName) => {
        setGroups(groups.map(group => 
            group.id === id ? { ...group, name: newName } : group
        ));
    };

    const handleDeleteGroup = (id) => {
        setGroups(groups.filter(group => group.id !== id));
    };

    const handleSave = () => {
        onSave(groups);
        onClose();
    };

    return (
        <div className="schedule-groups-modal-overlay" onClick={onClose}>
            <div className="schedule-groups-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="schedule-groups-modal-header">
                    <h2 className="schedule-groups-modal-title">Groups</h2>
                    <button className="schedule-groups-close-btn" onClick={onClose}>×</button>
                </div>

                <div className="schedule-groups-modal-body">
                    <div className="schedule-groups-header-section">
                        <h3 className="organize-text">Organize the schedule view by users</h3>
                        <button className="add-group-btn" onClick={handleAddGroup}>
                            + Add group
                        </button>
                    </div>

                    <div className="groups-list">
                        {groups.map((group) => (
                            <div key={group.id} className="group-item">
                                <span className="drag-handle">⋮⋮</span>
                                <input
                                    type="text"
                                    className="group-name-input"
                                    value={group.name}
                                    onChange={(e) => handleGroupNameChange(group.id, e.target.value)}
                                    placeholder="Group name"
                                />
                                <div className="users-dropdown">
                                    <span className="users-count">{group.userCount} users selected</span>
                                    <span className="dropdown-arrow">▼</span>
                                </div>
                                <button 
                                    className="delete-group-btn"
                                    onClick={() => handleDeleteGroup(group.id)}
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="schedule-groups-modal-footer">
                    <button className="schedule-groups-cancel-btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="schedule-groups-confirm-btn" onClick={handleSave}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}
