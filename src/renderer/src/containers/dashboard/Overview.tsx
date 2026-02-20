import { Grid, Box } from '@mui/material';
import ReusableTable, { type TableColumn, type FooterRow } from '@/components/uncontrolled/ReusableTable';


  //  STOCK OVERVIEW TABLE


type StockOverviewRow = {
  stock: string;
  nos: number;
  amount: number;
};

const stockData: StockOverviewRow[] = [
  { stock: 'Dump Stock', nos: 4, amount: -1094 },
];

const stockColumns: TableColumn<StockOverviewRow>[] = [
  { key: 'stock', label: 'Stock' },
  { key: 'nos', label: 'NOS' },
  {
    key: 'amount',
    label: 'Amount',
    render: (row) => row.amount.toLocaleString('en-IN'),
  },
];

const stockFooter: FooterRow[] = [
  {
    content: [
      { value: <b>Totals</b> },
      { value: <b>BILL</b>, sx: { textAlign: 'center' } },
      { value: <b>AMT</b>, sx: { textAlign: 'right' } },
    ],
    sx: { backgroundColor: '#F2F2F2' },
  },
];


  //  OUTSTANDING BILLS TABLE


type OutstandingRow = {
  period: string;
  debtors: number;
  creditors: number;
};

const outstandingData: OutstandingRow[] = [
  { period: '1-30', debtors: 0, creditors: 0 },
  { period: '31-60', debtors: 0, creditors: 0 },
  { period: '61-90', debtors: 0, creditors: 0 },
  { period: '91-120', debtors: 0, creditors: 0 },
];

const outstandingColumns: TableColumn<OutstandingRow>[] = [
  { key: 'period', label: 'Period' },
  { key: 'debtors', label: 'Debtors' },
  { key: 'creditors', label: 'Creditors' },
];

const StockAndOutstandingSection = () => {
  return (
    <Box>
      <Grid container spacing={3}>
        {/* Stock Overview */}
        <Grid size={{ xs: 12, md: 6 }}>
          <ReusableTable<StockOverviewRow>
            caption="Stock Overview"
            captionSx={{background:'#238878'}}
            data={stockData}
            columns={stockColumns}
            footerRows={stockFooter}
            showSearch={false}
            showExport={false}
            tableSize="small"
          />
        </Grid>

        {/* Outstanding Bills */}
        <Grid size={{ xs: 12, md: 6 }}>
          <ReusableTable<OutstandingRow>
            caption="Outstanding Bills"
            captionSx={{background:'#238878'}}
            data={outstandingData}
            columns={outstandingColumns}
            showSearch={false}
            showExport={false}
            tableSize="small"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default StockAndOutstandingSection;
