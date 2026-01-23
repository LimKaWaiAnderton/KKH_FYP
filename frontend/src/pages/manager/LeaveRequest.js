import { useState, useEffect } from 'react';

// Components
import '../../styles/ManagerLeaveReq.css';
import Header from '../../components/Header/Header';
import LeaveReqStatus from '../../components/manager/LeaveRequest/LeaveReqStatus';
import LeaveReqHistory from '../../components/manager/LeaveRequest/LeaveReqHistory';
import ManageRequestModal from '../../components/manager/LeaveRequest/ManageRequestModal';

// API call
import { fetchHistory, fetchRequestedHistory } from '../../api/leave.api.js';

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
        await getRequestedHistory(request);
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

    const getRequestedHistory = async (leaveReq) => {
        try {
            const data = await fetchRequestedHistory(leaveReq);
            return setSelectedRequest(data);
        } catch (error) {
            console.error('Error fetching leave request history:', error);
        }
    };

    const refreshHistory = async (data) => {
        return setLeaveRequests(previousLeaveRequests =>
            previousLeaveRequests.map(leaveRequest =>
              leaveRequest.id === data.id
                ? { ...leaveRequest, ...data }
                : leaveRequest
            )
          );
    }

    return (
        <>
            <Header title="Requests"/>
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
                request={selectedRequest}
                onClose={handleCloseModal}
                onRefresh={refreshHistory}
            />
        </>
    )
}