import { useState, useEffect } from 'react';

// Components
import LeaveBalance from '../../components/employee/LeaveRequest/LeaveBalance';
import LeaveReqHistory from '../../components/employee/LeaveRequest/LeaveReqHistory';
import Header from '../../components/employee/LeaveRequest/Header';
import RequestModal from '../../components/employee/LeaveRequest/RequestModal';

// API calls
import { fetchHistory } from '../../api/leave.api.js';

export default function EmployeeLeaveRequest() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        getHistory();
    }, []);

    const getHistory = async () => {
        try {
            const data = await fetchHistory();
            return setHistory(data);

        } catch (error) {
            console.error('Error fetching leave type name:', error);
        }
    };

    const refreshHistory = async (data) => {
        return setHistory((prevHistory) => [data, ...prevHistory]);
    };

    return (
        <div className="employee-leave-request-page">
            <Header onOpenModal={() => setIsModalOpen(true)} />
            <LeaveBalance />
            <LeaveReqHistory
                leaveReqHistoryData={history}
            />
            <RequestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onRefresh={refreshHistory}
            />
        </div>
    )
}

