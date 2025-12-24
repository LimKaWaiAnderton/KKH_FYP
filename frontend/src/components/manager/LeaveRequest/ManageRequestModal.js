import '../../../styles/ManagerLeaveReq.css';
import { formatDate } from '../../../utils/dateUtils';
import Chip from '@mui/material/Chip';
import CloseIcon from '@mui/icons-material/Close';

export default function ManageRequestModal({
  isOpen,
  onClose,
  request,
  onApprove,
  onReject
}) {
  if (!isOpen) return null;


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
                <p>{request.users.first_name} {request.users.last_name}</p>
              </div>

              <div className="review-detail">
                <span>Department</span>
                <p>{request.users.departments.name}</p>
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
                  label={request.status}
                  sx={{
                    "& .MuiChip-label": {
                      color:
                        request.status === "Approved"
                          ? "var(--status-approved)"
                          : request.status === "Pending"
                            ? "var(--status-pending)"
                            : "var(--status-rejected)",
                    },
                    backgroundColor:
                      request.status === "Approved"
                        ? "var(--status-approved-bg)"
                        : request.status === "Pending"
                          ? "var(--status-pending-bg)"
                          : "var(--status-rejected-bg)",
                    border:
                      request.status === "Approved"
                        ? "1px solid var(--status-approved)"
                        : request.status === "Pending"
                          ? "1px solid var(--status-pending)"
                          : "1px solid var(--status-rejected)"
                  }}
                  size="big"
                />
              </div>
            </div>
          </div>
          <div className="modal-actions">
            {request.status === 'Pending' && (
              <>
                <button className="btn-approve" onClick={() => onApprove(request)}>Approve</button>
                <button className="btn-reject" onClick={() => onReject(request)}>Reject</button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}