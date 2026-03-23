

import ReportCards from '@/containers/Report/ReportCards';
import SalesGraph from '@/containers/Report/SalesGraph';
import InvoiceTable from '@/containers/Report/InvoiceTable';
import InventoryTable from '@/containers/Report/InventoryTable';
import CustomerList from '@/containers/Report/CustomersList';
import DistributorReportTable from '@/containers/Report/DistributorReportTable';
import { Box, Typography } from "@mui/material";

const ReportPage = () => {
  //settings
const DEFAULT_SETTINGS = {
  card_visibility_control: ["Total Sales Report"],
  other_visibility_control: ["Sales Report", "Invoice Report Table"],
};

const stored = localStorage.getItem("report_settings");

const settings = stored ? JSON.parse(stored) : DEFAULT_SETTINGS;

const visibleTables: string[] = settings.other_visibility_control;
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
      {visibleTables.includes("Sales Report") && <SalesGraph />}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '30px',      
        marginTop: '30px'  
      }}>
        
      {visibleTables.includes("Invoice Report Table") && <InvoiceTable />}

      {visibleTables.includes("Inventory Stock Report") && <InventoryTable />}

      {visibleTables.includes("Distributor List") && <DistributorReportTable />}

      {visibleTables.includes("Customer List") && <CustomerList />}
        
      </Box>
    </Box>
  );
};

export default ReportPage;