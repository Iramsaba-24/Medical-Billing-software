// import { Box } from "@mui/material";
// import React from "react";
// import StatCard from "@/containers/dashboard/StatCard";
// import StockDonutChart from "@/components/controlled/chart/StockDonutChart";
// import BarChart from "@/containers/dashboard/Barchart";
// import SalesTable from "@/containers/dashboard/SalesTable";
// import Cards from "@/containers/dashboard/Cards";
// import Alerts from "@/containers/dashboard/Alerts";

// const Dashboard: React.FC = () => {

//   return (
//     <Box sx={{ minHeight: "100vh" }}>

//       <Box sx={{ mb: { xs: 2, md: 3 } }}>
//         <StatCard />
//       </Box>

//       <Alerts />

//       <Box
//         sx={{
//           display: "grid",
//           gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
//           gap: { xs: 2, md: 3 },
//           mb: 3,
//         }}
//       >
//         <Box sx={{ width: "100%" }}>
//           <StockDonutChart title="Graph Report" />
//         </Box>

//         <Box sx={{ width: "100%" }}>
//           <BarChart />
//         </Box>
//       </Box>

//       <Box sx={{ mb: 3 }}>
//         <Cards />
//       </Box>

//       <Box sx={{ width: "100%", overflowX: "auto" }}>
//         <SalesTable />
//       </Box>

//     </Box>
//   );
// };

// export default Dashboard;





import { Box } from "@mui/material";
import React from "react";
import StatCard from "@/containers/dashboard/StatCard";
import StockDonutChart from "@/components/controlled/chart/StockDonutChart";
import BarChart from "@/containers/dashboard/Barchart";
import SalesTable from "@/containers/dashboard/SalesTable";
import Cards from "@/containers/dashboard/Cards";
import Alerts from "@/containers/dashboard/Alerts";

const Dashboard: React.FC = () => {



  

const getChartPreferences = (): string[] => {
  const data = localStorage.getItem("chartPreferences");

  if (!data) return ["bar"]; // default

  try {
    return JSON.parse(data);
  } catch {
    return ["bar"];
  }
};

const chartPreferences = getChartPreferences();

  return (
    <Box sx={{ minHeight: "100vh" }}>

      <Box sx={{ mb: { xs: 2, md: 3 } }}>
        <StatCard />
      </Box>

      <Alerts />

      {/* <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: { xs: 2, md: 3 },
          mb: 3,
        }}
      >
        <Box sx={{ width: "100%" }}>
          <StockDonutChart title="Graph Report" />
        </Box>

        <Box sx={{ width: "100%" }}>
          <BarChart />
        </Box>
      </Box> */}

      {(chartPreferences.includes("bar") ||
  chartPreferences.includes("line") ||
  chartPreferences.includes("donut")) && (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
      gap: { xs: 2, md: 3 },
      mb: 3,
    }}
  >
    {/* Donut Chart */}
    {chartPreferences.includes("donut") && (
      <Box sx={{ width: "100%" }}>
        <StockDonutChart title="Graph Report" />
      </Box>
    )}

    {/* Bar Chart */}
    {chartPreferences.includes("bar") && (
      <Box sx={{ width: "100%" }}>
        <BarChart />
      </Box>
    )}

    
  </Box>
  
)}

{/* Line */}
    {chartPreferences.includes("line") && (
      <Box sx={{ width: "100%" }}>
    
        <Cards />
      </Box>
    )}
{/* 
      <Box sx={{ mb: 3 }}>
        <Cards />
      </Box> */}

      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <SalesTable />
      </Box>

    </Box>
  );
};

export default Dashboard;

