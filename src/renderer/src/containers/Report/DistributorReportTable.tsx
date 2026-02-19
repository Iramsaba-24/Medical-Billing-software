import { useState, useMemo, useEffect } from "react";
import { Typography, MenuItem, Select, FormControl, Stack, Paper, Divider } from "@mui/material";
import { Column, UniversalTable } from "@/components/uncontrolled/UniversalTable";


type DistributorRow = {
  name: string;
  email: string;
  contact: string;
  lastPurchaseDate: string;
  status: "Active" | "Inactive";
};


type DistributorStorage = {
  companyName: string;
  email: string;
  mobile: string;
  date: string;
  status?: "Active" | "Inactive";
};

const columns: Column<DistributorRow>[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "contact", label: "Contact" },
  { key: "lastPurchaseDate", label: "Last Purchase Date" },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <Typography
        sx={{
          fontWeight: 600,
          color: row.status === "Active" ? "success.main" : "error.main",
        }}
      >
        {row.status}
      </Typography>
    ),
  },
];



function DistributorReportTable() {

  const [statusFilter, setStatusFilter] = useState("All");
  const [timeFilter, setTimeFilter] = useState("All");
  const [distributorData, setDistributorData] = useState<DistributorRow[]>([]);

  
  useEffect(() => {
    const stored = localStorage.getItem("distributors");

    const parsed: DistributorStorage[] = stored
      ? JSON.parse(stored)
      : [];

    const formattedData: DistributorRow[] = parsed.map((item) => ({
      name: item.companyName,
      email: item.email,
      contact: item.mobile,
      lastPurchaseDate: item.date,
      status: item.status ?? "Active",
    }));

    setDistributorData(formattedData);
  }, []);

  
  const filteredData = useMemo(() => {
    return distributorData.filter((distributor) => {

      const matchesStatus =
        statusFilter === "All" || distributor.status === statusFilter;

      const purchaseDate = new Date(distributor.lastPurchaseDate);
      const today = new Date();
      let matchesTime = true;

      if (timeFilter === "This Month") {
        matchesTime =
          purchaseDate.getMonth() === today.getMonth() &&
          purchaseDate.getFullYear() === today.getFullYear();
      } else if (timeFilter === "Last 30 Days") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        matchesTime =
          purchaseDate >= thirtyDaysAgo && purchaseDate <= today;
      }

      return matchesStatus && matchesTime;
    });
  }, [statusFilter, timeFilter, distributorData]);

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
        Distributors List
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mb: 2 }}>
        <FormControl size="small">
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} sx={{ minWidth: 130, borderRadius: "8px" }}>
            <MenuItem value="All">All Status</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small">
          <Select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} sx={{ minWidth: 140, borderRadius: "8px" }}>
            <MenuItem value="All Time">All Time</MenuItem>
            <MenuItem value="This Month">This Month</MenuItem>
            <MenuItem value="Last 30 Days">Last 30 Days</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <UniversalTable<DistributorRow>
        data={filteredData}
        showSearch={true}
        showExport={true}
        columns={columns}
        enableCheckbox={true}
        getRowId={(row) => `${row.name}-${row.lastPurchaseDate}`}
        
      />
    </Paper>
  );
}

export default DistributorReportTable;
