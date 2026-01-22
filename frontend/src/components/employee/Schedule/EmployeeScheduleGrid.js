import React, { useState } from 'react';
import { HiOutlineUser, HiOutlineExclamation } from 'react-icons/hi';
import '../../../styles/EmployeeScheduleGrid.css';
import { scheduleData } from '../../../mock/ScheduleData';
import { getShiftColor, getShiftTime } from '../../../mock/ShiftColorConfig';

export default function EmployeeScheduleGrid({ weekDays, viewOption, searchTerm }) {
    const [collapsedDepartments, setCollapsedDepartments] = useState({});

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
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
