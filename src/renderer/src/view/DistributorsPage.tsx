 
import { Box } from "@mui/material";
import DistributorCards from "@/containers/distributors/DistributorsCard";
import DistributorsTable from "@/containers/distributors/DistributorTable";
import { useState, useEffect } from "react";
import { getAllInvoices } from "@/service/distributorInvoiceService";
import { getDistributors } from "@/service/distributorService";
 
 
function DistributorsPage() {
  const [count, setCount] = useState(0);
 
  useEffect(() => {
    const storedData = localStorage.getItem("distributors");
    if (storedData) {
      const data = JSON.parse(storedData);
      setCount(data.length);
    }
  }, []);
 
  const [totalPurchase, setTotalPurchase] = useState(0);
 
  const fetchDistributorCount = async () => {
  try {
    const response = await getDistributors();
    setCount(response.length);
  } catch (err) {
    console.error("Failed to fetch distributors", err);
  }
};
 
const fetchTotalPurchase = async () => {
  try {
    const invoices = await getAllInvoices();
    const total = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    setTotalPurchase(total);
  } catch (err) {
    console.error("Failed to fetch invoices", err);
  }
};
 
useEffect(() => {
  fetchDistributorCount();
  fetchTotalPurchase();
}, []);
 
  return (
    <Box>
      <DistributorCards totalCount={count} totalPurchase={totalPurchase} />
   
 
      <DistributorsTable />
    </Box>
  );
}
 
export default DistributorsPage;
 
 