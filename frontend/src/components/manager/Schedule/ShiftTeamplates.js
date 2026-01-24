import React, { useState, useEffect } from 'react';
import { HiOutlineBell } from 'react-icons/hi';
import { authFetch } from '../../../utils/authFetch';

export default function ShiftTemplates({ onSelectTemplate, onSave, onClose }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [shiftTypes, setShiftTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchShiftTypes();
    }, []);

    const fetchShiftTypes = async () => {
        try {
            setLoading(true);
            const response = await authFetch('http://localhost:5000/api/shifts/types');
            if (response.ok) {
                const data = await response.json();
                console.log('Fetched shift types:', data);
                setShiftTypes(data);
            } else {
                setError('Failed to load templates');
            }
        } catch (error) {
            console.error('Error fetching shift types:', error);
            setError('Error loading templates');
        } finally {
            setLoading(false);
        }
    };

    const filteredTemplates = shiftTypes.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getTemplateColor = (shiftType) => {
        return shiftType.color_hex || '#4CAF50';
    };

    const handleTemplateClick = (template) => {
        setSelectedTemplate(template);
        console.log('=== Template Click Debug ===');
        console.log('Full template object:', JSON.stringify(template, null, 2));
        console.log('template.start_time:', template.start_time, typeof template.start_time);
        console.log('template.end_time:', template.end_time, typeof template.end_time);
        
        if (onSelectTemplate) {
            // Convert database time format (HH:MM:SS) to form format (h:mm am/pm)
            const formatTime = (timeStr) => {
                console.log('formatTime input:', timeStr, typeof timeStr);
                if (!timeStr) {
                    console.log('formatTime returning null - timeStr is falsy');
                    return null;
                }
                const [hours, minutes] = timeStr.split(':');
                const hour = parseInt(hours);
                const period = hour >= 12 ? 'pm' : 'am';
                const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                const result = `${displayHour}:${minutes} ${period}`;
                console.log('formatTime output:', result);
                return result;
            };
            
            const formattedStart = formatTime(template.start_time);
            const formattedEnd = formatTime(template.end_time);
            
            console.log('Formatted start time:', formattedStart);
            console.log('Formatted end time:', formattedEnd);
            
            // Pass template data with shift_type_id and times from database
            onSelectTemplate({
                title: template.name,
                color: template.color_hex,
                startTime: formattedStart,
                endTime: formattedEnd,
                shift_type_id: template.id  // Include the ID for database reference
            });
        }
    };

    const handlePublish = () => {
        if (selectedTemplate && onSave) {
            onSave({
                template: selectedTemplate,
                status: 'published'
            });
        }
    };

    const handleSaveDraft = () => {
        if (selectedTemplate && onSave) {
            onSave({
                template: selectedTemplate,
                status: 'draft'
            });
        }
    };

    return (
        <div className="shift-templates">
            <div className="template-search">
                <input
                    type="text"
                    placeholder="Search.."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="template-search-input"
                />
            </div>

            <div className="template-grid">
                {loading && <div>Loading templates...</div>}
                {error && <div style={{ color: 'red' }}>{error}</div>}
                {!loading && !error && filteredTemplates.length === 0 && (
                    <div>No templates found</div>
                )}
                {filteredTemplates.map(template => (
                    <div
                        key={template.id}
                        className={`template-card ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
                        style={{ backgroundColor: getTemplateColor(template) }}
                        onClick={() => handleTemplateClick(template)}
                    >
                        <div className="template-title">
                            {template.name}
                        </div>
                        <button className="template-menu-btn">⋮</button>
                    </div>
                ))}
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
                <button className="save-draft-btn" onClick={handleSaveDraft}>
                    Save Draft
                </button>
                <button className="delete-btn">
                    🗑️
                </button>
            </div>
        </div>
    );
}
