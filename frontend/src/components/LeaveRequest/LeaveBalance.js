import { useState, useEffect } from 'react';
import { leaveBalanceData } from '../../data';
import '../../styles/LeaveRequest.css';

export default function LeaveBalance() {
    const [leaveBalance, setLeaveBalance] = useState(leaveBalanceData);
    const leaveBalance_Rows = leaveBalance.map((leave) => ({
        id: leave.id,
        leaveType: leave.leave_types.name,
        usedDays: leave.used_days,
        remainingDays: leave.remaining_days,
    }));

    return (
        <div className='container'>
            <h2>Leave Balance</h2>
            <div className="leaveBalanceGroup">
                {leaveBalance_Rows.map((row) => (
                    <div key={row.id} className="leaveBalanceCard">
                        <h4>{row.leaveType}</h4>
                        <p>{row.usedDays}/{row.remainingDays} days left</p>
                    </div>
                ))}
            </div>
        </div >
    )
}