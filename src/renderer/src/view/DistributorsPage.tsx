// import { Box } from "@mui/material";
// import DistributorCards from "@/containers/distributors/DistributorsCard";
// import DistributorsTable from "@/containers/distributors/DistributorTable";
// import { useState, useEffect } from "react";

// function DistributorsPage() {
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     const storedData = localStorage.getItem("distributors");
//     if (storedData) {
//       const data = JSON.parse(storedData);
//       setCount(data.length);
//     }
//   }, []);
//   type InvoiceItem = {
//     id: number;
//     total: number;
//   };

//   const [totalPurchase, setTotalPurchase] = useState(0);

//   useEffect(() => {
//     const storedData = localStorage.getItem("distributors");
//     if (storedData) {
//       const data = JSON.parse(storedData);
//       setCount(data.length);
//     }

//     const storedInvoices = localStorage.getItem("currentRetailInvoice");

//     let invoices: InvoiceItem[] = [];

//     if (storedInvoices) {
//       const parsed = JSON.parse(storedInvoices);

//       invoices = Array.isArray(parsed) ? parsed : [parsed];
//     }

//     const grandTotal = invoices.reduce(
//       (sum, item) => sum + (item.total || 0),
//       0,
//     );

//     setTotalPurchase(grandTotal);
//   }, []);

//   return (
//     <Box>
//       <DistributorCards totalCount={count} totalPurchase={totalPurchase} />
    

//       <DistributorsTable />
//     </Box>
//   );
// }

// export default DistributorsPage;



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




// import { Box } from "@mui/material";
// import DistributorCards from "@/containers/distributors/DistributorsCard";
// import DistributorsTable from "@/containers/distributors/DistributorTable";
// import { useState, useEffect } from "react";

// import { getDistributors } from "@/service/distributorService";
// import { getAllInvoices } from "@/service/distributorInvoiceService";

// function DistributorsPage() {
//   const [count, setCount] = useState(0);
//   const [totalPurchase, setTotalPurchase] = useState(0);

//   const fetchDistributorCount = async () => {
//     try {
//       const response = await getDistributors();
//       setCount(response.length);
//     } catch (err) {
//       console.error("Failed to fetch distributors", err);
//     }
//   };

//   const fetchTotalPurchase = async () => {
//     try {
//       const invoices = await getAllInvoices();
//       const total = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
//       setTotalPurchase(total);
//     } catch (err) {
//       console.error("Failed to fetch invoices", err);
//     }
//   };

//   useEffect(() => {
//     fetchDistributorCount();
//     fetchTotalPurchase();
//   }, []);

//   return (
//     <Box>
//       <DistributorCards totalCount={count} totalPurchase={totalPurchase} />
//       <DistributorsTable />
//     </Box>
//   );
// }

// export default DistributorsPage;
