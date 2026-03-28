import ReportCards from '@/containers/Report/ReportCards';
import SalesGraph from '@/containers/Report/SalesGraph';
import InvoiceTable from '@/containers/Report/InvoiceTable';
import InventoryTable from '@/containers/Report/InventoryTable';
import CustomerList from '@/containers/Report/CustomersList';
import DistributorReportTable from '@/containers/Report/DistributorReportTable';
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