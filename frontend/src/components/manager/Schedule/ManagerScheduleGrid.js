import React, { useState } from 'react';
import { HiOutlineUser, HiOutlinePencil, HiOutlineExclamation, HiOutlineCog } from 'react-icons/hi';
import '../../../styles/ManagerScheduleGrid.css';
import { scheduleData } from '../../../mock/ScheduleData';
import { getShiftColor, getShiftTime } from '../../../mock/ShiftColorConfig';
import ScheduleGroupsModal from './ScheduleGroupsModal';
import AddRemoveUsersModal from './AddRemoveUsersModal';

export default function ManagerScheduleGrid({ weekDays, viewOption, searchTerm, onAddShift }) {
    const [collapsedDepartments, setCollapsedDepartments] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [isGroupsModalOpen, setIsGroupsModalOpen] = useState(false);
    const [scheduleGroups, setScheduleGroups] = useState([
        { id: 1, name: 'CE', userCount: 4 },
        { id: 2, name: '56', userCount: 2 }
    ]);

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
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDepartment(null);
    };

    const openGroupsModal = (dept) => {
        setSelectedDepartment(dept);
        setIsGroupsModalOpen(true);
    };

    const closeGroupsModal = () => {
        setIsGroupsModalOpen(false);
        setSelectedDepartment(null);
    };

    const handleSaveGroups = (groups) => {
        setScheduleGroups(groups);
        console.log('Saved groups:', groups);
    };

    const handleSaveEmployees = (selectedEmployees) => {
        // TODO: Implement save logic to update employee assignments
        console.log('Selected employees:', selectedEmployees);
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
                        <div className="department-header">
                            <div 
                                className="department-header-left"
                                onClick={() => toggleDepartment(dept)}
                            >
                                <span className={`collapse-icon ${isCollapsed ? 'collapsed' : ''}`}>▼</span>
                                <span className="department-name">{dept}</span>
                            </div>
                            <button 
                                className="department-settings-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openGroupsModal(dept);
                                }}
                            >
                                <HiOutlineCog />
                            </button>
                        </div>

                        {!isCollapsed && (
                            <>
                                {/* Staffing Count Row */}
                                <div className="staffing-row">
                                    <div className="employee-name-cell"></div>
                                    {weekDays.map((day, index) => (
                                        <div key={index} className="staffing-cell">
                                            <div className="staffing-content">
                                                <span className="staff-icon"><HiOutlineUser /></span>
                                                <span className="staff-count">{getStaffingCount(dept, day.dateString)}</span>
                                                {index === 0 && <span className="alert-icon"><HiOutlineExclamation /></span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Employee Rows */}
                                {deptEmployees.map((employee, empIndex) => (
                                    <div key={empIndex} className="employee-row">
                                        <div className="employee-name-cell">{employee.name}</div>
                                        {weekDays.map((day, dayIndex) => {
                                            const shift = getShiftForDate(employee, day.dateString);
                                            const isEmpty = !shift || shift.type === null;

                                            return (
                                                <div key={dayIndex} className="shift-cell">
                                                    {shift && shift.type ? (
                                                        <div className={`shift-box ${shift.color}`}>
                                                            {shift.time && (
                                                                <div className="shift-time">{shift.time}</div>
                                                            )}
                                                            <div className="shift-type">
                                                                {shift.subtitle || shift.type}
                                                            </div>
                                                        </div>
                                                    ) : isEmpty && (
                                                        <button 
                                                            className="add-shift-btn"
                                                            onClick={() => onAddShift(day.dateString, employee)}
                                                        >
                                                            +
                                                        </button>
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
                                            <span className="user-icon"><HiOutlinePencil /></span>
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
            <AddRemoveUsersModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSave={handleSaveEmployees}
                department={selectedDepartment}
                employees={employees}
            />

            {/* Schedule Groups Modal */}
            <ScheduleGroupsModal
                isOpen={isGroupsModalOpen}
                onClose={closeGroupsModal}
                onSave={handleSaveGroups}
                initialGroups={scheduleGroups}
            />
        </>
    );
}
