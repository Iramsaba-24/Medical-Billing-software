import SearchField from "@/components/controlled/SearchField";
import { ACTION_KEY, Column, UniversalTable } from "@/components/uncontrolled/UniversalTable";
import { URL_PATH } from "@/constants/UrlPath";
import { Box, Typography, Paper, MenuItem, Button, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";


type Distributor = {
  id: string;
  companyName: string;
  mobile: string;
  email: string;
  date: string;
  registrationNumber: string;
  address: string;
  status: "Active" | "Inactive";
};

const Distributors = () => {
  const methods = useForm({ defaultValues: { search: "" } });
  const [distributors, setDistributors] = useState<Distributor[]>([]);

  const navigate = useNavigate();
  const searchValue = methods.watch("search");

  useEffect(() => {
    setDistributors(JSON.parse(localStorage.getItem("distributors") || "[]"));
  }, []);
  
  const handleStatusChange = (id: string, status: "Active" | "Inactive") => {
    const updated = distributors.map((d) => (d.id === id ? { ...d, status } : d));
    localStorage.setItem("distributors", JSON.stringify(updated));
    setDistributors(updated);
  };
  
  const columns: Column<Distributor>[] = [
    { key: "companyName", label: "Company Name" },
    { key: "registrationNumber", label: "Reg. No." },
    { key: "mobile", label: "Mobile" },
    { key: "email", label: "Email" },
    { key: "date", label: "Date" },
    { key: "address", label: "Address" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Select
          size="small"
          value={row.status}
          onChange={(e) =>
            handleStatusChange(row.id, e.target.value as "Active" | "Inactive")
          }
          sx={{
            minWidth: 100,
            fontSize: 13,
            fontWeight: 600,
            "& .MuiSelect-select": {
              color: row.status === "Active" ? "success.main" : "error.main",
            },
          }}
        >
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
        </Select>
      ),
    },
    { 
      key: ACTION_KEY, label: "Action"
     },
  ];

  const filteredDistributors = distributors.filter((d) =>
    d.companyName.toLowerCase().includes(searchValue.toLowerCase()) ||
    d.registrationNumber.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <FormProvider {...methods}>
        <Paper sx={{ px: { xs: 2, md: 4 }, pt: 2, pb: { xs: 2, md: 2 } }}>
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ md: "center" }}
            sx={{ gap: { xs: 2, md: 2 } }}
          >
            <SearchField
              name="search"
              label="Search"
              placeholder="Search by Company Name or Reg No."
              size="small"
              sx={{ width: { xs: "100%", md: 550 } }}
            />
            <Button
              variant="contained"
              sx={{
                textTransform: "none",
                height: 36,
                width: { xs: "100%", md: "auto" },
                bgcolor: "#238878",
                "&:hover": {
                  backgroundColor: "#fff",
                  color: "#1b7f6b",
                  border: "2px solid #1b7f6b",
                },
              }}
              onClick={() => navigate(URL_PATH.DistributorsForm)}
            >
              + Add Distributor
            </Button>
          </Box>
        </Paper>
      </FormProvider>

      <Paper sx={{ mt: 3, p: { xs: 1, md: 3 } }}>
        <Typography fontSize={{ xs: 18, md: 22 }} mb={2} fontWeight={600}>
          Distributors List
        </Typography>

        <UniversalTable
          data={filteredDistributors}
          columns={columns}
          tableSize="small"
          getRowId={(row) => row.id}
          actions={{
  view: (distributor) =>
    navigate(URL_PATH.DistributorDetails, {
      state: { distributor },
    }),
  
}}
        />
      </Paper>
    </>
  );
};

export default Distributors;