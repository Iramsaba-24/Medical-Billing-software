


// import { Box } from "@mui/material";
// import DistributorCards from "@/containers/distributors/DistributorsCard";
// import DistributorsTable from "@/containers/distributors/DistributorTable";
// import { useState, useEffect } from "react";
// import { getAllInvoices } from "@/service/distributorInvoiceService";
// import { getDistributors } from "@/service/distributorService";


// function DistributorsPage() {
//   const [count, setCount] = useState(0);
 
//   useEffect(() => {
//     const storedData = localStorage.getItem("distributors");
//     if (storedData) {
//       const data = JSON.parse(storedData);
//       setCount(data.length);
//     }
//   }, []);

//   const [totalPurchase, setTotalPurchase] = useState(0);

//   const fetchDistributorCount = async () => {
//   try {
//     const response = await getDistributors();
//     setCount(response.length);
//   } catch (err) {
//     console.error("Failed to fetch distributors", err);
//   }
// };
// const fetchTotalPurchase = async () => {
//   try {
//     const invoices = await getAllInvoices();
//     const total = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
//     setTotalPurchase(total);
//   } catch (err) {
//     console.error("Failed to fetch invoices", err);
//   }
// };
// useEffect(() => {
//   fetchDistributorCount();
//   fetchTotalPurchase();
// }, []);

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

import { getDistributors } from "@/service/distributorService";
import axios from "axios";
import { API_ENDPOINTS } from "@/constants/ApiEndpoints";

type MedicinePurchaseApi = {
  totalStockTablets: number;
  mrpPerTablet: number;
};


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
    const token = localStorage.getItem("token");

    const response = await axios.get<{ data: MedicinePurchaseApi[] }>(
      API_ENDPOINTS.MEDICINE,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );

    const medicines = response.data.data || [];

    const total = medicines.reduce(
      (sum, item) =>
        sum + item.totalStockTablets * item.mrpPerTablet,
      0
    );

    setTotalPurchase(total);
  } catch (error) {
    console.error("Error fetching total purchase:", error);
  }
};

// const fetchTotalPurchase = async () => {
//   try {
//     const invoices = await getAllInvoices();
//     const total = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
//     setTotalPurchase(total);
//   } catch (err) {
//     console.error("Failed to fetch invoices", err);
//   }
// };
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





