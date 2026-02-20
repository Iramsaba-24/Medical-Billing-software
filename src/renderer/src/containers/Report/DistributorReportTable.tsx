

import { useState, useMemo, useEffect } from "react";
import { Typography, Stack, Paper, Divider } from "@mui/material";
import { UniversalTable } from "@/components/uncontrolled/UniversalTable";

import { useForm, FormProvider } from "react-hook-form"; 
import DropdownField from "@/components/controlled/DropdownField"; 

//  TYPES 
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

//  Form type for react-hook-form
type FilterForm = {
  statusFilter: string;
  timeFilter: string;
};

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "contact", label: "Contact" },
  { key: "lastPurchaseDate", label: "Last Purchase Date" },
  { key: "status", label: "Status" },
];

function DistributorReportTable() {

  const [distributorData, setDistributorData] = useState<DistributorRow[]>([]);

  //  REPLACED useState filters with react-hook-form
  const methods = useForm<FilterForm>({
    defaultValues: {
      statusFilter: "All",
      timeFilter: "All Time",
    },
  });

  const { watch } = methods;

  //  Watch dropdown values
  const statusFilter = watch("statusFilter");
  const timeFilter = watch("timeFilter");

  //  LOAD FROM LOCALSTORAGE 
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

  //  DROPDOWN OPTIONS 

  // Added options for status
  const statusOptions = [
    { label: "All Status", value: "All" },
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ];

  // Added options for time
  const timeOptions = [
    { label: "All Time", value: "All Time" },
    { label: "This Month", value: "This Month" },
    { label: "Last 30 Days", value: "Last 30 Days" },
  ];

  return (
    // REQUIRED for DropdownField to work
    <FormProvider {...methods}>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          Distributors List
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/*  REPLACED Select components with DropdownField */}
        <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mb: 2 }}>

          {/* Status Dropdown */}
          <DropdownField
            name="statusFilter"      // must match form field
            label="Status"
            options={statusOptions}
            //isStatic                 
            freeSolo={false}
            //floatLabel
            
          />

          {/* Time Dropdown */}

          <DropdownField
            name="timeFilter"        
            label="Time Filter"
            options={timeOptions}
            //isStatic
            freeSolo={false}
           // floatLabel
           
          />

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
    </FormProvider>
  );
}

export default DistributorReportTable;
