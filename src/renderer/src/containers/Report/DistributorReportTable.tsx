import { useState, useMemo, useEffect } from "react";
import { Typography, Stack, Paper, Divider } from "@mui/material";
import { UniversalTable } from "@/components/uncontrolled/UniversalTable";
import { useForm, FormProvider } from "react-hook-form";
import DropdownField from "@/components/controlled/DropdownField";
import {
  getDistributors,
  DistributorResponse,
} from "@/service/distributorService";

type DistributorRow = {
  id: string; 
  companyName: string;
  email: string;
  phone: string;
  createdAt: string;
  status: "Active" | "Inactive";
  purchaseAmount?: number;
};

type FilterForm = {
  statusFilter: string;
  timeFilter: string;
};

const columns = [
  {
    key: "srNo",
    label: "Sr No.",
    render: (row: DistributorRow) => Number(row.id), 
  },
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

  useEffect(() => {
    const fetchDistributors = async () => {
      try {
        const response: DistributorResponse[] = await getDistributors();

        const formattedData: DistributorRow[] = response.map((item) => ({
          id: item.distributorId.toString(), 
          companyName: item.companyName || "",
          email: item.email || "",
          phone: item.phone || "",
          createdAt: item.createdDate
            ? new Date(item.createdDate).toISOString()
            : "",
          status: item.isActive ? "Active" : "Inactive", 
        }));

        setDistributorData(formattedData);
      } catch (error) {
        console.error("Failed to fetch distributors", error);
        setDistributorData([]);
      }
    };

    fetchDistributors();

    const handleFocus = () => {
      fetchDistributors();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

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
        matchesTime = purchaseDate >= thirtyDaysAgo && purchaseDate <= today;
      }

      return matchesStatus && matchesTime;
    });
  }, [statusFilter, timeFilter, distributorData]);

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

        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={2}
          sx={{ mb: 2 }}
        >
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
            getRowId={(row) => row.id} 
          />
        </div>
      </Paper>
    </FormProvider>
  );
}

export default DistributorReportTable;