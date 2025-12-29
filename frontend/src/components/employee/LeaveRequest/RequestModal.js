import '../../../styles/EmployeeLeaveReq.css';
import { formatDate } from '../../../utils/dateUtils';
import { useState, useEffect } from "react";

export default function RequestModal({ isOpen, onClose, onSubmit }) {
  const [leaveType, setLeaveType] = useState("");
  const [leaveTypeName, setLeaveTypeName] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalDays, setTotalDays] = useState(0);
  const [error, setError] = useState("");

  const fetchLeaveTypeName = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/leaves/types');
      const data = await res.json();
      setLeaveTypeName(data);
    } catch (error) {
      console.error('Error fetching leave type name:', error);
    }
  };

  const selectedLeaveType = leaveTypeName.find(type => type.id === leaveType);

  useEffect(() => {
    fetchLeaveTypeName();
  }, []);

  const today = new Date().toISOString().split("T")[0];

  const closeModal = () => {
    setLeaveType("");
    setStartDate("");
    setEndDate("");
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

    setError("");

    try {
      await onSubmit({
        leave_type_id: Number(leaveType),
        start_date: startDate,
        end_date: endDate,
      });
      closeModal();
    } catch (error) {
      setError(error.message || "Failed to submit leave request.");
    }
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
                  setLeaveType(e.target.value);
                  setError("");
                }}
              >
                <option value="" disabled>
                  Select Leave Type
                </option>
                {leaveTypeName.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
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
              <p>{selectedLeaveType?.name || "—"}</p>
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
