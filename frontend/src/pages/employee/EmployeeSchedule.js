import React, { useState } from 'react';
import '../../styles/EmployeeSchedule.css';
import EmployeeScheduleHead from '../../components/employee/Schedule/EmployeeScheduleHead';
import EmployeeScheduleGrid from '../../components/employee/Schedule/EmployeeScheduleGrid';
import Header from '../../components/Header/Header';

export default function EmployeeSchedule() {
    const [startDate, setStartDate] = useState(new Date());
    const [viewOption, setViewOption] = useState('View everyone');
    const [searchTerm, setSearchTerm] = useState('');

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

    return (
        <div className="schedule-page">
            <Header title="Schedule" />
            <div className="container">
                <EmployeeScheduleHead 
                    startDate={startDate}
                    setStartDate={setStartDate}
                    viewOption={viewOption}
                    setViewOption={setViewOption}
                    weekDays={weekDays}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />
                <EmployeeScheduleGrid 
                    weekDays={weekDays}
                    viewOption={viewOption}
                    searchTerm={searchTerm}
                />
            </div>
        </div>
    );
}
