import React from 'react';
import { Card, Box, Typography, Select, MenuItem, type SelectChangeEvent } from '@mui/material';
import { LineChart } from '@mui/x-charts';

type AreaChartCardProps = {
  title: string;
  filterOptions: string[];
  selectedFilter: string;
  onFilterChange: (value: string) => void;
  dataMap: Record<string, { year: string; value: number }[]>;
  colors?: { stroke: string; gradientFrom: string; gradientTo: string };
  cardWidth?: number | string;
  chartHeight?: number;
};

const AreaChartCard: React.FC<AreaChartCardProps> = ({
  title,
  filterOptions,
  selectedFilter,
  onFilterChange,
  dataMap,
  colors = {
    stroke: '#0d47a1',
    gradientFrom: '#42a5f5',
    gradientTo: '#bbdefb'
  },
  cardWidth = '100%',
  chartHeight = 300
}) => {
  const chartData = dataMap[selectedFilter] ?? [];

  const xAxisData = chartData.map((item) => item.year);
  const seriesData = chartData.map((item) => item.value);

  return (
    <Card variant="outlined" sx={{ p: 2, width: cardWidth }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>

        <Select
          value={selectedFilter}
          onChange={(e: SelectChangeEvent) => onFilterChange(e.target.value)}
          size="small"
          variant="outlined"
          sx={{ minWidth: 100 }}
        >
          {filterOptions.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box
        sx={{
          position: 'relative',
          height: chartHeight,
          background: `linear-gradient(to top, ${colors.gradientFrom}, ${colors.gradientTo})`,
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <LineChart
          xAxis={[{ data: xAxisData, scaleType: 'band' }]}
          series={[
            {
              data: seriesData,
              area: true,
              color: colors.stroke,
              showMark: false
            }
          ]}
          height={chartHeight}
          sx={{
            background: 'transparent',
            '& .MuiAreaElement-area': {
              fill: colors.gradientFrom,
              fillOpacity: 0.4
            },
            '& .MuiLineElement-line': {
              stroke: colors.stroke,
              strokeWidth: 2
            }
          }}
        />
      </Box>
    </Card>
  );
};

export default AreaChartCard;
