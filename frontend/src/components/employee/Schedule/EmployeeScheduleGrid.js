import React, { useState } from 'react';
import { HiOutlineUser, HiOutlineExclamation } from 'react-icons/hi';
import '../../../styles/EmployeeScheduleGrid.css';
import { formatTimeRange } from '../../../utils/dateUtils';

export default function EmployeeScheduleGrid({ weekDays, viewOption, searchTerm, employeesWithShifts, currentUserId }) {
    const [collapsedDepartments, setCollapsedDepartments] = useState({});

    // Transform database data to match the component's expected format
    const transformScheduleData = () => {
        const employeeMap = new Map();
        
        employeesWithShifts.forEach(entry => {
            const userName = `${entry.first_name} ${entry.last_name}`;
            
            if (!employeeMap.has(entry.user_id)) {
                employeeMap.set(entry.user_id, {
                    id: entry.user_id,
                    name: userName,
                    department: entry.department_name || 'Unknown',
                    shifts: []
                });
            }
            
            const employee = employeeMap.get(entry.user_id);
            
            // Only add shifts if there's a published shift request
            if (entry.shift_request_id && entry.published) {
                let shiftInfo = {
                    date: entry.date,
                    type: entry.title || entry.shift_type_name,
                    color: entry.color_hex ? `${entry.color_hex}30` : '#DFF7DF',
                    borderColor: entry.color_hex || '#249D46',
                    time: entry.start_time && entry.end_time ? formatTimeRange(entry.start_time, entry.end_time) : ''
                };
                
                employee.shifts.push(shiftInfo);
            }
        });
        
        return Array.from(employeeMap.values());
    };

    const employees = transformScheduleData();

    // Filter employees based on view option
    let filteredByView = employees;
    if (viewOption === 'View only me' && currentUserId) {
        filteredByView = employees.filter(emp => emp.id === currentUserId);
    }

    // Further filter by search term (case insensitive)
    const filteredEmployees = filteredByView.filter(emp => {
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

    return (
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
                                            
                                            return (
                                                <div key={dayIndex} className="shift-cell">
                                                    {shift && (
                                                        <div 
                                                            className="shift-box"
                                                            style={{
                                                                backgroundColor: shift.color,
                                                                borderLeft: `4px solid ${shift.borderColor}`
                                                            }}
                                                        >
                                                            {shift.time && (
                                                                <div className="shift-time">{shift.time}</div>
                                                            )}
                                                            <div className="shift-type">
                                                                {shift.type}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
