import AccountOverviewSection from '@/containers/dashboard/AccountOverview';
import StockAndOutstandingSection from '@/containers/dashboard/Overview';
import {
  Assessment,
  ShoppingCart,
  Replay,
  MoneyOff,
} from '@mui/icons-material';
import { Typography, Grid, Paper, Box } from '@mui/material';

const StatCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}) => (
  <Paper
    sx={{
      p: 2,
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      height: 100,
    }}
  >
    <Box
      sx={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        backgroundColor: `${color}.light`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {icon}
    </Box>

    <Box>
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h6" fontWeight={600}>
        {value}
      </Typography>
    </Box>
  </Paper>
);

const DashboardPage = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard
            title="Total Sales"
            value="₹3,523,054"
            icon={<Assessment sx={{ color: 'primary.main', fontSize: 28 }} />}
            color="primary"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard
            title="Total Purchases"
            value="₹4,00,000"
            icon={<ShoppingCart sx={{ color: 'success.main', fontSize: 28 }} />}
            color="success"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard
            title="Sales Returns"
            value="400"
            icon={<Replay sx={{ color: 'warning.main', fontSize: 28 }} />}
            color="warning"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard
            title="Expenses"
            value="₹1,094"
            icon={<MoneyOff sx={{ color: 'error.main', fontSize: 28 }} />}
            color="error"
          />
        </Grid>
      </Grid>
      <Grid spacing={1} margin={2}><AccountOverviewSection /></Grid> 
      <Grid spacing={1} margin={2}><StockAndOutstandingSection /></Grid>
    </Box>
  );
};

export default DashboardPage;
