import { useState, useEffect } from 'react';
// Components
import LeaveBalance from '../../components/LeaveRequest/LeaveBalance';
import LeaveReqHistory from '../../components/LeaveRequest/LeaveReqHistory';
import Header from '../../components/LeaveRequest/Header';
import RequestModal from '../../components/LeaveRequest/RequestModal';

// Data 
import { leaveRequestHistoryData } from '../../data';

export default function LeaveRequest() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [leaveReqHistory, setLeaveReqHistory] = useState(leaveRequestHistoryData);

    const addLeaveRequest = (newReq) => {
        console.log("Adding new leave request:", newReq);

        setLeaveReqHistory((prev) => {
            const updated = [...prev, newReq];

            console.log("Updated leave history:", updated);
            return updated;
        });
    }

    return (
        <div>
            <Header onOpenModal={() => setIsModalOpen(true)} />
            <LeaveBalance />
            <LeaveReqHistory leaveReqHistoryData={leaveReqHistory} />
            <RequestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={addLeaveRequest}
            />
        </div>
    )
}

