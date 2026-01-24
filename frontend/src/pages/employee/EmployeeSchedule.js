import React, { useState, useEffect } from 'react';
import '../../styles/EmployeeSchedule.css';
import EmployeeScheduleHead from '../../components/employee/Schedule/EmployeeScheduleHead';
import EmployeeScheduleGrid from '../../components/employee/Schedule/EmployeeScheduleGrid';
import Header from '../../components/Header/Header';
import { authFetch } from '../../utils/authFetch';

export default function EmployeeSchedule() {
    const [startDate, setStartDate] = useState(new Date());
    const [viewOption, setViewOption] = useState('View everyone');
    const [searchTerm, setSearchTerm] = useState('');
    const [employeesWithShifts, setEmployeesWithShifts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all employees with published shifts
    useEffect(() => {
        async function loadEmployeesAndShifts() {
            try {
                const res = await authFetch("http://localhost:5000/api/shifts/employees-with-published");
                if (!res || !res.ok) {
                    console.error("Failed to fetch employees and shifts");
                    setLoading(false);
                    return;
                }

                const data = await res.json();
                setEmployeesWithShifts(data);
                setLoading(false);
            } catch (err) {
                console.error("Error loading employees and shifts:", err);
                setLoading(false);
            }
        }

        loadEmployeesAndShifts();
    }, []);

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

    if (loading) {
        return <div className="schedule-page"><p>Loading...</p></div>;
    }

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
                    employeesWithShifts={employeesWithShifts}
                />
            </div>
        </div>
    );
}
