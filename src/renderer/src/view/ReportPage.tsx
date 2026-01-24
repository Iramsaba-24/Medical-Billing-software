import ReportCards from '@/containers/Report/ReportCards';
import SalesGraph from '@/containers/Report/SalesGraph';
import InvoiceTable from '@/containers/Report/InvoiceTable';
import DistributorsTable from '@/containers/Distributors/DistributorsTable';
import InventoryTable from '@/containers/Report/InventoryTable';
import CustomerList from '@/containers/Report/CustomersList';

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
        <DistributorsTable />
        <CustomerList />
        
      </div>
    </div>
  );
};

export default ReportPage;