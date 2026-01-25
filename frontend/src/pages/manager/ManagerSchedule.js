import React, { useState, useEffect } from 'react';
import { HiOutlineBell } from 'react-icons/hi';
import '../../styles/ManagerSchedule.css';
import ManagerScheduleHead from '../../components/manager/Schedule/ManagerScheduleHead';
import ManagerScheduleGrid from '../../components/manager/Schedule/ManagerScheduleGrid';
import ShiftCreationDrawer from '../../components/manager/Schedule/ShiftCreationDrawer';
import HeaderWithPublishBtn from '../../components/Header/HeaderWithPublishBtn';
import PublishNotificationModal from '../../components/manager/Schedule/PublishNotificationModal';
import { authFetch } from '../../utils/authFetch';
import toast from 'react-hot-toast';

export default function ManagerSchedule() {
    const [startDate, setStartDate] = useState(new Date());
    const [searchTerm, setSearchTerm] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [usersWithShifts, setUsersWithShifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    const [publishData, setPublishData] = useState(null);

    // Fetch all users and their shifts
    useEffect(() => {
        async function loadUsersAndShifts() {
            try {
                const res = await authFetch("http://localhost:5000/api/shifts/users-with-pending");
                if (!res || !res.ok) {
                    console.error("Failed to fetch users and shifts");
                    setLoading(false);
                    return;
                }

                const data = await res.json();
                setUsersWithShifts(data);
                setLoading(false);
            } catch (err) {
                console.error("Error loading users and shifts:", err);
                setLoading(false);
            }
        }

        loadUsersAndShifts();
    }, []);

    // Function to refresh users and shifts after approve/reject
    const refreshShifts = async () => {
        try {
            const res = await authFetch("http://localhost:5000/api/shifts/users-with-pending");
            if (res && res.ok) {
                const data = await res.json();
                setUsersWithShifts(data);
            }
        } catch (err) {
            console.error("Error refreshing shifts:", err);
        }
    };

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

    const handlePublish = async () => {
        // Calculate the date range for the current week view
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);

        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const formatDisplayDate = (date) => {
            const day = date.getDate();
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const month = monthNames[date.getMonth()];
            return `${day} ${month}`;
        };

        // Count shifts that will be published (only unpublished shifts, not pending requests)
        let shiftCount = 0;
        const startDateStr = formatDate(startDate);
        const endDateStr = formatDate(endDate);

        usersWithShifts.forEach(entry => {
            // Count unpublished manager-assigned shifts and approved employee requests
            // (approved requests are already moved to shifts table with published=false)
            if (entry.shift_id && 
                entry.date >= startDateStr && 
                entry.date <= endDateStr && 
                entry.published === false) {
                shiftCount++;
            }
        });

        // Prepare data for modal
        setPublishData({
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
            startDateDisplay: formatDisplayDate(startDate),
            endDateDisplay: formatDisplayDate(endDate),
            shiftCount: shiftCount
        });

        // Open modal
        setIsPublishModalOpen(true);
    };

    const handleConfirmPublish = async (notificationSettings) => {
        try {
            const res = await authFetch("http://localhost:5000/api/shifts/publish", {
                method: "POST",
                body: JSON.stringify({
                    startDate: publishData.startDate,
                    endDate: publishData.endDate,
                    ...notificationSettings
                })
            });

            if (res && res.ok) {
                const data = await res.json();
                toast.success(`Schedule published! ${data.publishedCount} approved shifts are now visible to employees.`);
                setIsPublishModalOpen(false);
                refreshShifts();
            } else {
                toast.error('Failed to publish schedule');
            }
        } catch (err) {
            console.error('Error publishing schedule:', err);
            toast.error('Error publishing schedule');
        }
    };

    const handleNotifications = () => {
        // TODO: Implement notifications
        console.log('Show notifications');
    };

    if (loading) {
        return <div className="schedule-page"><p>Loading...</p></div>;
    }

    return (
        <div className="schedule-page">
            <HeaderWithPublishBtn
            title="Schedule"
            onPublish={handlePublish}
            onNotifications={handleNotifications}/>
            <div className="container">
                    <ManagerScheduleHead
                        startDate={startDate}
                        setStartDate={setStartDate}
                        weekDays={weekDays}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />
                    <ManagerScheduleGrid
                        weekDays={weekDays}
                        searchTerm={searchTerm}
                        onAddShift={handleAddShift}
                        usersWithShifts={usersWithShifts}
                        onShiftUpdate={refreshShifts}
                    />
                </div>
                <ShiftCreationDrawer
                    isOpen={isDrawerOpen}
                    onClose={handleCloseDrawer}
                    selectedDate={selectedDate}
                    selectedEmployee={selectedEmployee}
                    onShiftUpdate={refreshShifts}
                />
                <PublishNotificationModal
                    isOpen={isPublishModalOpen}
                    onClose={() => setIsPublishModalOpen(false)}
                    onPublish={handleConfirmPublish}
                    publishData={publishData}
                />
            </div>
    );
}
