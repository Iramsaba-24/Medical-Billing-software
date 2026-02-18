 import { Box, Paper, Typography, Grid, Button } from "@mui/material";
import { CustomerData, PurchaseHistory } from "@/view/CustomerMaster";
import { UniversalTable, Column } from "@/components/uncontrolled/UniversalTable";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Interface to define what data this component needs to work
interface ViewProps {
  customer: CustomerData;
  onBack: () => void; // Function to go back to the previous screen
  onDeleteInvoice: (invoice: PurchaseHistory) => void; // Function to delete an invoice
  onEditInvoice: (invoice: PurchaseHistory) => void; // Function to edit an invoice
}

const CustomerViewDetails = ({ customer, onBack, onDeleteInvoice, onEditInvoice }: ViewProps) => {
  
  //  table columns Headings and matching data keys
  const invoiceColumns: readonly Column<PurchaseHistory>[] = [
    { label: "Inv. No.", key: "id" },
    { label: "Medicines", key: "medicines" },
    { label: "Quantity", key: "totalQty" }, 
    { label: "Total Price", key: "totalPrice" },
    { label: "Doctor", key: "doctor" }, 
    { label: "Date", key: "date" },
    { label: "Actions", key: "actionbutton" as keyof PurchaseHistory } // Placeholder for Edit/Delete buttons
  ];

  // Get the list of purchases from customer data if empty, use an empty array
  const invoiceData: PurchaseHistory[] = customer.history || [];

  return (
    <Box sx={{  bgcolor: "#f8f9fa", minHeight: "100vh" }}>
      
      {/* T Back button to navigate away from details view */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button onClick={onBack} variant="outlined" startIcon={<ArrowBackIcon />} sx={{ color: "#248a76", borderColor: "#248a76" }}>
          Back to List
        </Button>
      </Box>

      {/*  Displays basic Customer Information and Doctor details */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: "16px", border: "1px solid #e0e0e0" }} elevation={0}>
        <Grid container spacing={4}>
          
          {/*  Customer's personal data Name, Mobile, Age, Address */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Grid container spacing={2}>
              <Grid size= {{ xs: 12, sm: 4 }}>
                <Typography variant="caption" color="textSecondary">Customer Name</Typography>
                <Typography fontWeight={600} variant="body1">{customer.name}</Typography>
              </Grid>
              <Grid size= {{ xs: 12, sm: 4 }}>
                <Typography variant="caption" color="textSecondary">Mobile</Typography>
                <Typography fontWeight={600}>{customer.mobile}</Typography>
              </Grid>
              <Grid size= {{ xs: 12, sm: 4 }}>
                <Typography variant="caption" color="textSecondary">Age</Typography>
                <Typography fontWeight={600}>{customer.age}</Typography>
              </Grid>
              <Grid size= {{ xs: 12, sm: 4 }}>
                <Typography variant="caption" color="textSecondary">Address</Typography>
                <Typography fontWeight={600}>{customer.address}</Typography>
              </Grid>
            </Grid>
          </Grid>

          {/*  Consulting Doctor information */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" color="textSecondary">Consulting Doctor</Typography>
                <Typography fontWeight={600} variant="body1">{customer.doctor}</Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" color="textSecondary">Clinic Address</Typography>
                <Typography fontWeight={600}>{customer.doctorAddress || "N/A"}</Typography>
              </Grid>
            </Grid>
          </Grid>
          
        </Grid>
      </Paper>

      {/*  Displays the history of all invoices for this customer */}
      <Paper sx={{ p: 3, borderRadius: "16px", border: "1px solid #e0e0e0" }} elevation={0}>
        <Typography variant="h6" fontWeight="bold" mb={2}>Purchase History</Typography>
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          
          {/* Reusable table component to list all previous invoices */}
          <UniversalTable<PurchaseHistory>
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