import { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { Gauge } from '@mui/x-charts/Gauge';
import { DataGrid } from '@mui/x-data-grid';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PrintIcon from '@mui/icons-material/Print';
import FilterListIcon from '@mui/icons-material/FilterList';

// ── data ────────────────────────────────────────────────────────────────────
const monthlyAdoptions = [12, 18, 15, 22, 30, 28, 35, 40, 32, 45, 38, 50];
const monthlyReturns   = [2,  3,  1,  4,  2,  5,  3,  2,  4,  1,  3,  2];
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const petTypeData = [
  { id: 0, value: 45, label: 'Dogs' },
  { id: 1, value: 30, label: 'Cats' },
  { id: 2, value: 15, label: 'Rabbits' },
  { id: 3, value: 10, label: 'Others' },
];

const regionData = [
  { region: 'NCR',        adoptions: 120, returns: 8 },
  { region: 'Region III', adoptions: 85,  returns: 5 },
  { region: 'Region IV-A',adoptions: 95,  returns: 6 },
  { region: 'Region VII', adoptions: 60,  returns: 4 },
  { region: 'Region XI',  adoptions: 45,  returns: 3 },
];

const reportColumns = [
  { field: 'id',          headerName: 'ID',       width: 60 },
  { field: 'firstName',   headerName: 'First name',width: 150, editable: true },
  { field: 'lastName',    headerName: 'Last name', width: 150, editable: true },
  { field: 'age',         headerName: 'Age',       type: 'number', width: 110, editable: true },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  },
];

const reportRows = [
  { id: 1, lastName: 'Snow',      firstName: 'Jon',       age: 14 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei',    age: 31 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime',     age: 31 },
  { id: 4, lastName: 'Stark',     firstName: 'Arya',      age: 11 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys',  age: null },
  { id: 6, lastName: 'Melisandre',firstName: null,        age: 150 },
  { id: 7, lastName: 'Clifford',  firstName: 'Ferrara',   age: 44 },
  { id: 8, lastName: 'Frances',   firstName: 'Rossini',   age: 36 },
  { id: 9, lastName: 'Roxie',     firstName: 'Harvey',    age: 65 },
];

// ── sub-components ──────────────────────────────────────────────────────────
const MetricCard = ({ title, value, trend, trendValue, color }) => (
  <Card elevation={0} sx={{ flex: 1, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
    <CardContent>
      <Typography variant="body2" color="text.secondary" fontWeight={500}>{title}</Typography>
      <Typography variant="h4" fontWeight={700} sx={{ color, my: 0.5 }}>{value}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {trend === 'up'
          ? <TrendingUpIcon   sx={{ fontSize: 16, color: 'success.main' }} />
          : <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />}
        <Typography variant="caption" color={trend === 'up' ? 'success.main' : 'error.main'} fontWeight={600}>
          {trendValue}
        </Typography>
        <Typography variant="caption" color="text.secondary">vs last month</Typography>
      </Box>
    </CardContent>
  </Card>
);

// ── main component ──────────────────────────────────────────────────────────
const ReportsPage = () => {
  const printRef = useRef(null);
  const [period, setPeriod] = useState('monthly');

  // ── Enhancement 1 · print handler ──────────────────────────────────────
  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank', 'width=1200,height=900');
    if (!printWindow) return;

    const headMarkup = Array.from(
      document.querySelectorAll('style, link[rel="stylesheet"]')
    ).map((node) => node.outerHTML).join('');

    const exportedAt = new Intl.DateTimeFormat('en-US', {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(new Date());

    printWindow.document.write(`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Print Report</title>
    ${headMarkup}
    <style>
      @page { size: A4; margin: 16mm; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: Arial, Helvetica, sans-serif;
        background: #fff;
        color: #1f2937;
      }
      .report-shell   { padding: 28px; }
      .report-header  { margin-bottom: 24px; padding-bottom: 14px; border-bottom: 1px solid #d1d5db; }
      .report-header h1 { margin: 0 0 6px; font-size: 20px; font-weight: 700; }
      .report-header p  { margin: 0; font-size: 14px; color: #6b7280; line-height: 1.5; }
      .report-content .MuiCard-root       { box-shadow: none !important; border: 1px solid #e5e7eb; break-inside: avoid; page-break-inside: avoid; }
      .report-content .MuiCardContent-root{ padding: 20px; }
      .report-content svg                 { max-width: 100%; }
    </style>
  </head>
  <body>
    <main class="report-shell">
      <header class="report-header">
        <h1>Reports Summary</h1>
        <p>Analytics overview for generated reports, category breakdown, and completion performance.</p>
        <p>Prepared on ${exportedAt}</p>
      </header>
      <section class="report-content">
        ${printContent.outerHTML}
      </section>
    </main>
  </body>
</html>`);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <Box>
      {/* ── Page header ── */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>Reports</Typography>
          <Typography variant="body2" color="text.secondary">
            Data visualization and analytics overview.
          </Typography>
        </Box>

        {/* period toggle + action buttons */}
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Button variant="contained"  onClick={() => {}}>Generate</Button>
          <Button variant="outlined"   onClick={handlePrint} startIcon={<PrintIcon />}>Export</Button>
          <Button variant="outlined"   startIcon={<FilterListIcon />}>Filter</Button>
        </Stack>
      </Stack>

      {/* ── Printable section ── */}
      <Stack ref={printRef} spacing={3}>

        {/* KPI Cards */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <MetricCard title="Total Adoptions"   value="372" trend="up"   trendValue="+12%" color="#3d4a2e" />
          <MetricCard title="Successful Matches" value="341" trend="up"   trendValue="+8%"  color="#9AB17A" />
          <MetricCard title="Returns"            value="31"  trend="down" trendValue="-3%"  color="#C3CC9B" />
          <MetricCard title="Pending Reviews"    value="24"  trend="up"   trendValue="+5%"  color="#3d4a2e" />
        </Stack>

        {/* ── Enhancement 1 · Monthly Report Output (BarChart) ── */}
        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>Monthly Report Output</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              This chart compares how many reports were generated and how many were completed across the last four months.
            </Typography>
            <BarChart
              series={[
                { data: [18, 24, 20, 27], label: 'Generated' },
                { data: [12, 19, 17, 23], label: 'Completed' },
              ]}
              height={300}
              xAxis={[{
                data: ['January', 'February', 'March', 'April'],
                scaleType: 'band',
                label: 'Months',
              }]}
            />
          </CardContent>
        </Card>

        {/* ── Pie + Gauge row ── */}
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3}>

          {/* Report Category Share */}
          <Card sx={{ flex: 1, border: '1px solid', borderColor: 'divider', borderRadius: 2 }} elevation={0}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>Report Category Share</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                This chart shows the distribution of report requests by category for the current reporting period.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <PieChart
                  series={[{
                    data: [
                      { id: 0, value: 14, label: 'Sales' },
                      { id: 1, value: 30, label: 'Users' },
                      { id: 2, value: 6,  label: 'Inventory' },
                      { id: 3, value: 6,  label: 'Finance' },
                    ],
                  }]}
                  width={208}
                  height={220}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Completion Rate */}
          <Card sx={{ flex: 1, border: '1px solid', borderColor: 'divider', borderRadius: 2 }} elevation={0}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>Completion Rate</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                The gauge highlights the current percentage of reports completed on time based on the latest reporting cycle.
              </Typography>
              <Box sx={{ minHeight: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ minHeight: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Gauge width={180} height={180} value={70} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Stack>

        {/* ── Adoption Trend (Line chart from Lab 5) ── */}
        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" fontWeight={600}>Monthly Adoption Trends</Typography>
              <Chip label="2024" size="small" color="primary" />
            </Box>
            <Divider sx={{ mb: 2 }} />
            <ToggleButtonGroup
              value={period}
              exclusive
              onChange={(e, val) => val && setPeriod(val)}
              size="small"
              sx={{ mb: 2 }}
            >
              <ToggleButton value="weekly">Weekly</ToggleButton>
              <ToggleButton value="monthly">Monthly</ToggleButton>
              <ToggleButton value="yearly">Yearly</ToggleButton>
            </ToggleButtonGroup>
            <LineChart
              xAxis={[{ data: months, scaleType: 'point' }]}
              series={[
                { data: monthlyAdoptions, label: 'Adoptions', color: '#3d4a2e' },
                { data: monthlyReturns,   label: 'Returns',   color: '#ef5350' },
              ]}
              height={300}
            />
          </CardContent>
        </Card>

        {/* ── Region Bar + Pet-Type Pie ── */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          <Card elevation={0} sx={{ flex: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>Adoptions by Region</Typography>
              <Divider sx={{ mb: 2 }} />
              <BarChart
                xAxis={[{ data: regionData.map((r) => r.region), scaleType: 'band' }]}
                series={[
                  { data: regionData.map((r) => r.adoptions), label: 'Adoptions', color: '#3d4a2e' },
                  { data: regionData.map((r) => r.returns),   label: 'Returns',   color: '#9AB17A' },
                ]}
                height={280}
              />
            </CardContent>
          </Card>

          <Card elevation={0} sx={{ flex: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>Pet Type Breakdown</Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <PieChart
                  series={[{ data: petTypeData, innerRadius: 50 }]}
                  width={300}
                  height={280}
                />
              </Box>
            </CardContent>
          </Card>
        </Stack>

        {/* ── Weekly Sparklines ── */}
        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>Weekly Snapshot</Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              {[
                { label: 'New Applications', data: [3, 5, 7, 4, 8, 6, 9], color: '#3d4a2e' },
                { label: 'Approved',          data: [2, 4, 5, 3, 7, 5, 8], color: '#9AB17A' },
                { label: 'Pending',           data: [1, 2, 3, 4, 2, 3, 1], color: '#C3CC9B' },
                { label: 'Rejected',          data: [0, 1, 0, 1, 0, 1, 0], color: '#ef5350' },
              ].map(({ label, data, color }) => (
                <Box key={label} sx={{ flex: 1 }}>
                  <Typography variant="body2" fontWeight={600} gutterBottom>{label}</Typography>
                  <SparkLineChart data={data} height={60} color={color} />
                  <Typography variant="h6" fontWeight={700} sx={{ color }}>{data[data.length - 1]}</Typography>
                  <Typography variant="caption" color="text.secondary">This week</Typography>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>

        {/* ── DataGrid (from Lab 6 snippet) ── */}
        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <CardContent>
            <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={reportRows}
                columns={reportColumns}
                experimentalFeatures={{ newEditingApi: true }}
                initialState={{
                  pagination: { paginationModel: { pageSize: 5 } },
                }}
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
              />
            </Box>
          </CardContent>
        </Card>

      </Stack>{/* end printRef */}
    </Box>
  );
};

export default ReportsPage;
