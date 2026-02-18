



import React from 'react';
import { Box } from '@mui/material';

import StatCard from '@/containers/dashboard/StatCard';
import StockDonutChart from '@/components/controlled/chart/StockDonutChart';
import BarChart from '@/containers/dashboard/Barchart';
import SalesTable from '@/containers/dashboard/SalesTable';
import Cards from '@/containers/dashboard/Cards';
import Alerts from '@/containers/dashboard/Alerts';

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Box sx={{ mb: { xs: 2, md: 3 } }}>
        <StatCard />
      </Box>

      <Alerts />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: { xs: 2, md: 3 },
          mb: 3,
        }}
      >
        <Box sx={{ width: '100%' }}>
          <StockDonutChart title="Graph Report" />
        </Box>

        <Box sx={{ width: '100%' }}>
          <BarChart />
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Cards />
      </Box>

      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <SalesTable />
      </Box>
    </Box>
  );
};

export default Dashboard;








