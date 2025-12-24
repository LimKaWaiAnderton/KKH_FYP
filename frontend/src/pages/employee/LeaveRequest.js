import { useState, useEffect } from 'react';
import { supabase } from "../../supabase";

// Components
import LeaveBalance from '../../components/employee/LeaveRequest/LeaveBalance';
import LeaveReqHistory from '../../components/employee/LeaveRequest/LeaveReqHistory';
import Header from '../../components/employee/LeaveRequest/Header';
import RequestModal from '../../components/employee/LeaveRequest/RequestModal';

// Data 
import { leaveRequestHistoryData } from '../../data';


export default function EmployeeLeaveRequest() {
    const DEMO_USER_ID = "43f7e8dc-365b-4aa1-ace6-44b790687780"; // TEMP until you use auth

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        const { data, error } = await supabase
            .from("leave_requests")
            .select(`
                *,
                leave_types (name)
            `)
            .eq("user_id", DEMO_USER_ID)
            .order("applied_date", { ascending: false });

        if (error) {
            console.error(error);
        } else {
            setHistory(data);
        }
    }

    // To update 
    const addLeaveRequest = (newItem) => {
        setHistory((prev) => [newItem, ...prev]); // add to UI instantly
    };

    return (
        <div>
            <Header onOpenModal={() => setIsModalOpen(true)} />
            <LeaveBalance />
            <LeaveReqHistory
                leaveReqHistoryData={history}
            />
            <RequestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={addLeaveRequest}  // pass function to modal
            />
        </div>
    )
}

