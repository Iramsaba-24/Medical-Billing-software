import React from 'react';
import { Card, Box, Typography, Select, MenuItem, type SelectChangeEvent } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';

function PieCenterLabel({ children }: { children: React.ReactNode }) {
  const { width, height, left, top } = useDrawingArea();

  return (
    <text
      x={left + width / 2}
      y={top + height / 2}
      fill="#000"
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontSize: 24, fontWeight: 'bold' }}
    >
      {children}
    </text>
  );
}

const PieChartCard: React.FC<{
  title: string;
  filterLabel?: string;
  filterOptions: string[];
  selectedFilter: string;
  onFilterChange: (value: string) => void;
  dataMap: Record<string, number>;
  colors?: [string, string];
  chartSize?: { width: number; height: number };
  cardWidth?: number | string;
  centerLabel?: string | ((percentage: number) => string);
}> = ({
  title,
  filterOptions,
  selectedFilter,
  onFilterChange,
  dataMap,
  colors = ['#2196f3', '#f44336'],
  chartSize = { width: 260, height: 260 },
  cardWidth = 320,
  centerLabel
}) => {
  const percentage = dataMap[selectedFilter] ?? 0;

  const chartData = [
    { value: percentage, label: 'Collected', color: colors[0] },
    { value: 100 - percentage, label: 'Remaining', color: colors[1] }
  ];

  return (
    <Card variant="outlined" sx={{ p: 2, width: cardWidth || '100%' }}>
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

      <PieChart series={[{ data: chartData, innerRadius: 70 }]} width={chartSize.width} height={chartSize.height}>
        <PieCenterLabel>{typeof centerLabel === 'function' ? centerLabel(percentage) : centerLabel || `${percentage}%`}</PieCenterLabel>
      </PieChart>
    </Card>
  );
};

export default PieChartCard;
