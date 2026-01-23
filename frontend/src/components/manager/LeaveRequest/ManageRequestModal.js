import { useState } from 'react';
import toast from 'react-hot-toast';

import '../../../styles/ManagerLeaveReq.css';
import { formatDate } from '../../../utils/dateUtils';
import capitalizeFirst from '../../../utils/capitalizeUtils';

import Chip from '@mui/material/Chip';
import CloseIcon from '@mui/icons-material/Close';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';

// API call
import { updateLeaveRequest } from '../../../api/leave.api.js';

export default function ManageRequestModal({
  isOpen,
  request,
  onClose,
  onRefresh
}) {
  const [error, setError] = useState("");

  if (!isOpen || !request) return null;

  const handleSubmit = async (status) => {
    try {
      setError("");
      const data = await updateLeaveRequest({ ...request, status });
      onRefresh(data);
      toast.success(
        status === 'approved'
          ? 'Leave request approved successfully'
          : 'Leave request rejected'
      );

      onClose();
    } catch (error) {
      setError(error.message || "Failed to update leave request.");
      toast.error('Failed to update leave request');
    }
  }

  return (
    <>
      {/* Overlay */}
      <div className="modal-overlay" onClick={onClose}></div>

      {/* Modal */}
      <div className="modal-container">
        <div className="modal-box">
            <div className="modal-header-group">
              <h2 className="modal-title">Leave Request</h2>
              <CloseIcon onClick={onClose} />
            </div>
            <p className="modal-description">Requested on {formatDate(request.applied_date)}</p>
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
            {error && <p className="error-message">{error}</p>}
          </div>
          <div className="modal-actions">
            {request.status === 'pending' && (
              <>
                <button
                  className="btn-reject"
                  onClick={() => handleSubmit('rejected')}>
                    Reject
                    <ThumbDownOffAltIcon fontSize='20px'/>
                    </button>
                <button
                  className="btn-approve"
                  onClick={() => handleSubmit('approved')}>
                    Approve
                    <ThumbUpOffAltIcon fontSize='20px' />
                    </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}