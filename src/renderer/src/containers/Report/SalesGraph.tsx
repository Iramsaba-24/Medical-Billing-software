import { useState } from "react";
import {Box, Typography, Paper, MenuItem, Select, Divider, Grid,} from "@mui/material";
import { AreaChart,  Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,} from "recharts";

//  Dummy data for the graph
const data = [
  { name: "1 Dec", sales: 45 },
  { name: "8 Dec", sales: 165 },
  { name: "16 Dec", sales: 60 },
  { name: "24 Dec", sales: 146 },
  { name: "31 Dec", sales: 150 },
];

const SalesGraph = () => {
  //  Local state to handle dropdown changes
  const [range, setRange] = useState("01 December 2021 - 31 December 2021");
  const [group, setGroup] = useState("");

  return (
    // Main container card for the report
    <Paper sx={{ p: 1, borderRadius: 2 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
        Sales Reports
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/*  Filter controls (Date Range and Medicine Group) */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
            Date Range
          </Typography>
          <Select
            fullWidth
            size="small"
            value={range}
            onChange={(e) => setRange(e.target.value)}
          >
            <MenuItem value="01 December 2021 - 31 December 2021">
              01 December 2021 - 31 December 2021
            </MenuItem>
          </Select>
        </Grid>

        {/* Medicine Group selection dropdown */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
            Medicine Group
          </Typography>
          <Select
            fullWidth
            size="small"
            displayEmpty
            value={group}
            onChange={(e) => setGroup(e.target.value)}
          >
            <MenuItem value="">- Select Group -</MenuItem>
            <MenuItem value="Generic">Generic Medicines</MenuItem>
            <MenuItem value="Diabetes">Diabetes</MenuItem>
            <MenuItem value="Others">Others</MenuItem>
          </Select>
        </Grid>
      </Grid>

      {/*  Chart Section */}
      <Box
        sx={{
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        {/* Graph Header */}
        <Box
          sx={{ p: 2, bgcolor: "#fafafa", borderBottom: "1px solid #e0e0e0" }}
        >
          <Typography variant="subtitle2" fontWeight="bold">
            Sales Statistics
          </Typography>
        </Box>

        {/* Graph Area */}
        <Box sx={{ p: 2, height: 350, width: "100%", minWidth: 0 }}>
          {/* ResponsiveContainer makes the chart adjust to any screen size */}
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              {/* Background grid lines  */}
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f0f0"
              />
              {/* X-Axis for Dates and Y-Axis for Sales Numbers */}
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              {/*  graph points */}
              <Tooltip />
              {/* The Blue colored area showing the sales trend */}
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#03A9F4"
                fill="#e1f5fe"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Paper>
  );
};
export default SalesGraph;
