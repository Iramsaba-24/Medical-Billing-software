import ReportCards from '@/containers/Report/ReportCards';
import SalesGraph from '@/containers/Report/SalesGraph';
import InvoiceTable from '@/containers/Report/InvoiceTable';
import InventoryTable from '@/containers/Report/InventoryTable';
import CustomerList from '@/containers/Report/CustomersList';
import DistributorReportTable from '@/containers/Report/DistributorReportTable';

const ReportPage = () => {
  return (
   
    <div className="container"  >
      
      <h2 style={{ marginTop: '-20px' }}>Reports</h2>
      <ReportCards />
      <SalesGraph />
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '30px',      
        marginTop: '30px'  
      }}>
        
        <InvoiceTable />
        <InventoryTable />
        <DistributorReportTable />
        <CustomerList />
        
      </div>
    </div>
  );
};

export default ReportPage;