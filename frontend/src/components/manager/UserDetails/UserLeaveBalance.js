import { useState, useEffect, useCallback } from 'react';
import { authFetch } from '../../../utils/authFetch';
import '../../../styles/EmployeeLeaveReq.css';
import '../../../styles/ManagerUserDetails.css';
import ManageBalanceModal from './ManageBalanceModal'; // Import modal here

export default function UserLeaveBalance({ user_id }) {
    const [leaveBalance, setLeaveBalance] = useState([]);

    // 1. Move Modal State HERE
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 2. Wrap fetch in useCallback so we can refresh after edit
    const fetchUserLeaveBalance = useCallback(async () => {
        if (!user_id) return;
        try {
            const res = await authFetch(`https://kkh-fyp-backend.onrender.com/api/leaves/balance/${user_id}`);
            if (!res.ok) throw new Error("Failed to fetch user leave balance");
            const data = await res.json();
            setLeaveBalance(data);
        } catch (err) {
            console.error("Error fetching user leave balance:", err);
        }
    }, [user_id]);

    useEffect(() => {
        fetchUserLeaveBalance();
    }, [fetchUserLeaveBalance]);

    const leaveBalance_Rows = leaveBalance.map((row) => ({
        id: row.id,
        leaveType: row.leave_type,
        // Wrap these in Number() or parseFloat() to strip .0
        remainingDays: Number(row.remaining_days),
        annualQuota: Number(row.total_quota),
    }));

    return (
        <div className='container'>
            <div class="container-header">
                <h2>Leave Balance</h2>
                <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                    Edit
                </button>
            </div>

            <div className="leaveBalanceGroup">
                {leaveBalance_Rows.length > 0 ? (
                    leaveBalance_Rows.map((row) => (
                        <div key={row.id} className="leaveBalanceCard">
                            <h4>{row.leaveType}</h4>
                            <p>{row.remainingDays}/{row.annualQuota} days left</p>
                        </div>
                    ))
                ) : (
                    <p>No leave data found.</p>
                )}
            </div>

            <ManageBalanceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onRefresh={fetchUserLeaveBalance}
                userId={user_id}
                currentBalanceData={leaveBalance}
            />
        </div>
    );
}