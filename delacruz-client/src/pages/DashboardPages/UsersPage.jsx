import React, { useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VerifiedIcon from '@mui/icons-material/Verified';
import PendingIcon from '@mui/icons-material/Pending';
import BlockIcon from '@mui/icons-material/Block';

const statusMap = {
  Active: { color: 'success', icon: <VerifiedIcon sx={{ fontSize: 14 }} /> },
  Pending: { color: 'warning', icon: <PendingIcon sx={{ fontSize: 14 }} /> },
  Suspended: { color: 'error', icon: <BlockIcon sx={{ fontSize: 14 }} /> },
};

const users = [
  { id: 1, firstName: 'Jon', lastName: 'Snow', email: 'jon.snow@example.com', age: 14, role: 'Adopter', status: 'Active', joined: '2024-01-15' },
  { id: 2, firstName: 'Cersei', lastName: 'Lannister', email: 'cersei.l@example.com', age: 31, role: 'Shelter', status: 'Active', joined: '2024-02-10' },
  { id: 3, firstName: 'Jaime', lastName: 'Lannister', email: 'jaime.l@example.com', age: 31, role: 'Adopter', status: 'Pending', joined: '2024-03-22' },
  { id: 4, firstName: 'Arya', lastName: 'Stark', email: 'arya.stark@example.com', age: 11, role: 'Adopter', status: 'Active', joined: '2024-04-05' },
  { id: 5, firstName: 'Daenerys', lastName: 'Targaryen', email: 'dany.t@example.com', age: null, role: 'Shelter', status: 'Active', joined: '2024-04-18' },
  { id: 6, firstName: null, lastName: 'Melisandre', email: 'red.woman@example.com', age: 150, role: 'Admin', status: 'Suspended', joined: '2023-12-01' },
  { id: 7, firstName: 'Ferrara', lastName: 'Clifford', email: 'ferrara.c@example.com', age: 44, role: 'Adopter', status: 'Active', joined: '2024-05-30' },
  { id: 8, firstName: 'Rossini', lastName: 'Frances', email: 'rossini.f@example.com', age: 36, role: 'Volunteer', status: 'Active', joined: '2024-06-12' },
  { id: 9, firstName: 'Harvey', lastName: 'Roxie', email: 'harvey.r@example.com', age: 65, role: 'Donor', status: 'Pending', joined: '2024-07-03' },
];

const columns = [
  { field: 'id', headerName: 'ID', width: 60 },
  {
    field: 'avatar',
    headerName: '',
    width: 50,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <Avatar sx={{ width: 32, height: 32, bgcolor: '#3d4a2e', fontSize: 13 }}>
        {(params.row.firstName?.[0] || params.row.lastName?.[0] || '?').toUpperCase()}
      </Avatar>
    ),
  },
  { field: 'firstName', headerName: 'First Name', width: 120, editable: true },
  { field: 'lastName', headerName: 'Last Name', width: 120, editable: true },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'age', headerName: 'Age', type: 'number', width: 70, editable: true },
  {
    field: 'fullName',
    headerName: 'Full Name',
    width: 160,
    sortable: false,
    valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`.trim(),
  },
  {
    field: 'role',
    headerName: 'Role',
    width: 110,
    renderCell: (params) => (
      <Chip label={params.value} size="small" variant="outlined" sx={{ fontWeight: 500 }} />
    ),
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    renderCell: (params) => {
      const s = statusMap[params.value] || { color: 'default' };
      return (
        <Chip
          label={params.value}
          size="small"
          color={s.color}
          icon={s.icon}
          sx={{ fontWeight: 600 }}
        />
      );
    },
  },
  { field: 'joined', headerName: 'Joined', width: 110 },
];

const SummaryCard = ({ label, count, color }) => (
  <Card elevation={0} sx={{ flex: 1, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
    <CardContent sx={{ py: 1.5 }}>
      <Typography variant="body2" color="text.secondary" fontWeight={500}>
        {label}
      </Typography>
      <Typography variant="h4" fontWeight={700} sx={{ color }}>
        {count}
      </Typography>
    </CardContent>
  </Card>
);

function UsersPage() {
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      (u.firstName || '').toLowerCase().includes(q) ||
      (u.lastName || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.role || '').toLowerCase().includes(q)
    );
  });

  const activeCount = users.filter((u) => u.status === 'Active').length;
  const pendingCount = users.filter((u) => u.status === 'Pending').length;
  const suspendedCount = users.filter((u) => u.status === 'Suspended').length;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Users
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage all registered users, adopters, shelters, and volunteers.
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <SummaryCard label="Total Users" count={users.length} color="#3d4a2e" />
        <SummaryCard label="Active" count={activeCount} color="#2e7d32" />
        <SummaryCard label="Pending" count={pendingCount} color="#ed6c02" />
        <SummaryCard label="Suspended" count={suspendedCount} color="#d32f2f" />
      </Stack>

      {/* Table Card */}
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>User List</Typography>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              size="small"
              sx={{ bgcolor: '#3d4a2e', '&:hover': { bgcolor: '#2a3520' } }}
            >
              Add User
            </Button>
          </Box>

          <TextField
            size="small"
            placeholder="Search by name, email, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ mb: 2, width: { xs: '100%', sm: 340 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />

          <Divider sx={{ mb: 2 }} />

          <Box sx={{ height: 500, width: '100%' }}>
            <DataGrid
              rows={filteredUsers}
              columns={columns}
              initialState={{
                pagination: { paginationModel: { pageSize: 7 } },
              }}
              pageSizeOptions={[7, 10, 25]}
              checkboxSelection
              disableRowSelectionOnClick
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: { showQuickFilter: false, printOptions: { disableToolbarButton: true } },
              }}
              sx={{
                border: 'none',
                '& .MuiDataGrid-columnHeaders': { bgcolor: '#f5f5f5' },
                '& .MuiDataGrid-row:hover': { bgcolor: '#f9fbe7' },
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default UsersPage;
