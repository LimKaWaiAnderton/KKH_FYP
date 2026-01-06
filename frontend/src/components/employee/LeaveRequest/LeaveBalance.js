import { useState, useEffect } from 'react';
import '../../../styles/EmployeeLeaveReq.css';

// API call
import { fetchLeaveBalance } from '../../../api/leave.api.js';

export default function LeaveBalance() {
    const [leaveBalance, setLeaveBalance] = useState([]);
    
    const getLeaveBalance = async () => {
        try {
            const data = await fetchLeaveBalance();
            setLeaveBalance(data);
        } catch (error) {
            console.error('Error fetching leave balance:', error);
        }
    };

    // Fetch leave balance on component mount
    useEffect(() => {
        getLeaveBalance();
    }, []);

    const leaveBalance_Rows = leaveBalance.map((row) => ({
        id: row.id,
        leaveType: row.leave_type,
        remainingDays: row.remaining_days,
        annualQuota: row.total_quota,
    }));

    return (
        <div className='container'>
            <h2>Leave Balance</h2>
            <div className="leaveBalanceGroup">
                {leaveBalance_Rows.map((row) => (
                    <div key={row.id} className="leaveBalanceCard">
                        <h4>{row.leaveType}</h4>
                        <p>{row.remainingDays}/{row.annualQuota} days left</p>
                    </div>
                ))}
            </div>
        </div >
    )
}