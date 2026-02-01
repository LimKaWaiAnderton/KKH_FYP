import React, { useState } from 'react';
import { HiOutlineUser } from 'react-icons/hi';
import '../../../styles/EmployeeScheduleGrid.css';
import { formatTimeRange } from '../../../utils/dateUtils';

// Define non-working types for the count logic
const NON_WORKING_TYPES = [
    'DO', 'RD', 'OFF', 'PH', 'Annual Leave', 'Medical Leave', 
    'Sick Leave', 'Hospitalization Leave', 'Compassionate Leave', 
    'Childcare Leave', 'Maternity Leave', 'Paternity Leave', 'No Pay Leave'
];

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
            
            // Only add published shifts
            if (entry.shift_id && entry.published) {
                const displayType = entry.title || entry.shift_type_name;
                
                let shiftInfo = {
                    date: entry.date,
                    type: displayType,
                    color: entry.shift_type_id ? `${entry.color_hex}30` : '#FFFFFF',
                    borderColor: entry.color_hex || '#000000',
                    textColor: entry.shift_type_id ? undefined : '#000000',
                    time: entry.start_time && entry.end_time ? formatTimeRange(entry.start_time, entry.end_time) : '',
                    isCustom: !entry.shift_type_id,
                    isRrt: entry.is_rrt || false
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

    const filteredEmployees = filteredByView.filter(emp => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return emp.name.toLowerCase().includes(search) || 
               emp.department.toLowerCase().includes(search);
    });

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
        const total = deptEmployees.length;
        
        const working = deptEmployees.filter(emp => {
            const shift = getShiftForDate(emp, date);
            if (!shift || !shift.type) return false;
            return !NON_WORKING_TYPES.some(nwt => shift.type.toLowerCase().includes(nwt.toLowerCase()));
        }).length;

        return `${working}/${total}`;
    };

    return (
        <div className="schedule-grid">
            {departments.map(dept => {
                const deptEmployees = filteredEmployees.filter(emp => emp.department === dept);
                const isCollapsed = collapsedDepartments[dept];

                return (
                    <div key={dept} className="department-section">
                        <div 
                            className="department-header"
                            onClick={() => toggleDepartment(dept)}
                        >
                            <span className={`collapse-icon ${isCollapsed ? 'collapsed' : ''}`}>▼</span>
                            <span className="department-name">{dept}</span>
                        </div>

                        {!isCollapsed && (
                            <>
                                <div className="staffing-row">
                                    <div className="employee-name-cell"></div>
                                    {weekDays.map((day, index) => (
                                        <div key={index} className="staffing-cell">
                                            <div className="staffing-content">
                                                <span className="staff-icon"><HiOutlineUser /></span>
                                                <span className="staff-count">{getStaffingCount(dept, day.dateString)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {deptEmployees.map((employee, empIndex) => (
                                    <div key={empIndex} className="employee-row">
                                        <div className="employee-name-cell">{employee.name}</div>
                                        {weekDays.map((day, dayIndex) => {
                                            const shift = getShiftForDate(employee, day.dateString);
                                            
                                            return (
                                                <div key={dayIndex} className="shift-cell employee-view-cell">
                                                    {shift && (
                                                        <div 
                                                            className={`shift-box static-box ${shift.isRrt ? 'rrt-shift' : ''}`}
                                                            style={{
                                                                backgroundColor: shift.color,
                                                                borderLeft: `4px solid ${shift.borderColor}`,
                                                                color: shift.textColor
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