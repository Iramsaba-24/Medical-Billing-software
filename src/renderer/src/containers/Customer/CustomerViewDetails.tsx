import { Box, Paper, Typography, Grid, Button } from "@mui/material";
import { CustomerData, PurchaseHistory } from "@/view/CustomerMaster";
import {
  UniversalTable,
  Column,
} from "@/components/uncontrolled/UniversalTable";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface ViewProps {
  customer: CustomerData;
  onBack: () => void; // Function to go back to the previous screen
  onDeleteInvoice: (invoice: PurchaseHistory) => void; // Function to delete an invoice
  onEditInvoice: (invoice: PurchaseHistory) => void; // Function to edit an invoice
}

const CustomerViewDetails = ({
  customer,
  onBack,
  onDeleteInvoice,
  onEditInvoice,
}: ViewProps) => {
  const invoiceColumns: readonly Column<PurchaseHistory>[] = [
    { label: "Inv. No.", key: "id" },
    { label: "Medicines", key: "medicines" },
    { label: "Quantity", key: "totalQty" },
    { label: "Total Price", key: "totalPrice" },
    { label: "Doctor", key: "doctor" },
    { label: "Date", key: "date" },
    { label: "Actions", key: "actionbutton" as keyof PurchaseHistory },
  ];

  const invoiceData: PurchaseHistory[] = customer.history || [];

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh" }}>
      {/* T Back button to navigate away from details view */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          onClick={onBack}
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ color: "#248a76", borderColor: "#248a76" }}
        >
          Back to List
        </Button>
      </Box>

      {/*  Displays basic Customer Information and Doctor details */}
      <Paper
        sx={{ p: 4, mb: 4, borderRadius: "16px", border: "1px solid #e0e0e0" }}
        elevation={0}
      >
        <Grid container spacing={4}>
          {/* Customer's personal data Name, Mobile, Age, Address */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  fontSize="16px"
                  color="Black"
                >
                  Customer Name
                </Typography>
                <Typography variant="body1" fontWeight={500} fontSize="14px">
                  {customer.name}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  fontSize="16px"
                  color="Black"
                >
                  Mobile
                </Typography>
                <Typography fontWeight={500} fontSize="14px">
                  {customer.phone}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  fontSize="16px"
                  color="Black"
                >
                  Age
                </Typography>
                <Typography fontSize="14px">{customer.age}</Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  fontSize="16px"
                  color="Black"
                >
                  Address
                </Typography>
                <Typography fontSize="14px">{customer.address}</Typography>
              </Grid>
            </Grid>
          </Grid>

          {/* Consulting Doctor information */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  fontSize="16px"
                  color="black"
                >
                  Consulting Doctor
                </Typography>
                <Typography variant="body1" fontSize="14px">
                  {customer.doctor}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  fontSize="16px"
                  color="Black"
                >
                  Clinic Address
                </Typography>
                <Typography fontSize="14px">
                  {customer.doctorAddress || "N/A"}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/*  Displays the history of all invoices for this customer */}
      <Paper
        sx={{ p: 3, borderRadius: "16px", border: "1px solid #e0e0e0" }}
        elevation={0}
      >
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Purchase History
        </Typography>
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          {/* Reusable table component to list all previous invoices */}
          <UniversalTable<PurchaseHistory & Record<string, unknown>>
            columns={invoiceColumns}
            data={invoiceData}
            actions={{
              edit: (row) => onEditInvoice(row),
              delete: (invoice: PurchaseHistory) => onDeleteInvoice(invoice),
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default CustomerViewDetails;
