import { useState, useMemo, useEffect } from "react";
import { Typography, Stack, Paper, Divider } from "@mui/material";
import { UniversalTable } from "@/components/uncontrolled/UniversalTable";

import { useForm, FormProvider } from "react-hook-form"; 
import DropdownField from "@/components/controlled/DropdownField"; 

// TYPES 
type DistributorRow = {
  companyName: string;
  email: string;
  phone: string;
  createdAt: string;
  status: "Active" | "Inactive";
  purchaseAmount?: number;
};

type DistributorStorage = {
  companyName: string;
  email: string;
  phone: string;
  createdAt: string;
  status?: "Active" | "Inactive";
  purchaseAmount: number;
};

type FilterForm = {
  statusFilter: string;
  timeFilter: string;
};


const columns = [
  { key: "companyName", label: "Company Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Contact" },
  { key: "createdAt", label: "Created Date" },
  {
    key: "status",
    label: "Status",
    render: (row: DistributorRow) => (
      <span
        style={{
          color: row.status === "Active" ? "green" : "red",
          fontWeight: 500,
        }}
      >
        {row.status}
      </span>
    ),
  },
];

function DistributorReportTable() {

  const [distributorData, setDistributorData] = useState<DistributorRow[]>([]);

  const methods = useForm<FilterForm>({
    defaultValues: {
      statusFilter: "All",
      timeFilter: "All Time",
    },
  });

  const { watch } = methods;
  const statusFilter = watch("statusFilter");
  const timeFilter = watch("timeFilter");

  // LOAD FROM LOCALSTORAGE
  useEffect(() => {
    const stored = localStorage.getItem("distributors");

    const parsed: DistributorStorage[] = stored
      ? JSON.parse(stored)
      : [];

    const formattedData: DistributorRow[] = parsed.map((item) => ({
      companyName: item.companyName,
      email: item.email,
      phone: item.phone,
      createdAt: item.createdAt,
      status: item.status ?? "Active",
    }));

    setDistributorData(formattedData);
  }, []);

  // FILTER LOGIC
  const filteredData = useMemo(() => {
    return distributorData.filter((distributor) => {

      const matchesStatus =
        statusFilter === "All" || distributor.status === statusFilter;

      const purchaseDate = new Date(distributor.createdAt);
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

  // DELETE SELECTED ROWS
  const handleDeleteSelected = (rowsToDelete: DistributorRow[]) => {
    const updatedData = distributorData.filter(
      (dist) =>
        !rowsToDelete.some(
          (row) =>
            row.companyName === dist.companyName &&
            row.createdAt === dist.createdAt
        )
    );

    setDistributorData(updatedData);

    // Update localStorage
    const updatedStorage = updatedData.map((item) => ({
      companyName: item.companyName,
      email: item.email,
      phone: item.phone,
      createdAt: item.createdAt,
      status: item.status,
    }));

    localStorage.setItem("distributors", JSON.stringify(updatedStorage));
    window.dispatchEvent(new Event("reportUpdated"));
  };

  const statusOptions = [
    { label: "All Status", value: "All" },
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ];

  const timeOptions = [
    { label: "All Time", value: "All Time" },
    { label: "This Month", value: "This Month" },
    { label: "Last 30 Days", value: "Last 30 Days" },
  ];

  return (
    <FormProvider {...methods}>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          Distributors List
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mb: 2 }}>

          <DropdownField
            name="statusFilter"
            label="Status"
            options={statusOptions}
            freeSolo={false}
          />

          <DropdownField
            name="timeFilter"
            label="Time Filter"
            options={timeOptions}
            freeSolo={false}
          />
        </Stack>

        <div style={{ width: "100%", maxWidth: "100%", overflowX: "auto" }}>
          <UniversalTable<DistributorRow>
            data={filteredData}
            showSearch={true}
            showExport={true}
            columns={columns}
            enableCheckbox={true}
            getRowId={(row) => `${row.companyName}-${row.createdAt}`}
            onDeleteSelected={handleDeleteSelected}
          />
        </div>
      </Paper>
    </FormProvider>
  );
}

export default DistributorReportTable;