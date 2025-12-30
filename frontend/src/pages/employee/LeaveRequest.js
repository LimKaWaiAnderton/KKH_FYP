import { useState, useEffect } from 'react';

// Components
import LeaveBalance from '../../components/employee/LeaveRequest/LeaveBalance';
import LeaveReqHistory from '../../components/employee/LeaveRequest/LeaveReqHistory';
import Header from '../../components/employee/LeaveRequest/Header';
import RequestModal from '../../components/employee/LeaveRequest/RequestModal';

export default function EmployeeLeaveRequest() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/leaves');
            const data = await res.json();
            console.log(data);
            setHistory(data);
        } catch (error) {
            console.error('Error fetching leave request history:', error);
        }
    };

    const addLeaveRequest = async (newRequest) => {
        try {
            const res = await fetch(`http://localhost:5000/api/leaves`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newRequest)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.msg || 'Failed to submit leave request');
            }

            // Update history with the new request
            setHistory((prevHistory) => [data, ...prevHistory]);

        } catch (error) {
            throw error;
        }
    };

    return (
        <div>
            <Header onOpenModal={() => setIsModalOpen(true)} />
            <LeaveBalance />
            <LeaveReqHistory
                leaveReqHistoryData={history}
            />
            <RequestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={addLeaveRequest}  // pass function to modal
            />
        </div>
    )
}

