import React, { useState } from 'react';
import { HiOutlineBell } from 'react-icons/hi';
import { shiftTemplates } from '../../../mock/ShiftTemplateData';

export default function ShiftTemplates({ onSelectTemplate, onSave, onClose }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    const filteredTemplates = shiftTemplates.filter(template =>
        template.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleTemplateClick = (template) => {
        setSelectedTemplate(template);
        if (onSelectTemplate) {
            onSelectTemplate(template);
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
                {filteredTemplates.map(template => (
                    <div
                        key={template.id}
                        className={`template-card ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
                        style={{ backgroundColor: template.color }}
                        onClick={() => handleTemplateClick(template)}
                    >
                        <div className="template-title">
                            {template.title}
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
