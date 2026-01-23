import React, { useState } from 'react';
import '../../../styles/ShiftCreationDrawer.css';
import ShiftDetailsForm from './ShiftDetailsForm';
import ShiftTemplates from './ShiftTeamplates';

export default function ShiftCreationDrawer({ isOpen, onClose, selectedDate, selectedEmployee }) {
    const [activeTab, setActiveTab] = useState('details'); // 'details' or 'templates'
    const [formData, setFormData] = useState(null);
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 300); // Match animation duration
    };

    if (!isOpen && !isClosing) return null;

    const formatDateForHeader = (dateString) => {
        const date = new Date(dateString);
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
        
        const day = date.getDate();
        const dayName = dayNames[date.getDay()];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        
        return `${day} ${month} ${year}, ${dayName}`;
    };

    const handleSave = (shiftData) => {
        console.log('Saving shift:', shiftData);
        // TODO: Implement actual save logic (update ScheduleData)
        onClose();
    };

    const handleTemplateSelect = (template) => {
        // Switch to details tab and pre-fill form with template data
        setFormData({
            title: template.title,
            color: template.color,
            startTime: template.start_time,
            endTime: template.end_time,
            shift_type: template.shift_type
        });
        setActiveTab('details');
    };

    return (
        <>
            <div className={`drawer-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}></div>
            <div className={`shift-creation-drawer ${isClosing ? 'closing' : ''}`}>
                <div className="drawer-header">
                    <button className="close-btn" onClick={handleClose}>×</button>
                    <h2 className="drawer-title">
                        {selectedDate ? formatDateForHeader(selectedDate) : 'Create Shift'}
                    </h2>
                </div>

                <div className="drawer-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
                        onClick={() => setActiveTab('details')}
                    >
                        Shift Details
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'templates' ? 'active' : ''}`}
                        onClick={() => setActiveTab('templates')}
                    >
                        Templates
                    </button>
                </div>

                <div className="drawer-content">
                    {activeTab === 'details' ? (
                        <ShiftDetailsForm
                            selectedDate={selectedDate}
                            selectedEmployee={selectedEmployee}
                            onClose={handleClose}
                            onSave={handleSave}
                            initialData={formData}
                        />
                    ) : (
                        <ShiftTemplates 
                            onSelectTemplate={handleTemplateSelect}
                            onSave={handleSave}
                            onClose={handleClose}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
