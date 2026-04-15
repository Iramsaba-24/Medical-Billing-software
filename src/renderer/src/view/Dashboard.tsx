import { Box } from "@mui/material";
import React from "react";
import StatCard from "@/containers/dashboard/StatCard";
import StockDonutChart from "@/components/controlled/chart/StockDonutChart";
import BarChart from "@/containers/dashboard/Barchart";
import SalesTable from "@/containers/dashboard/SalesTable";
import Cards from "@/containers/dashboard/Cards";
import Alerts from "@/containers/dashboard/Alerts";
import LineGraph from "@/containers/dashboard/LineGraph";

const Dashboard: React.FC = () => {
  const getChartPreferences = (): string[] => {
    const data = localStorage.getItem("chartPreferences");
    if (!data) return ["bar", "line", "donut"];

    try {
      return JSON.parse(data);
    } catch {
      return ["bar"];
    }
  };

  const chartPreferences = getChartPreferences();

  // visibility flags
  const showLine = chartPreferences.includes("line");
  const showDonut = chartPreferences.includes("donut");
  const showBar = chartPreferences.includes("bar");

  // count visible top charts
  const chartCount = (showDonut ? 1 : 0) + (showBar ? 1 : 0);

  const useExpandedDonutLayout = showDonut && !showBar;

  return (
    <Box sx={{ minHeight: "100vh" }}>
      {/* Top Stats */}
      <Box sx={{ mb: { xs: 2, md: 3 } }}>
        <StatCard />
      </Box>

      <Alerts />

      {/* DONUT + BAR GRID */}
      {(showDonut || showBar) && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns:
              chartCount === 2
                ? { xs: "1fr", md: "1fr 1fr" }
                : { xs: "1fr", md: "1fr" },
            gap: { xs: 2, md: 3 },
            mb: 3,
          }}
        >
          {showDonut && (
            <Box sx={{ width: "100%" }}>
              <StockDonutChart
                title="Graph Report"
                isOnlyDonutSelected={useExpandedDonutLayout}
              />
            </Box>
          )}

          {showBar && (
            <Box sx={{ width: "100%" }}>
              <BarChart />
            </Box>
          )}
        </Box>
      )}

      {/* CARDS + LINE CHART GRID */}
      <Box
        sx={{
          display: "grid",
          gridTemplateAreas: showLine
            ? {
                xs: `
                  "inventory"
                  "top"
                  "daily"
                `,
                md: `
                  "inventory daily"
                  "top daily"
                `,
              }
            : {
                xs: `
                  "inventory"
                  "top"
                `,
                md: `
                  "inventory"
                  "top"
                `,
              },
          gridTemplateColumns: showLine
            ? { xs: "1fr", md: "1fr 1fr" }
            : { xs: "1fr", md: "1fr" },
          gap: 2,
          mb: 3,
        }}
      >
        <Cards />
        {showLine && <LineGraph />}
      </Box>

      {/* Table */}
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <SalesTable />
      </Box>
    </Box>
  );
};

export default Dashboard;
