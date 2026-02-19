 import { useState, useEffect } from "react";
import { Box, Button, Typography, Paper, Autocomplete, TextField } from "@mui/material"; 
import { useForm, FormProvider } from "react-hook-form";
import { Save, ArrowBack, Payment, Print } from "@mui/icons-material"; 
import { CustomerData } from "@/view/CustomerMaster";
import TextInputField from "@/components/controlled/TextInputField";
import MobileField from "@/components/controlled/MobileField";
import EmailField from "@/components/controlled/EmailField";
import DateTimeField from "@/components/controlled/DateTimeField";
import ItemsSection from "@/containers/Customer/ItemsSection";
import DropdownField from "@/components/controlled/DropdownField";

// Structure for each medicine/item row in the bill
export interface ItemRow { 
  id: number; 
  name: string; 
  qty: number | ""; 
  price: number | ""; 
}

interface Props {
  onBack: () => void;
  onSave: (data: CustomerData, total: number, meds: string, qty: number, actualRows: ItemRow[]) => void;
  initialData: CustomerData | null;
}

const AddCustomerForm = ({ onBack, onSave, initialData }: Props) => {
  
  const [rows, setRows] = useState<ItemRow[]>([{ id: Date.now(), name: "", qty: "", price: "" }]);
  const [gst, setGst] = useState(5);
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [isSubmitted, setIsSubmitted] = useState(false); 
  const [customerOptions, setCustomerOptions] = useState<CustomerData[]>([]);

  // Initialize the form with react-hook-form and default empty values
  const methods = useForm<CustomerData>({
    defaultValues: { 
      name: "", age: "", mobile: "", email: "", address: "", doctor: "", doctorAddress: "", 
      date: new Date().toISOString().split("T")[0] 
    }
  });

  const [doctorOptions, setDoctorOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    const storedDoctors = JSON.parse(localStorage.getItem("doctors") || "[]");
    const options = storedDoctors.map((doc: { doctorName: string }) => ({
      label: doc.doctorName,
      value: doc.doctorName,
    }));
    setDoctorOptions(options);
  }, []);

  // Load existing customers from LocalStorage for the search dropdown
  useEffect(() => {
    const saved = localStorage.getItem("medical_customers");
    if (saved) setCustomerOptions(JSON.parse(saved));
  }, []);
  // Common styling for action buttons (Print, Pay, Save)
  const buttonStyle = {
    backgroundColor: "#238878",
    color: "#fff",
    border: "2px solid #238878",
    textTransform: "none" as const,
    fontWeight: "bold",
    px: 3,
    py: 1,
    "&:hover": { backgroundColor: "#fff", color: "#238878", border: "2px solid #238878" },
  };

 
  useEffect(() => {
    // Load existing customers from Local Storage for the search/autocomplete
    const saved = localStorage.getItem("medical_customers");
    if (saved) setCustomerOptions(JSON.parse(saved));

    // If initialData exists (Edit Mode), fill the form with that data
    if (initialData) {
      methods.reset(initialData);
      if (initialData.itemsList) setRows(initialData.itemsList);
    }
  }, [initialData, methods]);

  
  // When a user selects a customer from the search dropdown
  const handleSelectCustomer = (selected: CustomerData | null) => {
    if (selected) {
      // Auto-fill form with selected customer details
      methods.reset({ ...selected, date: new Date().toISOString().split("T")[0] });
    } else {
      // Reset form if search is cleared
      methods.reset({ 
        name: "", age: "", mobile: "", email: "", address: "", doctor: "", doctorAddress: "", 
        date: new Date().toISOString().split("T")[0] 
      });
      setRows([{ id: Date.now(), name: "", qty: "", price: "" }]);
    }
  };

  //  Calculate Subtotal Qty * Price and then add GST %
  const subTotal = rows.reduce((acc, r) => acc + (Number(r.qty) * Number(r.price)), 0);
  const finalTotal = subTotal + (subTotal * gst / 100);

  // Function to validate and save the entire form
  const handleActualSave = (data: CustomerData) => {
    setIsSubmitted(true);
    // Ensure all medicine rows have valid Name, Qty and Price
    const areItemsValid = rows.every(r => r.name.trim() !== "" && Number(r.qty) > 0 && Number(r.price) > 0);
    
    if (areItemsValid) {
      onSave(data, finalTotal, rows.map(r => r.name).join(", "), rows.length, rows);
    }
  };

  return (
    <FormProvider {...methods}>
      <Box component="form" noValidate onSubmit={methods.handleSubmit(handleActualSave)} 
        sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", p: { xs: 1, md: 0 } }}>
        
        {/*  Page Header & Back Button */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h5" fontWeight="bold">Add New Customer</Typography>
          <Button startIcon={<ArrowBack />} variant="outlined" onClick={onBack} sx={{ color: "#248a76", borderColor: "#248a76" }}>Back</Button>
        </Box>

        {/*  Search Existing Customer Dropdown */}
        <Box sx={{ mb: 2 }}>
          <Autocomplete
            options={customerOptions}
            getOptionLabel={(option) => `${option.name} (${option.mobile})`}
            onChange={(_, value) => handleSelectCustomer(value)}
            renderInput={(params) => (
              <TextField {...params} label="Search Existing Customer" variant="outlined"  fullWidth sx={{ bgcolor: "white" }} />
            )}
          />
        </Box>

        {/*  Customer & Doctor Personal Information Card */}
        <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3, border: "1px solid #e0e0e0" }} elevation={3}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.5fr 1fr" }, gap: 4 }}>
            {/*  Customer details like Mobile, Age, Address */}
            <Box >
              <Typography variant="subtitle1" fontWeight="bold" mb={2}>Customer Details</Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                <TextInputField name="name" label="Customer Name" inputType="alphabet" required />
                <DateTimeField name="date" label="Date" required />
                <TextInputField name="age" label="Age" maxLength={3} required />
                <MobileField name="mobile" label="Mobile" required />
                <EmailField name="email" label="Email" required />
                <TextInputField name="address" label="Address" inputType="textarea" rows={1} required />
              </Box>
            </Box>
            {/*  Doctor Info */}
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" mb={2}>Doctor Information</Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 2 }}>
                <DropdownField
                  name="doctor"
                  label="Doctor Name"
                  options={doctorOptions}
                />
                <TextInputField name="doctorAddress" label="Doctor Address/Clinic" inputType="textarea" rows={1} />
              </Box>
            </Box>
          </Box>
        </Paper>

        {/*  Medicines/Items Table Adding rows and calculating row totals */}
        <ItemsSection 
          rows={rows} setRows={setRows} 
          gst={gst} setGst={setGst} 
          paymentMode={paymentMode} setPaymentMode={setPaymentMode} 
          finalTotal={finalTotal} isSubmitted={isSubmitted} 
        />

        {/*  Footer Action Buttons Print, Pay, Save */}
        <Box sx={{ 
          mt: 4, 
          display: "flex", 
          flexDirection: { xs: "row", sm: "row" }, 
          flexWrap: "wrap", 
          justifyContent: "flex-end", 
          gap: 2 
        }}>
          
          {/*  Opens browser print dialog */}
          <Button 
            variant="contained" 
            startIcon={<Print />} 
            sx={{ ...buttonStyle, width: { xs: "calc(50% - 8px)", sm: "auto" } }} 
            onClick={() => window.print()}
          >
            Print
          </Button>

          {/*  For payment processing */}
          <Button 
            variant="contained" 
            startIcon={<Payment />} 
            sx={{ ...buttonStyle, width: { xs: "calc(50% - 8px)", sm: "auto" } }}
          >
            Pay Now
          </Button>

          {/* Validates all items and saves the invoice */}
          <Button 
            variant="contained" 
            type="submit" 
            startIcon={<Save />} 
            sx={{ 
              ...buttonStyle, 
              width: { xs: "100%", sm: "auto" },
              order: { xs: 3, sm: 0 } 
            }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </FormProvider>
  );
};

export default AddCustomerForm;


