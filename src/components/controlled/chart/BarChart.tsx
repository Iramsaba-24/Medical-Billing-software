import { type FC } from 'react';
import { Card, CardContent, Typography, type CardProps, type SxProps, type Theme } from '@mui/material';
import { BarChart as MuiBarChart } from '@mui/x-charts/BarChart';

type BarSeries = {
  label: string;
  data: number[];
  color?: string;
};

type BarChartProps = CardProps & {
  title: string;
  xLabels: string[];
  data: number[] | BarSeries[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  TitleSx?: SxProps<Theme>;
  chartSx?: SxProps<Theme>;
};

const defaultColors = ['#1976d2', '#90caf9'];

const BarChart: FC<BarChartProps> = ({ title, xLabels, data, xAxisLabel = 'X-Axis', yAxisLabel = 'Y-Axis', TitleSx, chartSx, ...rest }) => {
  const isMulti = Array.isArray(data) && typeof data[0] === 'object' && 'label' in data[0];

  const series: BarSeries[] = isMulti
    ? (data as BarSeries[]).map((s, i) => ({
        label: s.label,
        data: s.data,
        color: s.color ?? defaultColors[i % defaultColors.length]
      }))
    : [
        {
          label: title,
          data: data as number[],
          color: defaultColors[0]
        }
      ];

  return (
    <Card sx={{ borderRadius: 3 }} {...rest}>
      <CardContent>
        <Typography sx={TitleSx} gutterBottom>
          {title}
        </Typography>
        <MuiBarChart
          series={series}
          xAxis={[{ data: xLabels, scaleType: 'band', label: xAxisLabel }]}
          yAxis={[{ label: yAxisLabel }]}
          margin={{ bottom: 70, left: 2 }}
          sx={{
            width: '100%',
            height: { xs: 260, sm: 320, md: 360 },
            ...chartSx
          }}
        />
      </CardContent>
    </Card>
  );
};

export default BarChart;
