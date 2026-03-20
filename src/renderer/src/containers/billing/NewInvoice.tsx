
import {
  Box,
  Grid,
  Paper,
  Button,
} from "@mui/material";
import { FormProvider, useForm, FieldErrors } from "react-hook-form";
import { useState, useEffect } from "react";
import EmailField from "@/components/controlled/EmailField";
import MobileField from "@/components/controlled/MobileField";
import TextInputField from "@/components/controlled/TextInputField";
import { useNavigate } from "react-router-dom";
import { showToast } from "@/components/uncontrolled/ToastMessage";
import { URL_PATH } from "@/constants/UrlPath";
import InvoiceTabButtons from "./InvoiceTabButtons";
import ItemsSection from "@/containers/customer/ItemsSection";
import DropdownField from "@/components/controlled/DropdownField";
 
const BORDER_COLOR = "#D1D5DB";
const containerStyle = {
  p: { xs: 2 },
  backgroundColor: "#fff",
  borderRadius: "12px",
  border: `1px solid ${BORDER_COLOR}`,
  mb: 2,
};
 
const PayNPrint = {
  backgroundColor: "#238878",
  color: "#fff",
  border: "2px solid #238878",
  textTransform: "none",
  minWidth: "250px",
  height: "36px",
  "&:hover": {
    backgroundColor: "#fff",
    color: "#238878",
    border: "2px solid #238878",
  },
};
 
type Distributor = {
  id: string;
  companyName: string;
  ownerName?: string;
  mobile: string;
  email: string;
  address: string;
  status: "Active" | "Inactive";
  gstIn?: string;
};
 
type FormData = {
  company: string;
  supplier: string;
  mobile: string;
  email: string;
  address: string;
  gst:string;
};
 
type ItemRow = {
  id: number;
  name: string;
  qty: number | "";
  price: number | "";
  expiry?: string;
};
 
const NewInvoice = () => {
  const navigate = useNavigate();
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [rows, setRows] = useState<ItemRow[]>([
    { id: Date.now(), name: "", qty: 1, price: "", expiry: "" },
  ]);
 
  const [gst, setGst] = useState<number>(5);
  const [isSubmitted, setIsSubmitted] = useState(false);
 
  /*  GRAND TOTAL */
 
  const finalTotal = rows.reduce((sum, r) => {
    return sum + Number(r.qty || 0) * Number(r.price || 0);
  }, 0);
 
  const methods = useForm<FormData>({
    mode: "onChange",
    shouldUnregister: false,
    defaultValues: {
    gst: "5",
  },
  });
 
  const { handleSubmit, watch } = methods;
 
  /* LOAD DISTRIBUTORS */
 
  useEffect(() => {
    const saved = localStorage.getItem("distributors");
    if (saved) {
      const parsed: Distributor[] = JSON.parse(saved);
      setDistributors(parsed);
    }
  }, []);
 
  const selectedCompany = watch("company");
  useEffect(() => {
    if (selectedCompany === "add_company") {
      navigate(URL_PATH.DistributorsForm);
    }
  }, [selectedCompany, navigate]);
  const selectedDistributor = distributors.find(
  (d) => d.companyName === selectedCompany
);
 
  const onSubmit = (data: FormData) => {
    setIsSubmitted(true);
    if (rows.some((r) => !r.name || !r.qty || !r.price)) {
      showToast("error", "Please fill all item details");
      return;
    }
 
    const gstAmount = (finalTotal * gst) / 100;
    const grandTotal = finalTotal + gstAmount;
    const existingInvoices = JSON.parse(
      localStorage.getItem("currentNewInvoice") || "[]"
    );
 
    const newInvoice = {
      id: Date.now(),
      company: data.company,
      supplier: data.supplier,
      mobile: data.mobile,
      email: data.email,
      address: data.address,
      gst: gst, 
        gstIn: selectedDistributor?.gstIn || "",     
  distributorId: selectedDistributor?.id || "",      
      medicines: rows.map((r) => ({
      name: r.name,
        qty: r.qty,
        amount: Number(r.qty || 0) * Number(r.price || 0),
        batch: "",
        expiry: r.expiry || "",
      })),
      totalPrice: grandTotal,
    };
 
    const updatedInvoices = [...existingInvoices, newInvoice];
    localStorage.setItem("currentNewInvoice", JSON.stringify(updatedInvoices));
    showToast("success", "Data saved successfully!");
 
 
    navigate(URL_PATH.PaymentMethod, {
  state: {
    flow: "new",
    totalFromInvoice: grandTotal,
  },
});
  };
 
  const onError = (formErrors: FieldErrors<FormData>) => {
    console.log("FORM ERRORS:", formErrors);
    showToast("error", "Please fill all required fields");
  };
 
  const companyOptions = [
    { label: "+ Add Company", value: "add_company" },
    ...distributors
      .filter((d) => d.status === "Active")
      .map((d) => ({
        label: d.companyName,
        value: d.companyName,
      })),
  ];
 
  /* AUTO FILL */
 
  useEffect(() => {
    if (selectedCompany) {
      const selectedDistributor = distributors.find(
        (d) => d.companyName === selectedCompany,
      );
 
      if (selectedDistributor) {
        methods.setValue("mobile", selectedDistributor.mobile || "");
        methods.setValue("email", selectedDistributor.email || "");
        methods.setValue("address", selectedDistributor.address || "");
        methods.setValue("supplier", selectedDistributor.ownerName || "");
      }
    }
  }, [selectedCompany, distributors, methods]);
 
  return (
    <FormProvider {...methods}>
      <InvoiceTabButtons />
 
      <Paper sx={{ p: 2 }}>
        <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
          <Box sx={containerStyle}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <DropdownField
                  name="company"
                  label="Company"
                  options={companyOptions}
                  required
                  freeSolo={false}
                  editable={true}
                />
              </Grid>
 
              <Grid size={{ xs: 12, md: 6 }}>
                <TextInputField name="supplier" label="Supplier" minLength={3} required />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <MobileField
                  name="mobile"
                  label="Mobile Number"
                  required
                  countryCode
                  
                />
              </Grid>
 
              <Grid size={{ xs: 12, md: 6 }}>
                <EmailField name="email" label="Email Address" required />
              </Grid>
 
              <Grid size={{ xs: 12 }}>
                <TextInputField
                  name="address"
                  label="Address"
                  inputType="textarea"
                  rows={3}
                  minLength={10}
                  maxLength={50}
                />
              </Grid>
            </Grid>
          </Box>
 
          {/* ITEMS */}
 
          <ItemsSection
            rows={rows}
            setRows={setRows}
            finalTotal={finalTotal}
            gst={gst}
            setGst={setGst}
            isSubmitted={isSubmitted}
          />
 
          <Box
            display="flex"
            gap={2}
            mt={3}
            sx={{
              justifyContent: { xs: "center", md: "flex-end" },
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              type="submit"
              sx={{ ...PayNPrint, minWidth: "140px" }}
            >
              Save And Submit
            </Button>
          </Box>
        </form>
      </Paper>
    </FormProvider>
  );
};
export default NewInvoice;