import { useState, useEffect } from "react";
import { Box, Button, Typography, Grid, Paper, TextField, Autocomplete } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { Print, Save, ArrowBack, Payments } from "@mui/icons-material";
import { CustomerData } from "@/view/CustomerMaster";
import TextInputField from "@/components/controlled/TextInputField";
import MobileField from "@/components/controlled/MobileField";
import EmailField from "@/components/controlled/EmailField";
import DateTimeField from "@/components/controlled/DateTimeField";
import ItemsSection from "@/containers/Customer/ItemsSection";
import { useNavigate } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";
import { Invoice } from "@/containers/Invoices/InvoiceView";

// Structure for a single row in the medicine list
export interface ItemRow { 
  id: number; 
  name: string; 
  qty: number | ""; 
  price: number | ""; 
}

interface Props {
  onBack: () => void;
  onSave: (data: CustomerData, total: number, meds: string, qty: number) => void;
  initialData: CustomerData | null;
}

const AddCustomerForm = ({ onBack, onSave, initialData }: Props) => {
  // State to manage medicine rows, GST, and Payment method
  const [rows, setRows] = useState<ItemRow[]>([{ id: Date.now(), name: "", qty: "", price: "" }]);
  const [gst, setGst] = useState(5);
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [list, setList] = useState<CustomerData[]>([]);

  const navigate = useNavigate();

  // React Hook Form setup: loads initialData if we are editing
  const methods = useForm<CustomerData>({
    defaultValues: initialData || { 
      name: "", age: "", mobile: "", email: "", 
      address: "", doctor: "", doctorAddress: "", 
      date: new Date().toISOString().split("T")[0] 
    }
  });

  // Load existing customers from LocalStorage for the search dropdown
  useEffect(() => {
    const saved = localStorage.getItem("medical_customers");
    if (saved) setList(JSON.parse(saved));
  }, []);

  // Calculation logic for bill totals
  const subTotal = rows.reduce((acc, r) => acc + (Number(r.qty) * Number(r.price)), 0);
  const finalTotal = subTotal + (subTotal * gst / 100);

  // Common style for Action Buttons
  const btnStyle = { 
    bgcolor: "#248a76", 
    color: "#fff", 
    width: { xs: "100%", sm: "auto" }, 
    fontWeight: "bold", 
    textTransform: "none", 
    "&:hover": { bgcolor: "#fff", color: "#248a76", borderColor: "#248a76" } 
  };


// print  
const handlePrint = () => {
  const invoiceData: Invoice = {
    patient: methods.getValues("name"),
    doctor: methods.getValues("doctor"),
    address: methods.getValues("address"),
    invoice: "inv",
    date: methods.getValues("date"),
    medicines: rows.map((r) => ({
      name: r.name,
      qty: r.qty === "" ? "" : String(r.qty), 
      amount: Number(r.qty) * Number(r.price),
      batch: "-",
      expiry: "-",
    })),
    subTotal,
    gst,
    total: finalTotal,
  };

  // Save invoice in localStorage
  const savedInvoices = JSON.parse(localStorage.getItem("invoices") || "[]");
  savedInvoices.push(invoiceData);
  localStorage.setItem("invoices", JSON.stringify(savedInvoices));

  // Navigate to InvoiceView with invoiceNo in URL and pass state
  navigate(`${URL_PATH.InvoiceView}/${invoiceData.invoice}`, { state: invoiceData });
};

  return (
    <FormProvider {...methods}>
      {/* Main Form Container */}
      <Box 
        component="form" 
        onSubmit={methods.handleSubmit(d => onSave(d, finalTotal, rows.map(r => r.name).join(", "), rows.length))} 
        sx={{  bgcolor: "#f5f5f5", minHeight: "100vh" }}
      >

        {/* Top Header Section */}
        <Box sx={{ display: "flex", flexDirection: { xs: "column-reverse", sm: "row" }, justifyContent: "space-between", gap: 2, mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">Add New Invoice</Typography>
          <Button startIcon={<ArrowBack />} variant="outlined" onClick={onBack} sx={{ color: "#248a76", borderColor: "#248a76" }}>
            Back
          </Button>
        </Box>

        {/*  Search, Customer and Doctor Details */}
        <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3, borderRadius: "7px", border: "1px solid #e0e0e0" }} elevation={0}>
          <Grid container spacing={3}>
            
            {/*  To find and auto-fill existing customer data */}
            <Grid size={{ xs: 12 }}>
              <Autocomplete 
                options={list} 
                getOptionLabel={(o) => `${o.name} (${o.mobile})`} 
                onChange={(_, v) => v && methods.reset(v)} 
                renderInput={(p) => <TextField {...p} label="Search Existing Customer" size="small" fullWidth />} 
              />
            </Grid>

            {/*  Input fields for Customer Info */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography variant="subtitle1" fontWeight="bold" mb={2}>Customer Details</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}><TextInputField name="name" label="Customer Name" required /></Grid>
                <Grid size={{ xs: 12, md: 6 }}><DateTimeField name="date" label="Date" required /></Grid>
                <Grid size={{ xs: 12, md: 6 }}><TextInputField name="age" label="Age" required /></Grid>
                <Grid size={{ xs: 12, md: 6 }}><MobileField name="mobile" label="Mobile" required /></Grid>
                <Grid size={{ xs: 12, md: 6 }}><EmailField name="email" label="Email" /></Grid>
                <Grid size={{ xs: 12, md: 6 }}><TextInputField name="address" label="Address" required /></Grid>
              </Grid>
            </Grid>

            {/*  Input fields for Doctor Info */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Typography variant="subtitle1" fontWeight="bold" mb={2} mt={{ xs: 2, md: 0 }}>Doctor Information</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}><TextInputField name="doctor" label="Doctor Name" required /></Grid>
                <Grid size={{ xs: 12 }}><TextInputField name="doctorAddress" label="Doctor Address/Clinic" /></Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>

        {/*  Medicine Items List (Table part) */}
        <ItemsSection 
          rows={rows} setRows={setRows} 
          gst={gst} setGst={setGst} 
          paymentMode={paymentMode} setPaymentMode={setPaymentMode} 
          finalTotal={finalTotal} 
        />

        {/* Bottom Action Buttons (Print, Pay, Save) */}

        <Box sx={{ mt: 4, mb: 5, display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "flex-end", gap: 2 }}>
          {/* <Button variant="contained" startIcon={<Print />} onClick={() => window.print()} sx={btnStyle}>
            Print
          </Button> */}

          <Button variant="contained" onClick={handlePrint} startIcon={<Print />} sx={btnStyle}>
            Print
          </Button>
          
          <Button variant="contained" startIcon={<Payments />} onClick={() => alert(`Total: ₹${finalTotal}`)} sx={btnStyle}>
            Pay Now
          </Button>
          <Button variant="contained" type="submit" startIcon={<Save />} sx={btnStyle}>
            Save 
          </Button>
        </Box>
      </Box>
    </FormProvider>
  );
};

export default AddCustomerForm;