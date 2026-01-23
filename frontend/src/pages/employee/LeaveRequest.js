import { useState, useEffect } from 'react';

// Components
import LeaveBalance from '../../components/employee/LeaveRequest/LeaveBalance';
import LeaveReqHistory from '../../components/employee/LeaveRequest/LeaveReqHistory';
import HeaderWithAddBtn from '../../components/Header/HeaderWithAddBtn';
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
            <HeaderWithAddBtn
                onOpenModal={() => setIsModalOpen(true)}
                title="Leave Request Management"
                btnText="Request"
            />
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

