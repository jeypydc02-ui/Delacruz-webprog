import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { Gauge } from '@mui/x-charts/Gauge';
import { DataGrid } from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'firstName', headerName: 'First name', width: 130, editable: true },
  { field: 'lastName', headerName: 'Last name', width: 130, editable: true },
  { field: 'age', headerName: 'Age', type: 'number', width: 90, editable: true },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 180,
    valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

const StatCard = ({ title, value, subtitle, color = '#3d4a2e' }) => (
  <Card elevation={0} sx={{ flex: 1, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
    <CardContent>
      <Typography variant="body2" color="text.secondary" fontWeight={500} gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" fontWeight={700} sx={{ color }}>
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="caption" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

function DashboardPage() {
  const location = useLocation();

  const totalUsers = rows.length;
  const avgAge = (
    rows.reduce((sum, row) => sum + (row.age || 0), 0) /
    rows.filter((row) => row.age !== null).length
  ).toFixed(1);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Welcome back! Here's what's happening today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
        <StatCard
          title="Total Users"
          value={totalUsers}
          subtitle="Registered accounts"
          color="#3d4a2e"
        />
        <StatCard
          title="Average Age"
          value={avgAge}
          subtitle="Across all users"
          color="#9AB17A"
        />
        <StatCard
          title="Active Sessions"
          value="3"
          subtitle="Currently online"
          color="#C3CC9B"
        />
        <StatCard
          title="Reports"
          value="12"
          subtitle="Generated this month"
          color="#3d4a2e"
        />
      </Stack>

      {/* Gauges */}
      <Card elevation={0} sx={{ mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Performance Metrics
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center" justifyContent="center">
            <Box textAlign="center">
              <Gauge width={160} height={160} value={50} />
              <Typography variant="caption" color="text.secondary">CPU Usage</Typography>
            </Box>
            <Box textAlign="center">
              <Gauge width={160} height={160} value={75} valueMax={100} />
              <Typography variant="caption" color="text.secondary">Memory Usage</Typography>
            </Box>
            <Box textAlign="center">
              <Gauge width={160} height={160} value={88} valueMax={100} />
              <Typography variant="caption" color="text.secondary">Storage</Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 3 }}>
        <Card elevation={0} sx={{ flex: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" fontWeight={600}>Quarterly Sales</Typography>
              <Chip label="2024" size="small" color="primary" />
            </Box>
            <Divider sx={{ mb: 2 }} />
            <BarChart
              series={[
                { data: [35, 44, 24, 34], label: 'Series 1' },
                { data: [51, 6, 49, 30], label: 'Series 2' },
              ]}
              height={260}
              xAxis={[{ data: ['Q1', 'Q2', 'Q3', 'Q4'], scaleType: 'band', label: 'Quarters' }]}
            />
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ flex: 1, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Distribution
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <PieChart
                series={[
                  {
                    data: [
                      { id: 0, value: 10, label: 'Series A' },
                      { id: 1, value: 15, label: 'Series B' },
                      { id: 2, value: 20, label: 'Series C' },
                    ],
                  },
                ]}
                width={280}
                height={260}
              />
            </Box>
          </CardContent>
        </Card>
      </Stack>

      {/* DataGrid */}
      <Card elevation={0} sx={{ mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" fontWeight={600}>Users Overview</Typography>
            <Chip label={`${totalUsers} users`} size="small" variant="outlined" />
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: { paginationModel: { pageSize: 5 } },
              }}
              pageSizeOptions={[5]}
              checkboxSelection
              disableRowSelectionOnClick
              sx={{
                border: 'none',
                '& .MuiDataGrid-columnHeaders': { bgcolor: '#f5f5f5', borderRadius: 1 },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Leaflet Map */}
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Location Map
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ height: 450, width: '100%', borderRadius: 2, overflow: 'hidden' }}>
            <MapContainer
              center={[14.604253, 120.994314]}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[14.604253, 120.994314]}>
                <Popup>
                  <strong>National University-Manila</strong>
                  <br />
                  551 F Jhocson St, Sampaloc, Manila, 1008 Metro Manila
                </Popup>
              </Marker>
            </MapContainer>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default DashboardPage;
