import React, { useState } from 'react';
import '../../../styles/ManagerScheduleGrid.css';
import { scheduleData } from '../../../mock/ScheduleData';
import { getShiftColor, getShiftTime } from '../../../mock/ShiftColorConfig';

export default function ManagerScheduleGrid({ weekDays, viewOption, searchTerm }) {
    const [collapsedDepartments, setCollapsedDepartments] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [modalSearchTerm, setModalSearchTerm] = useState('');
    const [selectedEmployees, setSelectedEmployees] = useState({});

    // Transform schedule data to match the component's expected format
    const transformScheduleData = () => {
        const employeeMap = new Map();

        scheduleData.forEach(entry => {
            if (!employeeMap.has(entry.name)) {
                employeeMap.set(entry.name, {
                    name: entry.name,
                    department: entry.department_id,
                    shifts: []
                });
            }

            const employee = employeeMap.get(entry.name);

            // Determine shift display based on data
            let shiftInfo = {
                date: entry.date,
                type: entry.leave_type || entry.shift_type,
                color: getShiftColor(entry.shift_type, entry.leave_type)
            };

            // Add time for shifts (not for leave)
            if (entry.shift_type && !entry.leave_type) {
                const time = getShiftTime(entry.shift_type);
                if (time) {
                    shiftInfo.time = time;
                }
            }

            employee.shifts.push(shiftInfo);
        });

        return Array.from(employeeMap.values());
    };

    const employees = transformScheduleData();

    // Filter employees based on search term (case insensitive)
    const filteredEmployees = employees.filter(emp => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return emp.name.toLowerCase().includes(search) ||
            emp.department.toLowerCase().includes(search);
    });

    // Group employees by department
    const departments = [...new Set(filteredEmployees.map(emp => emp.department))];

    const toggleDepartment = (dept) => {
        setCollapsedDepartments(prev => ({
            ...prev,
            [dept]: !prev[dept]
        }));
    };

    const getShiftForDate = (employee, date) => {
        return employee.shifts.find(shift => shift.date === date);
    };

    const getStaffingCount = (dept, date) => {
        const deptEmployees = employees.filter(emp => emp.department === dept);
        const working = deptEmployees.filter(emp => {
            const shift = getShiftForDate(emp, date);
            return shift && !['Annual Leave', 'Medical Leave', 'Compassionate Leave', 'OFF'].includes(shift.type);
        }).length;
        return `${working}/${deptEmployees.length}`;
    };

    const openModal = (dept) => {
        setSelectedDepartment(dept);
        setIsModalOpen(true);
        setModalSearchTerm('');
        
        // Initialize selected employees based on current department
        const selected = {};
        employees.forEach(emp => {
            selected[emp.name] = emp.department === dept;
        });
        setSelectedEmployees(selected);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDepartment(null);
        setModalSearchTerm('');
    };

    const toggleEmployeeSelection = (employeeName) => {
        setSelectedEmployees(prev => ({
            ...prev,
            [employeeName]: !prev[employeeName]
        }));
    };

    const handleSaveChanges = () => {
        // TODO: Implement save logic to update employee assignments
        console.log('Selected employees:', selectedEmployees);
        closeModal();
    };

    // Group employees for the modal by department
    const getEmployeesByDepartment = () => {
        const filteredBySearch = employees.filter(emp => 
            emp.name.toLowerCase().includes(modalSearchTerm.toLowerCase())
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
        <>
            <div className="schedule-grid">
                {departments.map(dept => {
                const deptEmployees = filteredEmployees.filter(emp => emp.department === dept);
                const isCollapsed = collapsedDepartments[dept];

                return (
                    <div key={dept} className="department-section">
                        {/* Department Header */}
                        <div
                            className="department-header"
                            onClick={() => toggleDepartment(dept)}
                        >
                            <span className={`collapse-icon ${isCollapsed ? 'collapsed' : ''}`}>▼</span>
                            <span className="department-name">{dept}</span>
                        </div>

                        {!isCollapsed && (
                            <>
                                {/* Staffing Count Row */}
                                <div className="staffing-row">
                                    <div className="employee-name-cell"></div>
                                    {weekDays.map((day, index) => (
                                        <div key={index} className="staffing-cell">
                                            <span className="staff-icon">👤</span>
                                            <span className="staff-count">{getStaffingCount(dept, day.dateString)}</span>
                                            {index === 0 && <span className="alert-icon">⚠️</span>}
                                        </div>
                                    ))}
                                </div>

                                {/* Employee Rows */}
                                {deptEmployees.map((employee, empIndex) => (
                                    <div key={empIndex} className="employee-row">
                                        <div className="employee-name-cell">{employee.name}</div>
                                        {weekDays.map((day, dayIndex) => {
                                            const shift = getShiftForDate(employee, day.dateString);

                                            return (
                                                <div key={dayIndex} className="shift-cell">
                                                    {shift && (
                                                        <div className={`shift-box ${shift.color}`}>
                                                            {shift.time && (
                                                                <div className="shift-time">{shift.time}</div>
                                                            )}
                                                            <div className="shift-type">
                                                                {shift.subtitle || shift.type}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}

                                {/* Add/Remove Users Link */}
                                <div className="add-remove-users-row">
                                    <div className="add-remove-users-cell">
                                        <button className="add-remove-users-btn" onClick={() => openModal(dept)}>
                                            <span className="user-icon">👤</span>
                                            Add/remove users
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                );
            })}
            </div>

            {/* Add/Remove Users Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Add/Remove Users - {selectedDepartment}</h3>
                            <button className="modal-close-btn" onClick={closeModal}>×</button>
                        </div>
                        
                        <div className="modal-search">
                            <input
                                type="text"
                                placeholder="Search by name.."
                                value={modalSearchTerm}
                                onChange={(e) => setModalSearchTerm(e.target.value)}
                                className="modal-search-input"
                            />
                        </div>

                        <div className="modal-body">
                            {Object.entries(getEmployeesByDepartment()).map(([dept, deptEmployees]) => (
                                <div key={dept} className="modal-department-group">
                                    <div className="modal-department-label">{dept}</div>
                                    {deptEmployees.map(employee => (
                                        <div key={employee.name} className="modal-employee-item">
                                            <label className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedEmployees[employee.name] || false}
                                                    onChange={() => toggleEmployeeSelection(employee.name)}
                                                    className="employee-checkbox"
                                                />
                                                <span className="employee-name-label">{employee.name}</span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>

                        <div className="modal-footer">
                            <button className="modal-cancel-btn" onClick={closeModal}>Cancel</button>
                            <button className="modal-save-btn" onClick={handleSaveChanges}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
