import { type FC } from 'react';
import { Card, CardContent, Typography, Box, type CardProps, type SxProps, type Theme } from '@mui/material';
import { LineChart as MuiLineChart } from '@mui/x-charts/LineChart';

export type LineChartProps = CardProps & {
  title?: string;
  TitleSx?: SxProps<Theme>;
  xLabels: string[];
  series: {
    label: string;
    data: number[];
    color?: string;
  }[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  sx?: SxProps<Theme>;
};

const defaultColors = ['#1976d2', '#90caf9'];

const LineChart: FC<LineChartProps> = ({ title, TitleSx, xLabels, series, xAxisLabel = 'X-Axis', yAxisLabel = 'Y-Axis', sx, ...rest }) => {
  return (
    <Card sx={{ borderRadius: 3, ...sx }} {...rest}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" sx={TitleSx}>
            {title}
          </Typography>
          {rest.children}
        </Box>

        <Box
          sx={{
            width: '100%',
            height: {
              xs: 260,
              sm: 320,
              md: 360
            },
            backgroundColor: 'transparent',
            boxShadow: 'none',
            borderRadius: 0
          }}
        >
          <MuiLineChart
            series={series.map((s, index) => ({
              label: s.label,
              data: s.data,
              color: s.color || defaultColors[index % defaultColors.length]
            }))}
            xAxis={[
              {
                data: xLabels,
                scaleType: 'point',
                label: xAxisLabel
              }
            ]}
            yAxis={[{ label: yAxisLabel }]}
            margin={{
              bottom: 70,
              left: 2
            }}
            sx={{
              width: '100%',
              height: '100%'
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default LineChart;
