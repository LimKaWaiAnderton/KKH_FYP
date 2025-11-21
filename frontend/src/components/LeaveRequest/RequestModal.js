import '../../styles/LeaveRequest.css';
import { leaveBalanceData } from "../../data";
import { useState } from "react";

export default function RequestModal({ isOpen, onClose, onSubmit }) {
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [remaining, setRemaining] = useState(null);
  const [totalDays, setTotalDays] = useState(0);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const calculateDays = (start, end) => {
    if (!start || !end) return 0;

    const startDt = new Date(start);
    const endDt = new Date(end);
    const diff = endDt - startDt;

    return diff / (1000 * 60 * 60 * 24) + 1;
  }

  const handleSubmit = () => {
    if (!leaveType || !startDate || !endDate) {
      setError("All fields are required.");
      return;
    }
    if (totalDays > remaining) {
      setError(`You only have ${remaining} days left.`);
      return;
    }

    const newRequest = {
      id: Date.now(),
      user_id: 12,
      start_date: startDate,
      end_date: endDate,
      total_days: totalDays,
      applied_date: new Date().toISOString().split("T")[0],
      status: "Pending",
      leave_types: { name: leaveType }
    };

    onSubmit(newRequest);  // Update parent state
    setError("");
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
                onChange={(e) => {
                  const selectedType = e.target.value;
                  setLeaveType(selectedType);
                  setError("");

                  const balance = leaveBalanceData.find(
                    (item) => item.leave_types.name === selectedType
                  );

                  setRemaining(balance ? balance.remaining_days : null);
                }}

              >
                <option value="">Select Leave Type</option>
                <option value="Annual Leave">Annual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Childcare Leave">Childcare Leave</option>
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
              <p>{startDate || "—"}</p>
            </div>

            <div className="review-detail">
              <span>End Date:</span>
              <p>{endDate || "—"}</p>
            </div>

            <div className="review-detail">
              <span>Total Days:</span>
              <p>{totalDays > 0 ? totalDays : "—"}</p>
            </div>

          </div>

          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>Cancel</button>
            <button className="btn-primary" onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      </div>
    </>
  );
}
