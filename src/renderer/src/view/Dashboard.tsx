import React, { useState } from 'react';
import { Box } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';

import StatCard from '@/containers/dashboard/StatCard';
import StockDonutChart from '@/components/controlled/chart/StockDonutChart';
import BarChart from '@/containers/dashboard/Barchart';
import SalesTable from '@/containers/dashboard/SalesTable';
import DropdownField from '@/components/controlled/DropdownField';
import Cards from '@/containers/dashboard/Cards';

type FilterType = 'Today' | '6 Days' | 'This Month';

const Dashboard: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('This Month');

  const methods = useForm({
    defaultValues: {
      filterSelect: 'This Month',
    },
  });

  const chartDataMap = {
    Today: [
      { label: 'Purchases', value: 20, color: '#6EE700' },
      { label: 'Suppliers', value: 30, color: '#8B5CF6' },
      { label: 'Sales', value: 25, color: '#00F5C8' },
      { label: 'No Sales', value: 25, color: '#FFD200' },
    ],
    '6 Days': [
      { label: 'Purchases', value: 35, color: '#6EE700' },
      { label: 'Suppliers', value: 25, color: '#8B5CF6' },
      { label: 'Sales', value: 30, color: '#00F5C8' },
      { label: 'No Sales', value: 10, color: '#FFD200' },
    ],
    'This Month': [
      { label: 'Purchases', value: 42, color: '#6EE700' },
      { label: 'Suppliers', value: 28, color: '#8B5CF6' },
      { label: 'Sales', value: 18, color: '#00F5C8' },
      { label: 'No Sales', value: 12, color: '#FFD200' },
    ],
  };

  const filterOptions = [
    { label: 'Today', value: 'Today' },
    { label: '6 Days', value: '6 Days' },
    { label: 'This Month', value: 'This Month' },
  ];

  const handleFilterChange = (value: string) => {
    setFilter(value as FilterType);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        // background: 'linear-gradient(to bottom right, #F3F4F6, #E5E7EB)',
        // p: { xs: 1.5, sm: 3, md: 2 },
        // my:6
      }}
    >
     
      <Box sx={{ mb: { xs: 2, md: 3 } }}>
        <StatCard />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: { xs: 2, md: 3 },
          mb: 3,
        }}
      >
      
        <Box sx={{ width: '100%' }}>
          <FormProvider {...methods}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                mb: 1,
              }}
            >
              <Box sx={{ width: 130 }}>
                <DropdownField
                  name="filterSelect"
                  options={filterOptions}
                  onChangeCallback={handleFilterChange}
                  sx={{
                    height: 34,
                    backgroundColor: '#fff',
                    '& .MuiOutlinedInput-root': {
                      height: 34,
                    },
                  }}
                />
              </Box>
            </Box>
          </FormProvider>
          <StockDonutChart
            title="Graph Report"
            data={chartDataMap[filter]}
          />
        </Box>
        <Box sx={{ width: '100%' }}>
          <BarChart/>
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
