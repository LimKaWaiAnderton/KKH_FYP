import { useState, useEffect } from 'react';
import { supabase } from "../../supabase";

// Components
import LeaveBalance from '../../components/LeaveRequest/LeaveBalance';
import LeaveReqHistory from '../../components/LeaveRequest/LeaveReqHistory';
import Header from '../../components/LeaveRequest/Header';
import RequestModal from '../../components/LeaveRequest/RequestModal';

// Data 
import { leaveRequestHistoryData } from '../../data';


export default function LeaveRequest() {
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

