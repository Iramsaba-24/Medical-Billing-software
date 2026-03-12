import ReportCards from '@/containers/report/ReportCards';
import SalesGraph from '@/containers/report/SalesGraph';
import InvoiceTable from '@/containers/report/InvoiceTable';
import InventoryTable from '@/containers/report/InventoryTable';
import CustomerList from '@/containers/report/CustomersList';
import DistributorReportTable from '@/containers/report/DistributorReportTable';
import { Box, Typography } from "@mui/material";

const ReportPage = () => {
  return (
   
    <Box className="container"  >
      
      <Box>
          <Typography
            sx={{
              fontSize: { xs: 20, sm: 24, md: 28 },
              fontWeight: 700,
              color: '#111827',
              mt: {xs:1 , md:0.5},
              mb:0.5
            }}
          >
            Reports
          </Typography>
        </Box>
      <ReportCards />
      <SalesGraph />
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '30px',      
        marginTop: '30px'  
      }}>
        
        <InvoiceTable />
        <InventoryTable />
        <DistributorReportTable />
        <CustomerList />
        
      </Box>
    </Box>
  );
};

export default ReportPage;