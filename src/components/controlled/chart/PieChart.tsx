import { type FC } from 'react';
import { Card, CardContent, Typography, Box, type CardProps, type SxProps, type Theme } from '@mui/material';
import { PieChart as MuiPieChart, type PieChartProps as MuiPieChartProps } from '@mui/x-charts/PieChart';

type PieChartItem = {
  id: number | string;
  value: number;
  label?: string;
  color?: string;
};

type Props = Omit<CardProps, 'title'> & {
  title: string;
  data: PieChartItem[];
  chartProps?: Partial<MuiPieChartProps>;
  sx?: SxProps<Theme>;
};

const PieChart: FC<Props> = ({ title, data, chartProps, sx, ...rest }) => (
  <Card sx={{ borderRadius: 3, ...sx }} {...rest}>
    <CardContent>
      <Typography fontWeight="bold" mb={2}>
        {title}
      </Typography>
      <Box width="100%" sx={{ overflowX: 'auto' }}>
        <MuiPieChart series={[{ data }]} width={300} height={300} {...chartProps} />
      </Box>
    </CardContent>
  </Card>
);

export default PieChart;
