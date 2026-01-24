import React, { useState } from 'react';
import { HiOutlineUser, HiOutlinePencil, HiOutlineExclamation, HiOutlineCog, HiOutlineCheck, HiOutlineX } from 'react-icons/hi';
import '../../../styles/ManagerScheduleGrid.css';
import ScheduleGroupsModal from './ScheduleGroupsModal';
import AddRemoveUsersModal from './AddRemoveUsersModal';
import { authFetch } from '../../../utils/authFetch';
import { formatTimeRange } from '../../../utils/dateUtils';

export default function ManagerScheduleGrid({ weekDays, searchTerm, onAddShift, usersWithShifts, onShiftUpdate }) {
    const [collapsedDepartments, setCollapsedDepartments] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [isGroupsModalOpen, setIsGroupsModalOpen] = useState(false);
    const [scheduleGroups, setScheduleGroups] = useState([
        { id: 1, name: 'CE', userCount: 4 },
        { id: 2, name: '56', userCount: 2 }
    ]);

    // Transform database data to match the component's expected format
    const transformDatabaseData = () => {
        const employeeMap = new Map();

        usersWithShifts.forEach(entry => {
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

            // Add manager-assigned shifts (from shifts table)
            if (entry.shift_id) {
                let shiftInfo = {
                    date: entry.date,
                    type: entry.title || entry.shift_type_name,
                    // Custom shifts (no shift_type_id) get white background
                    color: entry.shift_type_id ? `${entry.color_hex}30` : '#FFFFFF',
                    borderColor: entry.color_hex || '#000000',
                    textColor: entry.shift_type_id ? undefined : '#000000', // Black text for custom shifts
                    time: entry.start_time && entry.end_time ? formatTimeRange(entry.start_time, entry.end_time) : '',
                    published: entry.published,
                    shiftId: entry.shift_id,
                    isCustom: !entry.shift_type_id  // Flag for custom styling
                };

                employee.shifts.push(shiftInfo);
            }
            
            // Add employee shift requests (from shift_requests table)
            if (entry.shift_request_id) {
                let shiftInfo = {
                    date: entry.date,
                    type: entry.title || entry.shift_type_name,
                    color: entry.shift_type_id ? `${entry.color_hex}30` : '#FFFFFF',
                    borderColor: entry.color_hex || '#000000',
                    textColor: entry.shift_type_id ? undefined : '#000000',
                    time: entry.start_time && entry.end_time ? formatTimeRange(entry.start_time, entry.end_time) : '',
                    published: false,
                    shiftRequestId: entry.shift_request_id,
                    status: entry.request_status, // pending, approved, rejected
                    isRequest: true // Flag to identify shift requests
                };

                employee.shifts.push(shiftInfo);
            }
        });

        return Array.from(employeeMap.values());
    };

    const employees = transformDatabaseData();

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

    const handleApproveShift = async (shiftRequestId) => {
        try {
            const res = await authFetch(`http://localhost:5000/api/shifts/${shiftRequestId}/approve`, {
                method: 'PATCH'
            });

            if (res.ok) {
                console.log('Shift approved successfully');
                // Trigger parent refresh
                if (onShiftUpdate) {
                    onShiftUpdate();
                }
            } else {
                console.error('Failed to approve shift');
            }
        } catch (err) {
            console.error('Error approving shift:', err);
        }
    };

    const handleRejectShift = async (shiftRequestId) => {
        try {
            const res = await authFetch(`http://localhost:5000/api/shifts/${shiftRequestId}/reject`, {
                method: 'PATCH'
            });

            if (res.ok) {
                console.log('Shift rejected successfully');
                // Trigger parent refresh
                if (onShiftUpdate) {
                    onShiftUpdate();
                }
            } else {
                console.error('Failed to reject shift');
            }
        } catch (err) {
            console.error('Error rejecting shift:', err);
        }
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
                                                        <div 
                                                            className="shift-box"
                                                            style={{
                                                                backgroundColor: shift.color,
                                                                borderLeft: `4px solid ${shift.borderColor}`,
                                                                color: shift.textColor // Apply black text for custom shifts
                                                            }}
                                                        >
                                                            {shift.time && (
                                                                <div className="shift-time">{shift.time}</div>
                                                            )}
                                                            <div className="shift-type">
                                                                {shift.type}
                                                            </div>
                                                            {shift.status === 'pending' && (
                                                                <>
                                                                    <div className="shift-status-badge">Pending</div>
                                                                    <div className="shift-actions">
                                                                        <button 
                                                                            className="shift-approve-btn"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleApproveShift(shift.shiftRequestId);
                                                                            }}
                                                                            title="Approve"
                                                                        >
                                                                            <HiOutlineCheck />
                                                                        </button>
                                                                        <button 
                                                                            className="shift-reject-btn"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleRejectShift(shift.shiftRequestId);
                                                                            }}
                                                                            title="Reject"
                                                                        >
                                                                            <HiOutlineX />
                                                                        </button>
                                                                    </div>
                                                                </>
                                                            )}
                                                            {shift.status === 'approved' && (
                                                                <div className="shift-status-badge approved">Approved</div>
                                                            )}
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
