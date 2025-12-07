import { useState, useEffect } from 'react';
import { supabase } from "../../../supabase";
import '../../../styles/EmployeeLeaveReq.css';

export default function LeaveBalance() {
    const [leaveBalance, setLeaveBalance] = useState([]);
    const DEMO_USER_ID = "43f7e8dc-365b-4aa1-ace6-44b790687780"; // TEMP until you use auth

    // Function to fetch leave balance from Supabase
    const fetchLeaveBalance = async () => {
        const { data, error } = await supabase
            .from("user_leave_balance")
            .select(`
            id,
            remaining_days,
            total_quota,
            leave_types (name)
            `)
            .eq("user_id", DEMO_USER_ID);

            if (error) {
                console.error("Error fetching leave balance:", error);
                return;
            }
            setLeaveBalance(data);
    }
    
    // Fetch leave balance on component mount
    useEffect(() => {
        fetchLeaveBalance();
    }, []);

    const leaveBalance_Rows = leaveBalance.map((row) => ({
        id: row.id,
        leaveType: row.leave_types.name,
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