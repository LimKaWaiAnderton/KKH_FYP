import { useState, useEffect } from 'react';
import { supabase } from "../../supabase";

import '../../styles/ManagerLeaveReq.css';
import Header from '../../components/manager/LeaveRequest/Header';
import LeaveReqStatus from '../../components/manager/LeaveRequest/LeaveReqStatus';
import LeaveReqHistory from '../../components/manager/LeaveRequest/LeaveReqHistory';
import ManageRequestModal from '../../components/manager/LeaveRequest/ManageRequestModal';

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

    const handleOpenModal = (request) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRequest(null);
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    // For LeaveReqStatus component
    // Update counts whenever leaveRequests change
    useEffect(() => {
        // Calculate counts based on leave request status
        setCounts({
            requested: leaveRequests.filter(r => r.status === "Requested").length,
            approved: leaveRequests.filter(r => r.status === "Approved").length,
            pending: leaveRequests.filter(r => r.status === "Pending").length,
            rejected: leaveRequests.filter(r => r.status === "Rejected").length,
        });

    }, [leaveRequests]);

    const fetchHistory = async () => {
        // Fetch leave requests from the database
        const { data, error } = await supabase
            .from("leave_requests")
            .select(`
                *,
                leave_types (name),
                users (first_name, last_name, departments(name))
            `)
            .order("applied_date", { ascending: false });

        if (error) {
            console.error(error);
        } else {
            setLeaveRequests(data);
            console.log(data);
        }
    }

    const handleApprove = async (request) => {
        console.log("Approving request:", request);

        try {
            const userId = request.user_id;
            const leaveTypeId = request.leave_type_id;
            const daysTaken = request.total_days;

            // 1. Get the user's leave balance row
            const { data: leaveBalanceData, error: leaveBalanceError } = await supabase
                .from("user_leave_balance")
                .select("id, used_days")
                .eq("user_id", userId)
                .eq("leave_type_id", leaveTypeId)
                .single();

            if (leaveBalanceError) throw leaveBalanceError;

            const updatedUsedDays = leaveBalanceData.used_days + daysTaken;
            const updatedRemaining = leaveBalanceData.total_quota - updatedUsedDays;

            // 2. Update the user's leave balance
            const { error: updateBalanceError } = await supabase
                .from("user_leave_balance")
                .update({
                    used_days: updatedUsedDays,
                    remaining_days: updatedRemaining
                })
                .eq("id", leaveBalanceData.id);

            if (updateBalanceError) throw updateBalanceError;

            // 3. Update the leave request status to "Approved"
            const { error: updateRequestError } = await supabase
                .from("leave_requests")
                .update({ status: "Approved" })
                .eq("id", request.id);

            if (updateRequestError) throw updateRequestError;

            // 4. Refresh UI & close modal
            fetchHistory();
            handleCloseModal();

        } catch (error) {
            console.error("Error approving leave request:", error);
        }

    }

    const handleReject = async (request) => {
        try {
            const { error } = await supabase
                .from("leave_requests")
                .update({ status: "Rejected" })
                .eq("id", request.id);

            if (error) throw error;

            // Refresh UI & close modal
            fetchHistory();
            handleCloseModal();

        } catch (error) {
            console.error("Error rejecting leave request:", error);
        }
    }

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
                onApprove={handleApprove}
                onReject={handleReject}
            />
        </>
    )
}