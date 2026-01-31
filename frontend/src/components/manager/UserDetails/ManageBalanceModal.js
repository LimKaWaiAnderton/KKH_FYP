import { useState } from "react";
import toast from 'react-hot-toast';
import { authFetch } from '../../../utils/authFetch'; // Adjust path if needed

import '../../../styles/EmployeeLeaveReq.css'; 
import CloseIcon from '@mui/icons-material/Close';

export default function ManageBalanceModal({ isOpen, onClose, onRefresh, userId, currentBalanceData }) {
  const [selectedLeaveTypeId, setSelectedLeaveTypeId] = useState("");
  const [adjustmentType, setAdjustmentType] = useState("add"); // 'add' or 'deduct'
  const [amount, setAmount] = useState(""); 
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find the specific leave data (e.g., Annual Leave) based on what is selected
  const selectedLeaveData = currentBalanceData?.find(
    item => Number(item.leave_type_id) === Number(selectedLeaveTypeId)
  );
  const currentQuota = selectedLeaveData ? Number(selectedLeaveData.total_quota) : 0;
  const currentRemaining = selectedLeaveData ? Number(selectedLeaveData.remaining_days) : 0;

  // Helper to show the math before saving
  const calculateNewQuota = () => {
    if (!amount) return currentQuota;
    const numAmount = Number(amount);
    return adjustmentType === "add" 
      ? currentQuota + numAmount 
      : currentQuota - numAmount;
  };

  const calculateNewBalance = () => {
    if (!amount) return currentRemaining;
    const numAmount = Number(amount);
    return adjustmentType === "add" 
      ? currentRemaining + numAmount 
      : currentRemaining - numAmount;
  }

  const closeModal = () => {
    setSelectedLeaveTypeId("");
    setAdjustmentType("add");
    setAmount("");
    setReason("");
    setError("");
    onClose();
  };

  // --- API CALL (INLINED) ---
  const handleSubmit = async () => {
    console.log(selectedLeaveTypeId, adjustmentType, amount, reason);
    // 1. Validation
    if (!selectedLeaveTypeId || !amount || !reason) {
      setError("All fields are required, including a reason.");
      return;
    }

    if (Number(amount) <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // 2. Prepare Data
      // If 'deduct', we convert the number to negative
      const finalAdjustment = adjustmentType === "add" ? Number(amount) : -Number(amount);

      const payload = {
        user_id: userId,
        leave_type_id: Number(selectedLeaveTypeId),
        adjustment_days: finalAdjustment,
        reason: reason
      };

      // 3. Make the Request
      const response = await authFetch(`http://localhost:5000/api/leaves/balance/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to adjust balance');
      }

      // 4. Success Handling
      toast.success("Leave balance updated successfully.");
      onRefresh(); // Refresh parent data
      closeModal();

    } catch (error) {
      console.error('Error adjusting balance:', error);
      setError(error.message || "Failed to update balance.");
      toast.error("Failed to update balance.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>

      <div className="modal-container">
        <div className="modal-box">
          
          {/* Header */}
          <div className="modal-header-group">
            <h2 className="modal-title">Adjust Leave Balance</h2>
            <CloseIcon onClick={onClose} style={{ cursor: 'pointer' }} />
          </div>
          <p className="modal-description">Manually adjust leave quotas for this user.</p>

          <form className="leave-request-form" onSubmit={(e) => e.preventDefault()}>
            
            {/* 1. SELECT LEAVE TYPE */}
            <div className="leave-type-input">
              <label>Leave Type</label>
              <select
                value={selectedLeaveTypeId}
                onChange={(e) => setSelectedLeaveTypeId(e.target.value)}
              >
                <option value="" disabled>Select Leave Type</option>
                {currentBalanceData && currentBalanceData.map(item => (
                  <option key={item.leave_type_id} value={item.leave_type_id}>
                    {item.leave_type}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              {/* 2. ACTION (Add/Deduct) */}
              <div className="leave-type-input" style={{ flex: 1 }}>
                <label>Action</label>
                <select
                  value={adjustmentType}
                  onChange={(e) => setAdjustmentType(e.target.value)}
                >
                  <option value="add">Add (+)</option>
                  <option value="deduct">Deduct (-)</option>
                </select>
              </div>

              {/* 3. DAYS INPUT */}
              <div className="leave-startDate-input" style={{ flex: 1 }}>
                <label>Days</label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  placeholder="e.g. 1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>

            {/* 4. REASON */}
            <div className="leave-type-input">
              <label>Reason for Adjustment</label>
              <textarea
                rows="2"
                placeholder="e.g. Compensation for weekend work"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            {error && <p className="error-message">{error}</p>}
          </form>

          {/* REVIEW BOX: Shows the Math */}
          {selectedLeaveTypeId && (
            <div className="review-box">
              <h3>Summary</h3>
              
              <div className="review-detail">
                <span>Current Total Leave Quota:</span>
                <p>{currentQuota} Days</p>
              </div>

              <div className="review-detail">
                <span>Current Total Leave Balance:</span>
                <p>{currentRemaining} Days</p>
              </div>

              <div className="review-detail">
                <span>Adjustment:</span>
                <p style={{ color: adjustmentType === 'add' ? 'green' : 'red' }}>
                  {adjustmentType === 'add' ? '+' : '-'}{amount || 0} Days
                </p>
              </div>

              <hr/>

              <div className="review-detail">
                <span>New Total Leave Quota:</span>
                <p>{calculateNewQuota()} Days</p>
              </div>
              <div className="review-detail">
                <span>New Total Leave Balance:</span>
                <p>{calculateNewBalance()} Days</p>
              </div>
            </div>
          )}

          {/* ACTIONS */}
          <div className="modal-actions">
            <button className="btn-cancel" onClick={closeModal} disabled={isSubmitting}>Cancel</button>
            <button 
                className="btn-primary" 
                onClick={handleSubmit} 
                disabled={isSubmitting || !selectedLeaveTypeId || !amount}
            >
                {isSubmitting ? 'Saving...' : 'Confirm Adjustment'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}