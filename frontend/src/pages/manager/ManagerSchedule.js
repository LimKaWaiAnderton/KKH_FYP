import React, { useState, useEffect } from 'react';
import { HiOutlineBell } from 'react-icons/hi';
import '../../styles/ManagerSchedule.css';
import ManagerScheduleHead from '../../components/manager/Schedule/ManagerScheduleHead';
import ManagerScheduleGrid from '../../components/manager/Schedule/ManagerScheduleGrid';
import ShiftCreationDrawer from '../../components/manager/Schedule/ShiftCreationDrawer';
import HeaderWithPublishBtn from '../../components/Header/HeaderWithPublishBtn';
import PublishNotificationModal from '../../components/manager/Schedule/PublishNotificationModal';
import ValidationErrorsModal from '../../components/manager/Schedule/ValidationErrorsModal'; // <--- IMPORT THIS
import { authFetch } from '../../utils/authFetch';
import toast from 'react-hot-toast';

export default function ManagerSchedule() {
    // ... (Keep existing state) ...
    const [startDate, setStartDate] = useState(new Date());
    const [searchTerm, setSearchTerm] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [usersWithShifts, setUsersWithShifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    const [publishData, setPublishData] = useState(null);

    // --- NEW STATE FOR VALIDATION ---
    const [validationErrors, setValidationErrors] = useState([]);
    const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);


    // ... (Keep useEffect, refreshShifts, generateWeekDays, handleAddShift, handleCloseDrawer, handlePublish) ...
    // COPY THE PREVIOUS LOGIC FOR THESE FUNCTIONS IF YOU DON'T HAVE THEM SAVED
    // I will assume the previous logic exists for brevity.
    
    // ... (Existing useEffect) ...
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
    
    // ... (Helper: generateWeekDays) ...
    const generateWeekDays = (date) => {
        const days = [];
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(date);
            currentDate.setDate(date.getDate() + i);
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

    // ... (Helpers: handleAddShift, handleCloseDrawer) ...
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
        const unpublishedShifts = usersWithShifts.filter(entry => entry.shift_id && entry.published === false);
        if (unpublishedShifts.length === 0) {
            toast('No unpublished shifts to publish.');
            return;
        }
        const dateStrings = unpublishedShifts.map(entry => entry.date);
        const minDateStr = dateStrings.reduce((min, curr) => curr < min ? curr : min);
        const maxDateStr = dateStrings.reduce((max, curr) => curr > max ? curr : max);
        const minDate = new Date(minDateStr);
        const maxDate = new Date(maxDateStr);
        const formatDisplayDate = (date) => {
            const day = date.getDate();
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const month = monthNames[date.getMonth()];
            return `${day} ${month}`;
        };
        const shiftCount = unpublishedShifts.filter(entry => entry.date >= minDateStr && entry.date <= maxDateStr).length;
        setPublishData({
            startDate: minDateStr,
            endDate: maxDateStr,
            startDateDisplay: formatDisplayDate(minDate),
            endDateDisplay: formatDisplayDate(maxDate),
            shiftCount: shiftCount
        });
        setIsPublishModalOpen(true);
    };

    // --- UPDATED CONFIRM PUBLISH (WITH ERROR MODAL) ---
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
            
            const data = await res.json();

            if (res.ok) {
                // SUCCESS
                toast.success(`Validation Passed! Schedule published successfully.`);
                setIsPublishModalOpen(false);
                refreshShifts();
            } else {
                // FAILURE
                if (data.status === 'FAIL') {
                    // 1. Close the Publish Modal
                    setIsPublishModalOpen(false); 
                    
                    // 2. Set the errors into state
                    setValidationErrors(data.violations);
                    
                    // 3. Open the Error Report Modal
                    setIsValidationModalOpen(true);
                    
                    toast.error("Validation failed. Please review errors.");
                } else {
                    toast.error(data.message || 'Failed to publish schedule');
                }
            }
        } catch (err) {
            console.error('Error publishing schedule:', err);
            toast.error('Network error occurred while publishing');
        }
    };

    const handleNotifications = () => {
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
                onNotifications={handleNotifications}
            />
            <div className="container">
                <ManagerScheduleHead
                    startDate={startDate}
                    setStartDate={setStartDate}
                    weekDays={weekDays}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onRosterGenerated={refreshShifts}
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
            
            {/* PUBLISH CONFIRM MODAL */}
            <PublishNotificationModal
                isOpen={isPublishModalOpen}
                onClose={() => setIsPublishModalOpen(false)}
                onPublish={handleConfirmPublish}
                publishData={publishData}
            />

            {/* VALIDATION ERROR REPORT MODAL */}
            <ValidationErrorsModal
                isOpen={isValidationModalOpen}
                onClose={() => setIsValidationModalOpen(false)}
                violations={validationErrors}
            />
        </div>
    );
}