import { useState, useEffect } from 'react';
import '../../../styles/EmployeeLeaveReq.css';

export default function LeaveBalance() {
    const [leaveBalance, setLeaveBalance] = useState([]);
    
    const fetchLeaveBalance = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/leaves/balance');
            const data = await res.json();
            console.log(data);
            setLeaveBalance(data);
        } catch (error) {
            console.error('Error fetching leave request history:', error);
        }
    };

    // Fetch leave balance on component mount
    useEffect(() => {
        fetchLeaveBalance();
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