import { useState, useEffect } from 'react';

// Components
import '../../styles/ManagerLeaveReq.css';
import Header from '../../components/manager/LeaveRequest/Header';
import LeaveReqStatus from '../../components/manager/LeaveRequest/LeaveReqStatus';
import LeaveReqHistory from '../../components/manager/LeaveRequest/LeaveReqHistory';
import ManageRequestModal from '../../components/manager/LeaveRequest/ManageRequestModal';

// API call
import { fetchHistory } from '../../api/leave.api.js';

export default function ManagerLeaveRequest() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [counts, setCounts] = useState({
        requested: 0,
        approved: 0,
        pending: 0,
        rejected: 0
    });

    // For filtering leave requests
    const [filterStatus, setFilterStatus] = useState(null);
    const filteredRequests = filterStatus
        ? leaveRequests.filter(r => r.status === filterStatus)
        : leaveRequests;

    const handleOpenModal = async (request) => {
        await fetchRequestedHistory(request);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRequest(null);
    };

    useEffect(() => {
        getHistory();
    }, []);

    // For LeaveReqStatus component
    // Update counts whenever leaveRequests change
    useEffect(() => {
        // Calculate counts based on leave request status
        setCounts({
            requested: leaveRequests.filter(r => r.status === "requested").length,
            approved: leaveRequests.filter(r => r.status === "approved").length,
            pending: leaveRequests.filter(r => r.status === "pending").length,
            rejected: leaveRequests.filter(r => r.status === "rejected").length,
        });

    }, [leaveRequests]);

    const getHistory = async () => {
        try {
            const data = await fetchHistory();
            return setLeaveRequests(data);

        } catch (error) {
            console.error('Error fetching leave type name:', error);
        }
    };

    const fetchRequestedHistory = async (leaveReq) => {
        const { id } = leaveReq;
        try {
            const res = await fetch(`http://localhost:5000/api/leaves/${id}`);
            const data = await res.json();
            setSelectedRequest(data);
        } catch (error) {
            console.error('Error fetching leave request history:', error);
        }
    };

    const handleLeaveReq = async (request, status) => {
        const { id } = request;
        try {
            const res = await fetch(`http://localhost:5000/api/leaves/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.msg || 'Failed to approve leave request');
            }

            // Update the newly approved/rejected leave request in the list
            setLeaveRequests(previousLeaveRequests =>
                previousLeaveRequests.map(leaveRequest =>
                  leaveRequest.id === data.id
                    ? { ...leaveRequest, ...data }
                    : leaveRequest
                )
              );

            handleCloseModal();

        } catch (error) {
            throw error;
        }
    };

    return (
        <>
            <Header />
            <LeaveReqStatus
                leaveReqStatusCounts={counts}
                onStatusClick={setFilterStatus}
                filterStatus={filterStatus}
            />
            <LeaveReqHistory
                leaveReqHistoryData={filteredRequests}
                onSelectRequest={handleOpenModal}
            />
            <ManageRequestModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                request={selectedRequest}
                onSubmit={handleLeaveReq}
            />
        </>
    )
}