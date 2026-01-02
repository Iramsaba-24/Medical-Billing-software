import { Grid, Box } from '@mui/material';
import ReusableTable, { type TableColumn } from '@/components/uncontrolled/ReusableTable';
import StockDonutChart from '@/components/controlled/chart/StockDonutChart';

type AccountOverviewRow = {
  ledger: string;
  count: number;
  amount: number;
};

const tableData: AccountOverviewRow[] = [
  { ledger: 'Sales Ledger', count: 120, amount: 3523054 },
  { ledger: 'Purchase Ledger', count: 80, amount: 400000 },
  { ledger: 'Expense Ledger', count: 45, amount: 1094 },
  { ledger: 'Return Ledger', count: 12, amount: 25000 },
];

const columns: TableColumn<AccountOverviewRow>[] = [
  { key: 'ledger', label: 'Ledger' },
  { key: 'count', label: 'Count' },
  {
    key: 'amount',
    label: 'Amount (₹)',
    render: (row) => row.amount.toLocaleString('en-IN'),
  },
];

const stockDonutData = [
  {
    label: 'Dump Stock',
    value: 40,
    color: '#1976d2', 
  },
  {
    label: 'Inventory Stock',
    value: 45,
    color: '#ed6c02', 
  },
  {
    label: 'No Stock',
    value: 15,
    color: '#2e7d32', 
  },
];

const AccountOverviewSection = () => {
  return (
    <Box>
      <Grid container spacing={3}>
        {/* Account Overview Table */}
        <Grid size={{ xs: 12, md: 8 }}>
          <ReusableTable<AccountOverviewRow>
            caption="Account Overview"
            captionSx={{background:'#238878'}}
            data={tableData}
            columns={columns}
            showSearch={false}
            showExport={false}
            tableSize="medium"
          />
        </Grid>

        {/* Stock Donut Chart */}
        <Grid size={{ xs: 12, md: 4 }}>
          <StockDonutChart
            title="Stock Value"
            data={stockDonutData}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AccountOverviewSection;
