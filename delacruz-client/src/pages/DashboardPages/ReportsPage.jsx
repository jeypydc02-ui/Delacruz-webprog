import React, { useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const monthlyAdoptions = [12, 18, 15, 22, 30, 28, 35, 40, 32, 45, 38, 50];
const monthlyReturns = [2, 3, 1, 4, 2, 5, 3, 2, 4, 1, 3, 2];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const petTypeData = [
  { id: 0, value: 45, label: 'Dogs' },
  { id: 1, value: 30, label: 'Cats' },
  { id: 2, value: 15, label: 'Rabbits' },
  { id: 3, value: 10, label: 'Others' },
];

const regionData = [
  { region: 'NCR', adoptions: 120, returns: 8 },
  { region: 'Region III', adoptions: 85, returns: 5 },
  { region: 'Region IV-A', adoptions: 95, returns: 6 },
  { region: 'Region VII', adoptions: 60, returns: 4 },
  { region: 'Region XI', adoptions: 45, returns: 3 },
];

const MetricCard = ({ title, value, trend, trendValue, color }) => (
  <Card elevation={0} sx={{ flex: 1, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
    <CardContent>
      <Typography variant="body2" color="text.secondary" fontWeight={500}>
        {title}
      </Typography>
      <Typography variant="h4" fontWeight={700} sx={{ color, my: 0.5 }}>
        {value}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {trend === 'up' ? (
          <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
        ) : (
          <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />
        )}
        <Typography variant="caption" color={trend === 'up' ? 'success.main' : 'error.main'} fontWeight={600}>
          {trendValue}
        </Typography>
        <Typography variant="caption" color="text.secondary">vs last month</Typography>
      </Box>
    </CardContent>
  </Card>
);

function ReportsPage() {
  const [period, setPeriod] = useState('monthly');

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Reports
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Data visualization and analytics overview.
          </Typography>
        </Box>
        <ToggleButtonGroup
          value={period}
          exclusive
          onChange={(e, val) => val && setPeriod(val)}
          size="small"
        >
          <ToggleButton value="weekly">Weekly</ToggleButton>
          <ToggleButton value="monthly">Monthly</ToggleButton>
          <ToggleButton value="yearly">Yearly</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* KPI Cards */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <MetricCard title="Total Adoptions" value="372" trend="up" trendValue="+12%" color="#3d4a2e" />
        <MetricCard title="Successful Matches" value="341" trend="up" trendValue="+8%" color="#9AB17A" />
        <MetricCard title="Returns" value="31" trend="down" trendValue="-3%" color="#C3CC9B" />
        <MetricCard title="Pending Reviews" value="24" trend="up" trendValue="+5%" color="#3d4a2e" />
      </Stack>

      {/* Adoptions Line Chart */}
      <Card elevation={0} sx={{ mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" fontWeight={600}>Monthly Adoption Trends</Typography>
            <Chip label="2024" size="small" color="primary" />
          </Box>
          <Divider sx={{ mb: 2 }} />
          <LineChart
            xAxis={[{ data: months, scaleType: 'point' }]}
            series={[
              { data: monthlyAdoptions, label: 'Adoptions', color: '#3d4a2e' },
              { data: monthlyReturns, label: 'Returns', color: '#ef5350' },
            ]}
            height={300}
          />
        </CardContent>
      </Card>

      {/* Bar + Pie Row */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 3 }}>
        <Card elevation={0} sx={{ flex: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Adoptions by Region
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <BarChart
              xAxis={[{ data: regionData.map((r) => r.region), scaleType: 'band' }]}
              series={[
                { data: regionData.map((r) => r.adoptions), label: 'Adoptions', color: '#3d4a2e' },
                { data: regionData.map((r) => r.returns), label: 'Returns', color: '#9AB17A' },
              ]}
              height={280}
            />
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ flex: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Pet Type Breakdown
            </Typography>
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

      {/* Sparklines Summary */}
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Weekly Snapshot
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
            {[
              { label: 'New Applications', data: [3, 5, 7, 4, 8, 6, 9], color: '#3d4a2e' },
              { label: 'Approved', data: [2, 4, 5, 3, 7, 5, 8], color: '#9AB17A' },
              { label: 'Pending', data: [1, 2, 3, 4, 2, 3, 1], color: '#C3CC9B' },
              { label: 'Rejected', data: [0, 1, 0, 1, 0, 1, 0], color: '#ef5350' },
            ].map(({ label, data, color }) => (
              <Box key={label} sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  {label}
                </Typography>
                <SparkLineChart data={data} height={60} color={color} />
                <Typography variant="h6" fontWeight={700} sx={{ color }}>
                  {data[data.length - 1]}
                </Typography>
                <Typography variant="caption" color="text.secondary">This week</Typography>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export default ReportsPage;
