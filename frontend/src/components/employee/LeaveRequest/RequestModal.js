import '../../../styles/EmployeeLeaveReq.css';
import { formatDate } from '../../../utils/dateUtils';
import { useState } from "react";
import { supabase } from '../../../supabase';

export default function RequestModal({ isOpen, onClose, onSubmit }) {
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [remaining, setRemaining] = useState(null);
  const [totalDays, setTotalDays] = useState(0);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const DEMO_USER_ID = "43f7e8dc-365b-4aa1-ace6-44b790687780"; // TEMP until you use auth

  const closeModal = () => {
    setLeaveType("");
    setStartDate("");
    setEndDate("");
    setRemaining(null);
    setTotalDays(0);
    setError("");
    onClose();
  };

  const calculateDays = (start, end) => {
    if (!start || !end) return 0;

    const startDt = new Date(start);
    const endDt = new Date(end);
    const diff = endDt - startDt;

    return diff / (1000 * 60 * 60 * 24) + 1;
  }

  const handleSubmit = async () => {
    if (!leaveType || !startDate || !endDate) {
      setError("All fields are required.");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setError("End date cannot be earlier than start date.");
      return;
    }
  
    if (totalDays > remaining) {
      setError(`You only have ${remaining} days left.`);
      return;
    }

    const { data: overlappingRequests, error: overlapError } = await supabase
    .from("leave_requests")
    .select("id, start_date, end_date, status")
    .eq("user_id", DEMO_USER_ID)
    .neq("status", "Rejected")
    .lte("start_date", endDate)
    .gte("end_date", startDate);

    if (overlapError) {
      console.error("Error checking overlapping requests:", overlapError);
      setError("Something went wrong. Please try again.");
      return;
    }

    if (overlappingRequests.length > 0) {
      setError("You have overlapping leave requests during this period.");
      return;
    }

    setError("");

    const newRequest = {
      user_id: DEMO_USER_ID,  // use auth later
      leave_type_id: leaveType,
      start_date: startDate,
      end_date: endDate,
      total_days: totalDays,
      applied_date: new Date().toISOString().split("T")[0],
      status: "Pending",
    };

    const { data, error } = await supabase
      .from("leave_requests")
      .insert([newRequest])
      // After inserting, return the row + related leave_types name (via FK join) to update UI
      .select(`
        *,
        leave_types ( name )
    `)
      .single();

    if (error) {
      console.error("Error submitting leave request:", error);
      setError("Something went wrong. Please try again.");
      return;
    }

    onSubmit(data) // Sends new row to parent state to update UI
    console.log("Leave request inserted:", data);
    alert("Leave request submitted.");
    onClose();
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="modal-overlay" onClick={onClose}></div>

      {/* Modal */}
      <div className="modal-container">
        <div className="modal-box">
          <h2 className="modal-title">Request Leave</h2>
          <p className="modal-description">Please fill in your details.</p>

          <form className="leave-request-form">
            <div className="leave-type-input">
              <label>Leave Type</label>
              <select
                value={leaveType}
                onChange={async (e) => {
                  const selectedType = e.target.value;
                  setLeaveType(selectedType);
                  setError("");

                  // Fetch remaining days for this leave type
                  const { data, error } = await supabase
                    .from("user_leave_balance")
                    .select("remaining_days")
                    .eq("user_id", DEMO_USER_ID)
                    .eq("leave_type_id", selectedType)
                    .single();

                  if (error) {
                    console.error("Error fetching leave balance:", error);
                  } else {
                    setRemaining(data.remaining_days || 0);
                  }
                }}

              >
                <option value="">Select Leave Type</option>
                <option value="1">Annual Leave</option>
                <option value="2">Sick Leave</option>
                <option value="3">Childcare Leave</option>
              </select>
            </div>

            <div className="leave-startDate-input">
              <label>Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  const value = e.target.value;
                  setStartDate(value);
                  setTotalDays(calculateDays(value, endDate));
                  setError("");
                }}
                min={today}
              />
            </div>

            <div className="leave-endDate-input">
              <label>End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  const value = e.target.value
                  setEndDate(e.target.value)
                  setTotalDays(calculateDays(startDate, value));
                  setError("");
                }}
                min={startDate || today}
              />
            </div>
            {error && <p className="error-message">{error}</p>}
          </form>
          <div className="review-box">
            <h3>Review Request</h3>
            <div className="review-detail">
              <span>Leave Type:</span>
              <p>{leaveType || "—"}</p>
            </div>

            <div className="review-detail">
              <span>Start Date:</span>
              <p>{formatDate(startDate) || "—"}</p>
            </div>

            <div className="review-detail">
              <span>End Date:</span>
              <p>{formatDate(endDate) || "—"}</p>
            </div>

            <div className="review-detail">
              <span>Total Days:</span>
              <p>{totalDays > 0 ? totalDays : "—"}</p>
            </div>

          </div>

          <div className="modal-actions">
            <button className="btn-cancel" onClick={closeModal}>Cancel</button>
            <button className="btn-primary" onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      </div>
    </>
  );
}
