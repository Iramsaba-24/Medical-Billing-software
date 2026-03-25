
import { useState, useMemo, useEffect } from "react";
import { Typography, Stack, Paper, Divider } from "@mui/material";
import { UniversalTable } from "@/components/uncontrolled/UniversalTable";

import { useForm, FormProvider } from "react-hook-form"; 
import DropdownField from "@/components/controlled/DropdownField"; 

// TYPES 
type DistributorRow = {
  name: string;
  email: string;
  contact: string;
  lastPurchaseDate: string;
  status: "Active" | "Inactive";
   purchaseAmount?: number; // optional for old data safety
};

type DistributorStorage = {
  companyName: string;
  email: string;
  mobile: string;
  date: string;
  status?: "Active" | "Inactive";
  purchaseAmount: number;
};

type FilterForm = {
  statusFilter: string;
  timeFilter: string;
};


const columns = [
  { key: "name", label: "Company Name" },
  { key: "email", label: "Email" },
  { key: "contact", label: "Contact" },
  { key: "lastPurchaseDate", label: "Last Purchase Date" },
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
      name: item.companyName,
      email: item.email,
      contact: item.mobile,
      lastPurchaseDate: item.date,
      status: item.status ?? "Active",
    }));

    setDistributorData(formattedData);
  }, []);

  // FILTER LOGIC
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

  //  DELETE SELECTED ROWS FUNCTION ADDED
  const handleDeleteSelected = (rowsToDelete: DistributorRow[]) => {
    const updatedData = distributorData.filter(
      (dist) =>
        !rowsToDelete.some(
          (row) =>
            row.name === dist.name &&
            row.lastPurchaseDate === dist.lastPurchaseDate
        )
    );

    setDistributorData(updatedData);

    //  Update localStorage
    const updatedStorage = updatedData.map((item) => ({
      companyName: item.name,
      email: item.email,
      mobile: item.contact,
      date: item.lastPurchaseDate,
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
          getRowId={(row) => `${row.name}-${row.lastPurchaseDate}`}
          
          //  DELETE 
          onDeleteSelected={handleDeleteSelected}
        />
        </div>
      </Paper>
    </FormProvider>
  );
}

export default DistributorReportTable;



