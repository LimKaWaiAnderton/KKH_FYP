import React, { useState } from 'react';
import { HiOutlineUser, HiOutlinePencil, HiOutlineCog, HiOutlineCheck, HiOutlineX, HiTrash } from 'react-icons/hi';
import '../../../styles/ManagerScheduleGrid.css';
import ScheduleGroupsModal from './ScheduleGroupsModal';
import AddRemoveUsersModal from './AddRemoveUsersModal';
import { authFetch } from '../../../utils/authFetch';
import { formatTimeRange } from '../../../utils/dateUtils';

const NON_WORKING_TYPES = [
    'DO', 'RD', 'OFF', 'PH', 'Annual Leave', 'Medical Leave', 
    'Sick Leave', 'Hospitalization Leave', 'Compassionate Leave', 
    'Childcare Leave', 'Maternity Leave', 'Paternity Leave', 'No Pay Leave'
];

export default function ManagerScheduleGrid({ weekDays, searchTerm, onAddShift, usersWithShifts, onShiftUpdate }) {
    const [collapsedDepartments, setCollapsedDepartments] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [isGroupsModalOpen, setIsGroupsModalOpen] = useState(false);
    
    const [scheduleGroups, setScheduleGroups] = useState([
        { id: 1, name: 'CE', userCount: 3 }, 
        { id: 2, name: '56', userCount: 2 }
    ]);

    // --- DELETE HANDLER ---
    const handleDeleteShift = async (shiftId) => {
        if (!window.confirm("Are you sure you want to remove this shift?")) return;
        try {
            const res = await authFetch(`https://kkh-fyp-backend.onrender.com/api/shifts/${shiftId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                if (onShiftUpdate) onShiftUpdate(); // Refresh grid
            } else {
                alert("Failed to delete shift");
            }
        } catch (err) {
            console.error("Error deleting shift:", err);
        }
    };

    const transformDatabaseData = () => {
        const employeeMap = new Map();
        usersWithShifts.forEach(entry => {
            const userName = `${entry.first_name} ${entry.last_name}`;
            if (!employeeMap.has(entry.user_id)) {
                employeeMap.set(entry.user_id, {
                    id: entry.user_id, name: userName, department: entry.department_name || 'Unknown', shifts: []
                });
            }
            const employee = employeeMap.get(entry.user_id);

            if (entry.shift_id) {
                employee.shifts.push({
                    date: entry.date,
                    type: entry.title || entry.shift_type_name,
                    color: entry.shift_type_id ? `${entry.color_hex}30` : '#FFFFFF',
                    borderColor: entry.color_hex || '#000000',
                    textColor: entry.shift_type_id ? undefined : '#000000',
                    time: entry.start_time && entry.end_time ? formatTimeRange(entry.start_time, entry.end_time) : '',
                    published: entry.published,
                    shiftId: entry.shift_id,
                    isRrt: entry.is_rrt || false,
                    isRequest: false 
                });
            }
            
            if (entry.shift_request_id) {
                employee.shifts.push({
                    date: entry.date,
                    type: entry.title || entry.shift_type_name,
                    color: entry.shift_type_id ? `${entry.color_hex}30` : '#FFFFFF',
                    borderColor: entry.color_hex || '#000000',
                    textColor: entry.shift_type_id ? undefined : '#000000',
                    time: entry.start_time && entry.end_time ? formatTimeRange(entry.start_time, entry.end_time) : '',
                    published: false,
                    shiftRequestId: entry.shift_request_id,
                    status: entry.request_status,
                    isRequest: true 
                });
            }
        });
        return Array.from(employeeMap.values());
    };

    const employees = transformDatabaseData();
    const filteredEmployees = employees.filter(emp => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return emp.name.toLowerCase().includes(search) || emp.department.toLowerCase().includes(search);
    });

    const departments = [...new Set(filteredEmployees.map(emp => emp.department))];
    const toggleDepartment = (dept) => setCollapsedDepartments(prev => ({...prev, [dept]: !prev[dept]}));
    const getShiftForDate = (employee, date) => employee.shifts.find(shift => shift.date === date);
    
    const getDailyStats = (dept, date) => {
        const deptEmployees = employees.filter(emp => emp.department === dept);
        const total = deptEmployees.length;
        const working = deptEmployees.filter(emp => {
            const shift = getShiftForDate(emp, date);
            if (!shift || !shift.type) return false;
            const type = shift.type.trim();
            return !NON_WORKING_TYPES.some(nwt => type.toLowerCase().includes(nwt.toLowerCase()));
        }).length;
        return { working, total };
    };

    const openModal = (dept) => { setSelectedDepartment(dept); setIsModalOpen(true); };
    const closeModal = () => { setIsModalOpen(false); setSelectedDepartment(null); };
    const openGroupsModal = (dept) => { setSelectedDepartment(dept); setIsGroupsModalOpen(true); };
    const closeGroupsModal = () => { setIsGroupsModalOpen(false); setSelectedDepartment(null); };
    const handleSaveGroups = (groups) => { setScheduleGroups(groups); };
    const handleSaveEmployees = (selectedEmployees) => { console.log('Selected employees:', selectedEmployees); };
    const handleApproveShift = async (id) => { try { const res = await authFetch(`https://kkh-fyp-backend.onrender.com/api/shifts/${id}/approve`, { method: 'PATCH' }); if (res.ok && onShiftUpdate) onShiftUpdate(); } catch (err) { console.error(err); } };
    const handleRejectShift = async (id) => { try { const res = await authFetch(`https://kkh-fyp-backend.onrender.com/api/shifts/${id}/reject`, { method: 'PATCH' }); if (res.ok && onShiftUpdate) onShiftUpdate(); } catch (err) { console.error(err); } };

    return (
        <>
            <div className="schedule-grid">
                {departments.map(dept => {
                const deptEmployees = filteredEmployees.filter(emp => emp.department === dept);
                const isCollapsed = collapsedDepartments[dept];

                return (
                    <div key={dept} className="department-section">
                        <div className="department-header">
                            <div className="department-header-left" onClick={() => toggleDepartment(dept)}>
                                <span className={`collapse-icon ${isCollapsed ? 'collapsed' : ''}`}>▼</span>
                                <span className="department-name">{dept}</span>
                            </div>
                            <button className="department-settings-btn" onClick={(e) => { e.stopPropagation(); openGroupsModal(dept); }}>
                                <HiOutlineCog />
                            </button>
                        </div>

                        {!isCollapsed && (
                            <>
                                <div className="staffing-row">
                                    <div className="employee-name-cell"></div>
                                    {weekDays.map((day, index) => {
                                        const stats = getDailyStats(dept, day.dateString);
                                        return (
                                            <div key={index} className="staffing-cell">
                                                <div className="staffing-content">
                                                    <span className="staff-icon"><HiOutlineUser /></span>
                                                    <span className="staff-count">{stats.working}/{stats.total}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

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
                                                            className={`shift-box ${shift.isRrt ? 'rrt-shift' : ''}`}
                                                            style={{
                                                                backgroundColor: shift.color,
                                                                borderLeft: `4px solid ${shift.borderColor}`,
                                                                color: shift.textColor,
                                                            }}
                                                        >
                                                            {shift.time && <div className="shift-time">{shift.time}</div>}
                                                            <div className="shift-type">{shift.type}</div>
                                                            
                                                            {/* === THE CENTERED DELETE BUTTON === */}
                                                            {!shift.isRequest && (
                                                                <button 
                                                                    className="delete-shift-btn"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDeleteShift(shift.shiftId);
                                                                    }}
                                                                    title="Remove Shift"
                                                                >
                                                                    <HiTrash size={20} />
                                                                </button>
                                                            )}

                                                            {shift.status === 'pending' && (
                                                                <div className="shift-actions">
                                                                    <button className="shift-approve-btn" onClick={(e) => { e.stopPropagation(); handleApproveShift(shift.shiftRequestId); }}><HiOutlineCheck /></button>
                                                                    <button className="shift-reject-btn" onClick={(e) => { e.stopPropagation(); handleRejectShift(shift.shiftRequestId); }}><HiOutlineX /></button>
                                                                </div>
                                                            )}

                                                            {shift.status === 'approved' && <div className="shift-status-badge approved">Approved</div>}
                                                        </div>
                                                    ) : isEmpty && (
                                                        <button className="add-shift-btn" onClick={() => onAddShift(day.dateString, employee)}>+</button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                                <div className="add-remove-users-row">
                                    <div className="add-remove-users-cell">
                                        <button className="add-remove-users-btn" onClick={() => openModal(dept)}>
                                            <HiOutlinePencil /> Add/remove users
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                );
            })}
            </div>
            <AddRemoveUsersModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSaveEmployees} department={selectedDepartment} employees={employees} />
            <ScheduleGroupsModal isOpen={isGroupsModalOpen} onClose={closeGroupsModal} onSave={handleSaveGroups} initialGroups={scheduleGroups} />
        </>
    );
}