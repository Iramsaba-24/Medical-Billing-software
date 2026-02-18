// import {
//   Card,
//   Typography,
//   Box,
//   useTheme,
//   useMediaQuery,
// } from '@mui/material';
// import { PieChart } from '@mui/x-charts/PieChart';
// import { useDrawingArea } from '@mui/x-charts/hooks';

// function CenterLabel({ children }: { children: React.ReactNode }) {
//   const { width, height, left, top } = useDrawingArea();

//   return (
//     <text
//       x={left + width / 2}
//       y={top + height / 2}
//       textAnchor="middle"
//       dominantBaseline="central"
//       style={{
//         fontSize: width < 180 ? 12 : 14, 
//         fontWeight: 600,
//       }}
//     >
//       {children}
//     </text>
//   );
// }

// type StockDonutChartProps = {
//   title: string;
//   data: {
//     label: string;
//     value: number;
//     color: string;
//   }[];
// };

// const StockDonutChart = ({ title, data }: StockDonutChartProps) => {
//   const total = data.reduce((sum, d) => sum + d.value, 0);

//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const isSmallMobile = useMediaQuery('(max-width:360px)');

//   const chartSize = isSmallMobile ? 160 : isMobile ? 180 : 260;
//   const innerRadius = isSmallMobile ? 40 : isMobile ? 45 : 70;
//   const outerRadius = isSmallMobile ? 68 : isMobile ? 75 : 110;

//   return (
//     <Card
//       variant="outlined"
//       sx={{
//         p: { xs: 1, sm: 2 },
//         overflow: 'hidden',
//       }}
//     >
//       <Typography variant="h6" fontWeight={600} mb={1}>
//         {title}
//       </Typography>

//       <Box
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         sx={{
//           width: '100%',
//           overflow: 'hidden',
//         }}
//       >
//         <PieChart
//           margin={{ top: 10, bottom: 10, left: 10, right: 10 }} 
//           series={[
//             {
//               data,
//               innerRadius,
//               outerRadius,
//               paddingAngle: 2,
//             },
//           ]}
//           width={chartSize}
//           height={chartSize}
//         >
//           <CenterLabel>{total}%</CenterLabel>
//         </PieChart>
//       </Box>
//     </Card>
//   );
// };

// export default StockDonutChart;



import React, { useState } from 'react';
import {
  Card,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { FormProvider, useForm } from 'react-hook-form';
import DropdownField from '@/components/controlled/DropdownField';

function CenterLabel({ children }: { children: React.ReactNode }) {
  const { width, height, left, top } = useDrawingArea();

  return (
    <text
      x={left + width / 2}
      y={top + height / 2}
      textAnchor="middle"
      dominantBaseline="central"
      style={{
        fontSize: width < 180 ? 12 : 14,
        fontWeight: 600,
      }}
    >
      {children}
    </text>
  );
}

type FilterType = 'Today' | '6 Days' | 'This Month';

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

const StockDonutChart = ({ title }: { title: string }) => {
  const [filter, setFilter] = useState<FilterType>('This Month');

  const methods = useForm({
    defaultValues: {
      filterSelect: 'This Month',
    },
  });

  const total = chartDataMap[filter].reduce((sum, d) => sum + d.value, 0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallMobile = useMediaQuery('(max-width:360px)');

  const chartSize = isSmallMobile ? 160 : isMobile ? 180 : 260;
  const innerRadius = isSmallMobile ? 40 : isMobile ? 45 : 70;
  const outerRadius = isSmallMobile ? 68 : isMobile ? 75 : 110;

  const handleFilterChange = (value: string) => {
    setFilter(value as FilterType);
  };

  return (
    <Card
      variant="outlined"
      sx={{
        p: { xs: 1, sm: 2 },
        overflow: 'hidden',
      }}
    >
      {/* Header with Title + Dropdown */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>

        <FormProvider {...methods}>
          <Box sx={{ width: 150 }}>
            <DropdownField
              name="filterSelect"
              options={filterOptions}
              onChangeCallback={handleFilterChange}
              
              isStatic={true}
              // sx={{
              //   height: 34,
              //   backgroundColor: '#fff',
              //   '& .MuiOutlinedInput-root': {
              //     height: 34,
              //   },
              // }}
            />
          </Box>
        </FormProvider>
      </Box>

      {/* Chart */}
      <Box display="flex" justifyContent="center" alignItems="center">
        <PieChart
          margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
          series={[
            {
              data: chartDataMap[filter],
              innerRadius,
              outerRadius,
              paddingAngle: 2,
            },
          ]}
          width={chartSize}
          height={chartSize}
        >
          <CenterLabel>{total}%</CenterLabel>
        </PieChart>
      </Box>
    </Card>
  );
};

export default StockDonutChart;

