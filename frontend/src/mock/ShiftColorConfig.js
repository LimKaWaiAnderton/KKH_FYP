// Color mapping for shift types and leave types
// This matches the CSS classes in EmployeeScheduleGrid.css

export const shiftColorMap = {
    // Shift Types
    'AM': 'gray',
    'PM': 'green',
    'Night': 'gray',
    'OFF': 'orange-border',

    // Leave Types
    'Annual Leave': 'gray-border',
    'Medical Leave': 'gray-border',
    'Compassionate Leave': 'gray-border',
    'Maternity Leave': 'gray-border',
    'Paternity Leave': 'gray-border',

    // Special Types
    'PAM@HOME': 'pink',
    'RRT': 'blue',
    'DO': 'orange-border',
    'RD': 'orange-border',
    'NNJ': 'orange-filled',
};

// Shift time ranges
export const shiftTimeMap = {
    'AM': '07:00 - 16:00',
    'PM': '11:30 - 20:00',
    'Night': '22:00 - 07:00',
};

// Helper function to get color for a schedule entry
export const getShiftColor = (shiftType, leaveType) => {
    if (leaveType) {
        return shiftColorMap[leaveType] || 'gray-border';
    }
    return shiftColorMap[shiftType] || 'gray';
};

// Helper function to get time for a shift type
export const getShiftTime = (shiftType) => {
    return shiftTimeMap[shiftType] || null;
};
