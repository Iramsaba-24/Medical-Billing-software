import ReportCards from '@/containers/report/ReportCards';
import SalesGraph from '@/containers/report/SalesGraph';
import InvoiceTable from '@/containers/report/InvoiceTable';
import InventoryTable from '@/containers/report/InventoryTable';
import CustomerList from '@/containers/report/CustomersList';
import DistributorReportTable from '@/containers/report/DistributorReportTable';

const ReportPage = () => {
  return (
   
    <div className="container" style={{ padding: '20px' }}>
      
      <h2 style={{ marginBottom: '20px' }}>Reports</h2>
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