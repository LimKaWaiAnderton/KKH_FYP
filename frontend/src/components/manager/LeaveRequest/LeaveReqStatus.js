import GroupIcon from '@mui/icons-material/Group';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

export default function LeaveReqStatus({ leaveReqStatusCounts, onStatusClick, filterStatus }) {
    return (
        <div className="leave-req-group">
            <div
                className={`leave-req-status-container requested ${filterStatus === null ? "active" : ""}`}
                onClick={() => onStatusClick(null)}>
                <h2>{leaveReqStatusCounts.requested}</h2>
                <div className="leave-req-status">
                    <GroupIcon sx={{ color: "var(--status-info)" }} />
                    <p>Requested</p>
                </div>
            </div>
            <div
                className={`leave-req-status-container approved ${filterStatus === "Approved" ? "active" : ""}`}
                onClick={() => onStatusClick("Approved")}>
                <h2>{leaveReqStatusCounts.approved}</h2>
                <div className="leave-req-status">
                    <CheckCircleOutlineIcon sx={{ color: "var(--status-approved)" }} />
                    <p>Approved</p>
                </div>
            </div>
            <div
                className={`leave-req-status-container pending ${filterStatus === "Pending" ? "active" : ""}`}
                onClick={() => onStatusClick("Pending")}>
                <h2>{leaveReqStatusCounts.pending}</h2>
                <div className="leave-req-status">
                    <HourglassTopIcon sx={{ color: "var(--status-pending)" }} />
                    <p>Pending</p>
                </div>
            </div>
            <div
                className={`leave-req-status-container rejected ${filterStatus === "Rejected" ? "active" : ""}`}
                onClick={() => onStatusClick("Rejected")}>
                <h2>{leaveReqStatusCounts.rejected}</h2>
                <div className="leave-req-status">
                    <HighlightOffIcon sx={{ color: "var(--status-rejected)" }} />
                    <p>Rejected</p>
                </div>
            </div>
        </div>
    )
}