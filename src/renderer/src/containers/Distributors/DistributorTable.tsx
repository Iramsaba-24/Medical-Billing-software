import { ACTION_KEY, Column, UniversalTable } from "@/components/uncontrolled/UniversalTable";
import { URL_PATH } from "@/constants/UrlPath";
import { Typography, Paper, MenuItem, Button, Select, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { showToast, showConfirmation } from "@/components/uncontrolled/ToastMessage.tsx";
import EditDistributorForm, { Distributor } from "./EditDistributorForm";
import { getDistributors, deleteDistributor, DistributorResponse } from "@/service/distributorService";

// Helper function to format date properly
const formatDate = (dateString?: string): string => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Invalid Date";
  }
};

// Helper function to convert backend response to frontend Distributor type
const convertToDistributor = (response: DistributorResponse): Distributor => {
  return {
    id: response.distributorId.toString(),
    companyName: response.companyName,
    registrationNumber: response.registrationNumber,
    phone: response.phone,
    email: response.email,
    createdDate: response.createdDate, 
    address: response.address,
    status: "Active",
    ownerName: response.ownerName,
    website: response.website,
    gstin: response.gstin,
    bankDetails: response.bankDetails ? {
      bankName: response.bankDetails.bankName,
      accountNumber: response.bankDetails.accountNumber,
      accountHolderName: response.bankDetails.accountHolderName,
      branch: response.bankDetails.branch,
      ifscCode: response.bankDetails.ifscCode,
      upiId: response.bankDetails.upiId,
    } : undefined,
  };
};

const Distributors = () => {
  const methods = useForm({ defaultValues: { search: "" } });
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRow, setEditingRow] = useState<Distributor | null>(null);
  const navigate = useNavigate();
  const searchValue = methods.watch("search");

  useEffect(() => {
    fetchDistributors();
  }, []);

  const fetchDistributors = async () => {
    try {
      setLoading(true);
      const response = await getDistributors();
      console.log("Backend response:", response); 
      const formattedDistributors = response.map(convertToDistributor);
      console.log("Formatted distributors:", formattedDistributors); 
      setDistributors(formattedDistributors);
    } catch (error) {
      console.error("Error fetching distributors:", error);
      showToast("error", "Failed to load distributors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: "Active" | "Inactive") => {
    try {
      const updated = distributors.map((d) =>
        d.id === id ? { ...d, status } : d
      );
      setDistributors(updated);
      showToast("success", "Status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
      showToast("error", "Failed to update status.");
    }
  };

  const handleSave = async (updatedDistributor: Distributor) => {
    try {
      const updated = distributors.map((d) =>
        d.id === updatedDistributor.id ? updatedDistributor : d
      );
      setDistributors(updated);
      showToast("success", "Distributor updated successfully!");
    } catch (error) {
      console.error("Error updating distributor:", error);
      showToast("error", "Failed to update distributor.");
    }
  };

  const columns: Column<Distributor>[] = [
    { key: "companyName", label: "Company Name" },
    { key: "registrationNumber", label: "Reg. No." },
    { key: "phone", label: "Mobile" },
    { key: "email", label: "Email" },
    { 
      key: "createdDate", 
      label: "Date",
      render: (row) => formatDate(row.createdDate || row.createdDate) 
    },
    { key: "address", label: "Address" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Select
          size="small"
          value={row.status}
          onChange={(e) =>
            handleStatusChange(
              row.id,
              e.target.value as "Active" | "Inactive"
            )
          }
          sx={{
            minWidth: 100,
            fontSize: 13,
            fontWeight: 600,
            "& .MuiSelect-select": {
              color:
                row.status === "Active"
                  ? "success.main"
                  : "error.main",
            },
          }}
        >
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
        </Select>
      ),
    },
    { key: ACTION_KEY, label: "Action" },
  ];

  const filteredDistributors = distributors.filter(
    (d) =>
      d.companyName?.toLowerCase().includes(searchValue.toLowerCase()) ||
      d.registrationNumber?.toLowerCase().includes(searchValue.toLowerCase()) ||
      d.phone?.toLowerCase().includes(searchValue.toLowerCase()) ||
      d.email?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleDelete = async (distributor: Distributor) => {
    const confirm = await showConfirmation(
      "Are you sure you want to delete this distributor?",
      "Confirm Delete"
    );

    if (confirm) {
      try {
        await deleteDistributor(parseInt(distributor.id));
        const updated = distributors.filter((d) => d.id !== distributor.id);
        setDistributors(updated);
        showToast("success", "Distributor deleted successfully!");
      } catch (error) {
        console.error("Error deleting distributor:", error);
        showToast("error", "Failed to delete distributor.");
      }
    }
  };

  if (loading) {
    return (
      <Paper sx={{ mt: 3, p: 3, textAlign: "center" }}>
        <Typography>Loading distributors...</Typography>
      </Paper>
    );
  }

  return (
    <>
      <FormProvider {...methods}>
        <Paper sx={{ mt: 3, p: { xs: 1, md: 3 } }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
          >
            <Typography
              fontSize={{ xs: 18, md: 22 }}
              mb={2}
              fontWeight={600}
            >
              Distributors List
            </Typography>
            <Button
              variant="contained"
              sx={{
                textTransform: "none",
                height: 36,
                mb: 2,
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
              Add Distributor
            </Button>
          </Box>

          <UniversalTable
            data={filteredDistributors}
            columns={columns}
            showExport={true}
            showSearch={true}
            getRowId={(row) => row.id}
            actions={{
              view: (distributor) =>
                navigate(URL_PATH.DistributorDetails, {
                  state: { distributor },
                }),
              edit: (distributor) => setEditingRow(distributor),
              delete: (distributor) => handleDelete(distributor),
            }}
          />
        </Paper>

        <EditDistributorForm
          editingRow={editingRow}
          onClose={() => setEditingRow(null)}
          onSave={handleSave}
        />
      </FormProvider>
    </>
  );
};

export default Distributors;