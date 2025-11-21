import React from 'react';
import TablePaginationActions from "./TablePaginationActions";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import TableFooter from "@mui/material/TableFooter";
import Chip from '@mui/material/Chip';

export default function LeaveReqHistory({ leaveReqHistoryData }) {

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    // Sort newest first based on applied_date
    const sortedHistory = [...leaveReqHistoryData].sort((a, b) => {
        return new Date(b.applied_date) - new Date(a.applied_date);
    });

    const leaveReq_Rows = sortedHistory.map((leave) => ({
        id: leave.id,
        leaveType: leave.leave_types.name,
        startDate: leave.start_date,
        endDate: leave.end_date,
        totalDays: leave.total_days,
        status: leave.status,
        appliedDate: leave.applied_date,
    }));

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div className='container'>
            <h2>Leave Request History</h2>
            <TableContainer>
                <Table sx={{ minWidth: 650, border: '1px solid var(--border-color)', }} aria-label="leave request history table">
                    <TableHead>
                        <TableRow
                            sx={{
                                "& .MuiTableCell-root": {
                                    fontFamily: "var(--font-family)",
                                    fontWeight: "bold",
                                    backgroundColor: "var(--primary-bg-color)",
                                }
                            }}
                        >
                            <TableCell sx={{ width: "150px" }}>Applied Date</TableCell>
                            <TableCell sx={{ width: "150px" }}>Leave Type</TableCell>
                            <TableCell sx={{ width: "120px" }}>Start Date</TableCell>
                            <TableCell sx={{ width: "120px" }}>End Date</TableCell>
                            <TableCell sx={{ width: "100px" }}>Total Days</TableCell>
                            <TableCell sx={{ width: "120px" }}>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0
                            ? leaveReq_Rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : leaveReq_Rows
                        ).map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell>{row.appliedDate}</TableCell>
                                <TableCell>{row.leaveType}</TableCell>
                                <TableCell>{row.startDate}</TableCell>
                                <TableCell>{row.endDate}</TableCell>
                                <TableCell>{row.totalDays}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={row.status}
                                        sx={{
                                            backgroundColor:
                                                row.status === 'Approved'
                                                    ? "var(--status-approved-bg)"
                                                    : row.status === 'Pending'
                                                        ? 'var(--status-pending-bg)'
                                                        : 'var(--status-rejected-bg)',
                                            color:
                                                row.status === 'Approved'
                                                    ? "var(--status-approved)"
                                                    : row.status === 'Pending'
                                                        ? 'var(--status-pending)'
                                                        : 'var(--status-rejected)',
                                            border:
                                                row.status === "Approved"
                                                    ? "1px solid var(--status-approved)"
                                                    : row.status === "Pending"
                                                        ? "1px solid var(--status-pending)"
                                                        : "1px solid var(--status-rejected)",
                                        }}
                                        size="big"
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={3}
                                count={leaveReq_Rows.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                slotProps={{
                                    select: {
                                        inputProps: {
                                            'aria-label': 'rows per page',
                                        },
                                        native: true,
                                    },
                                }}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </div>
    )
}