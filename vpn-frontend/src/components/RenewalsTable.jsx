import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

function TablePaginationActions({ count, page, rowsPerPage, onPageChange }) {
    const theme = useTheme();
    const lastPage = Math.max(0, Math.ceil(count / rowsPerPage) - 1);

    const btnSx = { color: 'rgba(255,255,255,0.5)' };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton onClick={e => onPageChange(e, 0)} disabled={page === 0} sx={btnSx}>
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton onClick={e => onPageChange(e, page - 1)} disabled={page === 0} sx={btnSx}>
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton onClick={e => onPageChange(e, page + 1)} disabled={page >= lastPage} sx={btnSx}>
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton onClick={e => onPageChange(e, lastPage)} disabled={page >= lastPage} sx={btnSx}>
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

const ROWS_PER_PAGE = 10;

export default function RenewalsTable({ data }) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(ROWS_PER_PAGE);

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

    const visibleRows = rowsPerPage > 0
        ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        : data;

    const handleChangePage = (_, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = e => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    const cellStyle = { color: 'rgba(255,255,255,0.4)' };
    const divider = { borderLeft: '1px solid rgba(255,255,255,0.08)' };

    return (
        <TableContainer component={Paper} sx={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Table sx={{ minWidth: 650 }} aria-label="renewals table">
                <TableHead sx={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <TableRow>
                        <TableCell align="center" sx={cellStyle}>Username</TableCell>
                        <TableCell align="center" sx={{ ...cellStyle, ...divider }}>Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {visibleRows.map((row) => (
                        <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" align="center" scope="row" sx={{ color: '#fff' }}>
                                {row.username}
                            </TableCell>
                            <TableCell align="center" sx={{ color: '#fff' }}>
                                {formatDate(row.timestamp)}
                            </TableCell>
                        </TableRow>
                    ))}
                    {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                            <TableCell colSpan={2} />
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                            colSpan={2}
                            count={data.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                            slotProps={{
                                select: { inputProps: { 'aria-label': 'rows per page' }, native: true },
                            }}
                            sx={{
                                color: 'rgba(255,255,255,0.5)',
                                '.MuiTablePagination-selectIcon': { color: 'rgba(255,255,255,0.5)' },
                            }}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );
}

function formatDate(isoString) {
    const d = new Date(isoString);
    const pad = n => String(n).padStart(2, '0');
    return `${pad(d.getUTCDate())}/${pad(d.getUTCMonth() + 1)}/${String(d.getUTCFullYear()).slice(-2)} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
}