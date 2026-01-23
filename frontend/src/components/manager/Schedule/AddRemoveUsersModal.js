import React, { useState, useEffect } from 'react';
import '../../../styles/AddRemoveUsersModal.css';

export default function AddRemoveUsersModal({ isOpen, onClose, onSave, department, employees }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployees, setSelectedEmployees] = useState({});

    useEffect(() => {
        if (isOpen && department) {
            // Initialize selected employees based on current department
            const selected = {};
            employees.forEach(emp => {
                selected[emp.name] = emp.department === department;
            });
            setSelectedEmployees(selected);
        }
    }, [isOpen, department, employees]);

    if (!isOpen) return null;

    const toggleEmployeeSelection = (employeeName) => {
        setSelectedEmployees(prev => ({
            ...prev,
            [employeeName]: !prev[employeeName]
        }));
    };

    const handleSave = () => {
        onSave(selectedEmployees);
        onClose();
    };

    // Group employees for the modal by department
    const getEmployeesByDepartment = () => {
        const filteredBySearch = employees.filter(emp => 
            emp.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        const grouped = {};
        filteredBySearch.forEach(emp => {
            if (!grouped[emp.department]) {
                grouped[emp.department] = [];
            }
            grouped[emp.department].push(emp);
        });
        
        return grouped;
    };

    return (
        <div className="add-remove-users-modal-overlay" onClick={onClose}>
            <div className="add-remove-users-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="add-remove-users-modal-header">
                    <h3>Add/Remove Users - {department}</h3>
                    <button className="add-remove-users-close-btn" onClick={onClose}>×</button>
                </div>
                
                <div className="add-remove-users-modal-search">
                    <input
                        type="text"
                        placeholder="Search by name.."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="add-remove-users-search-input"
                    />
                </div>

                <div className="add-remove-users-modal-body">
                    {Object.entries(getEmployeesByDepartment()).map(([dept, deptEmployees]) => (
                        <div key={dept} className="add-remove-users-department-group">
                            <div className="add-remove-users-department-label">{dept}</div>
                            {deptEmployees.map(employee => (
                                <div key={employee.name} className="add-remove-users-employee-item">
                                    <label className="add-remove-users-checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={selectedEmployees[employee.name] || false}
                                            onChange={() => toggleEmployeeSelection(employee.name)}
                                            className="add-remove-users-employee-checkbox"
                                        />
                                        <span className="add-remove-users-employee-name">{employee.name}</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="add-remove-users-modal-footer">
                    <button className="add-remove-users-cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="add-remove-users-save-btn" onClick={handleSave}>Save Changes</button>
                </div>
            </div>
        </div>
    );
}
