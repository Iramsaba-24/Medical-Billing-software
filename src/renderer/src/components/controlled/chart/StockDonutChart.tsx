import { Card, Typography, Box } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';

function CenterLabel({ children }: { children: React.ReactNode }) {
  const { width, height, left, top } = useDrawingArea();

  return (
    <text
      x={left + width / 2}
      y={top + height / 2}
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontSize: 16, fontWeight: 600 }}
    >
      {children}
    </text>
  );
}

type StockDonutChartProps = {
  title: string;
  data: {
    label: string;
    value: number;
    color: string;
  }[];
};

const StockDonutChart = ({ title, data }: StockDonutChartProps) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <Typography variant="h6" fontWeight={600} mb={1}>
        {title}
      </Typography>

      <Box display="flex" justifyContent="center">
        <PieChart
          series={[
            {
              data,
              innerRadius: 70,
              outerRadius: 110,
              paddingAngle: 2,
            },
          ]}
          width={260}
          height={260}
        >
          <CenterLabel>{total}%</CenterLabel>
        </PieChart>
      </Box>
    </Card>
  );
};

export default StockDonutChart;
