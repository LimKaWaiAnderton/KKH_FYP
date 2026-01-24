import React, { useState, useEffect } from 'react';
import { HiOutlineBell } from 'react-icons/hi';
import PublishNotificationModal from './PublishNotificationModal';
import { authFetch } from '../../../utils/authFetch';
import toast from 'react-hot-toast';

export default function ShiftDetailsForm({ selectedDate, selectedEmployee, onClose, onSave, initialData }) {
    const [shiftTitle, setShiftTitle] = useState('');
    const [shiftColor, setShiftColor] = useState('#4CAF50'); // Default green
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('7:00 am');
    const [endTime, setEndTime] = useState('4:00 pm');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const colorOptions = [
        { value: '#4CAF50', label: 'Green' },
        { value: '#E8E8E8', label: 'Grey' },
        { value: '#FFCCBC', label: 'Orange' },
        { value: '#F8BBD0', label: 'Pink' },
        { value: '#BBDEFB', label: 'Blue' }
    ];

    // Generate time options for dropdown (24-hour format with AM/PM)
    const timeOptions = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const period = hour < 12 ? 'am' : 'pm';
            const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
            const displayMinute = minute.toString().padStart(2, '0');
            timeOptions.push(`${displayHour}:${displayMinute} ${period}`);
        }
    }

    // Generate date options (next 90 days)
    const generateDateOptions = () => {
        const options = [];
        const today = new Date();
        for (let i = 0; i < 90; i++) {
            const futureDate = new Date(today);
            futureDate.setDate(today.getDate() + i);
            const day = String(futureDate.getDate()).padStart(2, '0');
            const month = String(futureDate.getMonth() + 1).padStart(2, '0');
            const year = futureDate.getFullYear();
            options.push(`${day}/${month}/${year}`);
        }
        return options;
    };

    const dateOptions = generateDateOptions();

    useEffect(() => {
        if (selectedDate) {
            // Format date as DD/MM/YYYY
            const d = new Date(selectedDate);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            setDate(`${day}/${month}/${year}`);
        }
    }, [selectedDate]);

    useEffect(() => {
        if (selectedEmployee) {
            setSelectedUsers([selectedEmployee.name]);
        }
    }, [selectedEmployee]);

    useEffect(() => {
        if (initialData) {
            if (initialData.title) setShiftTitle(initialData.title);
            if (initialData.color) setShiftColor(initialData.color);
            if (initialData.startTime) setStartTime(initialData.startTime);
            if (initialData.endTime) setEndTime(initialData.endTime);
        }
    }, [initialData]);

    // Convert 12-hour time format (7:00 am) to 24-hour format (07:00:00)
    const convertTo24Hour = (time12h) => {
        const [time, period] = time12h.split(' ');
        let [hours, minutes] = time.split(':');
        
        hours = parseInt(hours);
        
        if (period.toLowerCase() === 'pm' && hours !== 12) {
            hours += 12;
        } else if (period.toLowerCase() === 'am' && hours === 12) {
            hours = 0;
        }
        
        return `${hours.toString().padStart(2, '0')}:${minutes}:00`;
    };

    // Convert DD/MM/YYYY to YYYY-MM-DD
    const convertDateFormat = (dateStr) => {
        const [day, month, year] = dateStr.split('/');
        return `${year}-${month}-${day}`;
    };

    const handleSaveDraft = async () => {
        if (!shiftTitle.trim()) {
            toast.error('Please enter a shift title');
            return;
        }

        if (!selectedEmployee) {
            toast.error('No employee selected');
            return;
        }

        setIsSaving(true);
        try {
            const shiftData = {
                user_id: selectedEmployee.id,
                date: convertDateFormat(date),
                title: shiftTitle,
                start_time: convertTo24Hour(startTime),
                end_time: convertTo24Hour(endTime),
                shift_type_id: null,
                color_hex: shiftColor
            };

            const response = await authFetch('http://localhost:5000/api/shifts/create-for-employee', {
                method: 'POST',
                body: JSON.stringify(shiftData)
            });

            if (!response.ok) {
                throw new Error('Failed to save shift');
            }

            toast.success('Shift saved as draft successfully');
            onSave(shiftData);
        } catch (error) {
            console.error('Error saving shift:', error);
            toast.error('Failed to save shift');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePublish = () => {
        setIsPublishModalOpen(true);
    };

    const handleConfirmPublish = (publishData) => {
        const shiftData = {
            title: shiftTitle,
            color: shiftColor,
            date,
            startTime,
            endTime,
            users: selectedUsers,
            status: 'published',
            employee: selectedEmployee,
            notifyUsers: publishData.notifyUsers,
            notificationMessage: publishData.notificationMessage
        };
        onSave(shiftData);
        setIsPublishModalOpen(false);
    };

    const removeUser = (user) => {
        setSelectedUsers(selectedUsers.filter(u => u !== user));
    };

    const handleColorSelect = (color) => {
        setShiftColor(color);
        setIsColorDropdownOpen(false);
    };

    const getColorLabel = (colorValue) => {
        const option = colorOptions.find(opt => opt.value === colorValue);
        return option ? option.label : 'Color';
    };

    return (
        <>
        <div className="shift-details-form">
            <div className="form-group">
                <label>Shift Title</label>
                <div className="shift-title-input-group">
                    <input
                        type="text"
                        placeholder="Type here"
                        value={shiftTitle}
                        onChange={(e) => setShiftTitle(e.target.value)}
                        className="shift-title-input"
                    />
                    <div className="color-selector">
                        <div
                            className="color-preview"
                            style={{ backgroundColor: shiftColor }}
                        ></div>
                        <div 
                            className="color-dropdown-trigger"
                            onClick={() => setIsColorDropdownOpen(!isColorDropdownOpen)}
                        >
                            {getColorLabel(shiftColor)}
                            <span className="dropdown-arrow">▼</span>
                        </div>
                        {isColorDropdownOpen && (
                            <div className="color-dropdown-menu">
                                {colorOptions.map(option => (
                                    <div
                                        key={option.value}
                                        className="color-option"
                                        onClick={() => handleColorSelect(option.value)}
                                    >
                                        <div 
                                            className="color-swatch"
                                            style={{ backgroundColor: option.value }}
                                        ></div>
                                        <span>{option.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="form-group">
                <label>Date</label>
                <input
                    type="text"
                    value={date}
                    readOnly
                    className="date-input"
                    placeholder="Select a date from calendar"
                />
            </div>

            <div className="form-group time-group">
                <div className="time-input-wrapper">
                    <label>Start</label>
                    <select
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="time-input"
                    >
                        {timeOptions.map((time) => (
                            <option key={`start-${time}`} value={time}>
                                {time}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="time-input-wrapper">
                    <label>End</label>
                    <select
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="time-input"
                    >
                        {timeOptions.map((time) => (
                            <option key={`end-${time}`} value={time}>
                                {time}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label>Users</label>
                <div className="users-section">
                    {selectedUsers.map(user => (
                        <div key={user} className="user-tag">
                            {user}
                            <button
                                className="remove-user-btn"
                                onClick={() => removeUser(user)}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    <button className="add-user-btn">+ Add users</button>
                </div>
            </div>

            <div className="form-actions">
                <div className="primary-actions">
                    <button className="publish-btn" onClick={handlePublish}>
                        Publish
                    </button>
                    <button className="notification-btn">
                        <HiOutlineBell />
                    </button>
                </div>
                <button className="save-draft-btn" onClick={handleSaveDraft} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Draft'}
                </button>
                <button className="delete-btn">
                    🗑️
                </button>
            </div>
        </div>
        <PublishNotificationModal
            isOpen={isPublishModalOpen}
            onClose={() => setIsPublishModalOpen(false)}
            onPublish={handleConfirmPublish}
            shiftData={{ title: shiftTitle, date, startTime, endTime }}
        />
        </>
    );
}
