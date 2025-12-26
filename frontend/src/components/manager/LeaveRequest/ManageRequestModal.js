import { useState } from 'react';

import '../../../styles/ManagerLeaveReq.css';
import { formatDate } from '../../../utils/dateUtils';
import capitalizeFirst from '../../../utils/capitalizeUtils';

import Chip from '@mui/material/Chip';
import CloseIcon from '@mui/icons-material/Close';

export default function ManageRequestModal({
  isOpen,
  onClose,
  request,
  onSubmit
}) {
  const [error, setError] = useState("");

  if (!isOpen || !request) return null;
  
  const handleSubmit = async (status) => {
    try {
      setError("");
      await onSubmit({ ...request, status });
    } catch (error) {
      setError(error.message || "Failed to update leave request.");
    }
  }

  return (
    <>
      {/* Overlay */}
      <div className="modal-overlay" onClick={onClose}></div>

      {/* Modal */}
      <div className="modal-container">
        <div className="modal-box">
          <div className="modal-header">
            <div className="modal-header-group">
              <h2>Leave Request</h2>
              <CloseIcon onClick={onClose} />
            </div>
            <p className="modal-description">Requested on {formatDate(request.applied_date)}</p>
          </div>
          <div className="review-container">
            <div className="review-box">
              <div className="review-detail">
                <span>Staff</span>
                <p>{request.first_name} {request.last_name}</p>
              </div>

              <div className="review-detail">
                <span>Department</span>
                <p>{request.department_name}</p>
              </div>

              <div className="review-detail">
                <span>Start Date</span>
                <p>{formatDate(request.start_date)}</p>
              </div>
              <div className="review-detail">
                <span>End Date</span>
                <p>{formatDate(request.end_date)}</p>
              </div>
              <div className="review-detail">
                <span>Total Days</span>
                <p>{request.total_days}</p>
              </div>
              <div className="review-detail">
                <span>Status</span>
                <Chip
                  label={capitalizeFirst(request.status)}
                  sx={{
                    "& .MuiChip-label": {
                      color:
                        request.status === "approved"
                          ? "var(--status-approved)"
                          : request.status === "pending"
                            ? "var(--status-pending)"
                            : "var(--status-rejected)",
                    },
                    backgroundColor:
                      request.status === "approved"
                        ? "var(--status-approved-bg)"
                        : request.status === "pending"
                          ? "var(--status-pending-bg)"
                          : "var(--status-rejected-bg)",
                    border:
                      request.status === "approved"
                        ? "1px solid var(--status-approved)"
                        : request.status === "pending"
                          ? "1px solid var(--status-pending)"
                          : "1px solid var(--status-rejected)"
                  }}
                  size="big"
                />
              </div>
            </div>
          </div>
          <div className="modal-actions">
            {request.status === 'pending' && (
              <>
                <button
                  className="btn-approve"
                  onClick={() => handleSubmit('approved')}>Approve</button>
                <button
                  className="btn-reject"
                  onClick={() => handleSubmit('rejected')}>Reject</button>
              </>
            )}
            {error && <p className="error-message">{error}</p>}
          </div>
        </div>
      </div>
    </>
  );
}