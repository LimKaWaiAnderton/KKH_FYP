import { useState } from 'react';
import { formatDate } from '../../../utils/dateUtils';
import TablePaginationActions from "../../TablePaginationActions";
import capitalizeFirst from '../../../utils/capitalizeUtils';
// Modules

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
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const paginatedRows =
        rowsPerPage > 0
            ? leaveReqHistoryData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : leaveReqHistoryData;

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
                                    backgroundColor: "#f6f8fa",
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
                        {paginatedRows.map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell>{formatDate(row.applied_date)}</TableCell>
                                <TableCell>{row.leave_type}</TableCell>
                                <TableCell>{formatDate(row.start_date)}</TableCell>
                                <TableCell>{formatDate(row.end_date)}</TableCell>
                                <TableCell>{row.total_days}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={capitalizeFirst(row.status)}
                                        sx={{
                                            backgroundColor:
                                                row.status === 'approved'
                                                    ? "var(--status-approved-bg)"
                                                    : row.status === 'pending'
                                                        ? 'var(--status-pending-bg)'
                                                        : 'var(--status-rejected-bg)',
                                            color:
                                                row.status === 'approved'
                                                    ? "var(--status-approved)"
                                                    : row.status === 'pending'
                                                        ? 'var(--status-pending)'
                                                        : 'var(--status-rejected)',
                                            border:
                                                row.status === "approved"
                                                    ? "1px solid var(--status-approved)"
                                                    : row.status === "pending"
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
                                count={leaveReqHistoryData.length}
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