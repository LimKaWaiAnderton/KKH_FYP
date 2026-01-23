import React, { useState } from 'react';
import '../../styles/ManagerSchedule.css';
import ManagerScheduleHead from '../../components/manager/Schedule/ManagerScheduleHead';
import ManagerScheduleGrid from '../../components/manager/Schedule/ManagerScheduleGrid';
import ShiftCreationDrawer from '../../components/manager/Schedule/ShiftCreationDrawer';
import Header from '../../components/Header/Header';

export default function ManagerSchedule() {
    const [startDate, setStartDate] = useState(new Date());
    const [viewOption, setViewOption] = useState('View everyone');
    const [searchTerm, setSearchTerm] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    // Generate array of 7 days starting from startDate
    const generateWeekDays = (date) => {
        const days = [];
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(date);
            currentDate.setDate(date.getDate() + i);
            
            // Format date as YYYY-MM-DD in local timezone (not UTC)
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');
            const dateString = `${year}-${month}-${day}`;
            
            days.push({
                date: currentDate.getDate(),
                day: dayNames[currentDate.getDay()],
                month: monthNames[currentDate.getMonth()],
                fullDate: currentDate,
                dateString: dateString
            });
        }
        return days;
    };

    const weekDays = generateWeekDays(startDate);

    const handleAddShift = (dateString, employee) => {
        setSelectedDate(dateString);
        setSelectedEmployee(employee);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setSelectedDate(null);
        setSelectedEmployee(null);
    };

    return (
        <div className="schedule-page">
            <Header title="Schedule" />
            <div className="container">
                <ManagerScheduleHead 
                    startDate={startDate}
                    setStartDate={setStartDate}
                    viewOption={viewOption}
                    setViewOption={setViewOption}
                    weekDays={weekDays}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />
                <ManagerScheduleGrid 
                    weekDays={weekDays}
                    viewOption={viewOption}
                    searchTerm={searchTerm}
                    onAddShift={handleAddShift}
                />
            </div>
            <ShiftCreationDrawer 
                isOpen={isDrawerOpen}
                onClose={handleCloseDrawer}
                selectedDate={selectedDate}
                selectedEmployee={selectedEmployee}
            />
        </div>
    );
}
