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
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

export default function LeaveReqHistory({ leaveReqHistoryData, onSelectRequest }) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");

    // Filter data based on search query
    const filteredRows = leaveReqHistoryData.filter((row) => {
        const query = searchQuery.toLowerCase();
        return (
            row.first_name.toLowerCase().includes(query) ||
            row.last_name.toLowerCase().includes(query) ||
            row.leave_type.toLowerCase().includes(query)
        );
    })

    // Paginate the filtered data
    const paginatedRows =
        rowsPerPage > 0
            ? filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : filteredRows;

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
            <div className="search-wrapper">
                <SearchIcon
                    className="search-icon"
                    fontSize="small"
                    sx={{ color: "var(--primary-color-muted)" }} />
                <input
                    type="text"
                    placeholder="Search by name or leave type"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
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
                            <TableCell sx={{ width: 200 }}>Name</TableCell>
                            <TableCell sx={{ width: 160 }}>Applied Date</TableCell>
                            <TableCell sx={{ width: 160 }}>Leave Type</TableCell>
                            <TableCell sx={{ width: 250 }}>Start Date to End Date</TableCell>
                            <TableCell sx={{ width: 120 }}>Total Days</TableCell>
                            <TableCell sx={{ width: 150 }}>Status</TableCell>
                            <TableCell sx={{ width: 48 }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedRows.map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell sx={{ width: 200 }}>{row.first_name} {row.last_name}</TableCell>
                                <TableCell sx={{ width: 160 }}>{formatDate(row.applied_date)}</TableCell>
                                <TableCell sx={{ width: 160 }}>{row.leave_type}</TableCell>
                                <TableCell sx={{ width: 250 }}>
                                    {formatDate(row.start_date)} - {formatDate(row.end_date)}
                                </TableCell>
                                <TableCell sx={{ width: 120 }}>{row.total_days}</TableCell>
                                <TableCell sx={{ width: 150 }}>
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
                                <TableCell sx={{ width: 48 }}>
                                    <MoreHorizIcon
                                        className="action-icon"
                                        onClick={() => onSelectRequest(row)} />
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