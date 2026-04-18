import { Box, Paper, Typography, Grid, Button } from "@mui/material";
import { CustomerData, PurchaseHistory } from "@/view/CustomerMaster";
import { UniversalTable, Column } from "@/components/uncontrolled/UniversalTable";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState } from "react";
import axios from "axios";

interface ViewProps {
  customer: CustomerData;
  onBack: () => void;
  onDeleteInvoice: (invoice: PurchaseHistory) => void;
  onEditInvoice: (invoice: PurchaseHistory) => void;
}

/* ✅ API Response Types */
interface RetailInvoice {
  retailInvoiceId: number;
  totalAmount: number;
  doctorName: string;
  createdAt: string;
}

interface RetailInvoiceItem {
  retailItemId: number;
  medicineName: string;
  quantity: number;
}

const CustomerViewDetails = ({ customer, onBack, onDeleteInvoice, onEditInvoice }: ViewProps) => {

  const [invoiceData, setInvoiceData] = useState<PurchaseHistory[]>([]);

  const invoiceColumns: readonly Column<PurchaseHistory>[] = [
    { label: "Inv. No.", key: "id" },
    { label: "Medicines", key: "medicines" },
    { label: "Quantity", key: "totalQty" },
    { label: "Total Price", key: "totalPrice" },
    { label: "Doctor", key: "doctor" },
    { label: "Date", key: "date" },
    { label: "Actions", key: "actionbutton" as keyof PurchaseHistory }
  ];

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      try {
        const invoiceRes = await axios.get<RetailInvoice[]>(
          `/api/RetailInvoice/customer/${customer.id}`
        );

        const invoices = invoiceRes.data;

        const historyData: PurchaseHistory[] = await Promise.all(
          invoices.map(async (invoice) => {

            const itemsRes = await axios.get<RetailInvoiceItem[]>(
              `/api/RetailInvoiceItems/by-invoice/${invoice.retailInvoiceId}`
            );

            const items = itemsRes.data;

            return {
              id: invoice.retailInvoiceId.toString(), // ✅ FIXED
              medicines: items.map((i) => i.medicineName).join(", "),
              totalQty: items.reduce((sum, i) => sum + i.quantity, 0),
              totalPrice: invoice.totalAmount,
              doctor: invoice.doctorName,
              date: new Date(invoice.createdAt).toLocaleDateString()
            };
          })
        );

        setInvoiceData(historyData);

      } catch (error) {
        console.error("Error fetching purchase history:", error);
      }
    };

    fetchPurchaseHistory();
  }, [customer.id]);

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh" }}>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button onClick={onBack} variant="outlined" startIcon={<ArrowBackIcon />} sx={{ color: "#248a76", borderColor: "#248a76" }}>
          Back to List
        </Button>
      </Box>

      <Paper sx={{ p: 4, mb: 4, borderRadius: "16px", border: "1px solid #e0e0e0" }} elevation={0}>
        <Grid container spacing={4}>

          <Grid size={{ xs: 12, md: 4 }}>
            <Grid container spacing={2}>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="subtitle2" fontWeight={600} fontSize="16px" color="Black">
                  Customer Name
                </Typography>
                <Typography variant="body1" fontWeight={500} fontSize="14px">
                  {customer.name}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="subtitle2" fontWeight={600} fontSize="16px" color="Black">
                  Mobile
                </Typography>
                <Typography fontWeight={500} fontSize="14px">
                  {customer.phone}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="subtitle2" fontWeight={600} fontSize="16px" color="Black">
                  Age
                </Typography>
                <Typography fontSize="14px">
                  {customer.age}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="subtitle2" fontWeight={600} fontSize="16px" color="Black">
                  Address
                </Typography>
                <Typography fontSize="14px">
                  {customer.address}
                </Typography>
              </Grid>

            </Grid>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container spacing={2}>

              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" fontWeight={600} fontSize="16px" color="black">
                  Consulting Doctor
                </Typography>
                <Typography variant="body1" fontSize="14px">
                  {customer.doctor}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" fontWeight={600} fontSize="16px" color="Black">
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

      <Paper sx={{ p: 3, borderRadius: "16px", border: "1px solid #e0e0e0" }} elevation={0}>
        <Typography variant="h6" fontWeight="bold" mb={2}>Purchase History</Typography>

        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <UniversalTable<PurchaseHistory>
            columns={invoiceColumns}
            data={invoiceData}
            actions={{
              edit: (row) => onEditInvoice(row),
              delete: (invoice) => onDeleteInvoice(invoice),
            }}
          />
        </Box>
      </Paper>

    </Box>
  );
};

export default CustomerViewDetails;