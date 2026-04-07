
import {Box,Grid,Paper,Button,} from "@mui/material";
import { FormProvider, useForm, FieldErrors } from "react-hook-form";
import { useState, useEffect } from "react";
import EmailField from "@/components/controlled/EmailField";
import MobileField from "@/components/controlled/MobileField";
import TextInputField from "@/components/controlled/TextInputField";
import { useNavigate } from "react-router-dom";
import { showToast } from "@/components/uncontrolled/ToastMessage";
import { URL_PATH } from "@/constants/UrlPath";
import InvoiceTabButtons from "./InvoiceTabButtons";
import ItemsSection from "@/containers/Customer/ItemsSection";
import DropdownField from "@/components/controlled/DropdownField";
import { getDistributors } from "@/service/distributorService";
import { createInvoice } from "@/service/distributorInvoiceService";
import { addDistributorInvoiceItem } from "@/service/distributorInvoiceItemService";

 
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
  id: number;
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
  medicineId?: number; 
  quantity: number | "";
  mrp: number | "";
  expiry?: string;
};
 
const NewInvoice = () => {
  const navigate = useNavigate();
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [rows, setRows] = useState<ItemRow[]>([
    { id: Date.now(), name: "", quantity: 1, mrp: "", expiry: "" },
  ]);
 
  const [gst, setGst] = useState<number>(5);
  const [isSubmitted, setIsSubmitted] = useState(false);
 
  /*  GRAND TOTAL */
 
  const finalTotal = rows.reduce((sum, r) => {
    return sum + Number(r.quantity || 0) * Number(r.mrp || 0);
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
  const fetchDistributors = async () => {
    try {
      const data = await getDistributors();

      const formatted = data.map((d) => ({
        id: d.distributorId,
        companyName: d.companyName,
        ownerName: d.ownerName,
        mobile: d.phone,
        email: d.email,
        address: d.address,
        status: "Active" as const,
        gstIn: d.gstin,
      }));

      setDistributors(formatted);
    } catch (error) {
      console.error("Distributor fetch error:", error);
    }
  };

  fetchDistributors();
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
 
const onSubmit = async (data: FormData) => {
  console.log("DATA:", data);

  setIsSubmitted(true);

  if (!selectedDistributor) {
    showToast("error", "Please select distributor");
    return;
  }

  if (rows.some((r) => !r.name || !r.quantity || !r.mrp)) {
    showToast("error", "Please fill all item details");
    return;
  }

  try {
    const gstAmount = (finalTotal * gst) / 100;
    const grandTotal = finalTotal + gstAmount;

    // Create Invoice
    const invoiceRes = await createInvoice({
      distributorId: selectedDistributor.id,
      invoiceType: "DISTRIBUTOR",
      invoiceDate: new Date().toISOString(),
      totalAmount: grandTotal,
      totalGST: gstAmount,
      totalDiscount: 0,
      medipointsEarned: 0,
      paymentStatus: "PENDING",
    });

    const invoiceId = invoiceRes.invoiceId;

    //  Save Items
const itemsPayload = rows.map((r) => {
  const qty = Number(r.quantity);
  const mrp = Number(r.mrp);

  return {
    invoiceId: invoiceId,        
    medicineId: r.medicineId || 0,
    quantity: qty,
    mrp: mrp,                    
    discountPrice: 0,            
    amount: qty * mrp            
  };
});

    console.log("Items Payload:", itemsPayload);

for (const item of itemsPayload) {
  await addDistributorInvoiceItem(item);
}

    showToast("success", "Invoice + Items saved!");

    navigate(URL_PATH.PaymentMethod, {
      state: {
        flow: "new",
        totalFromInvoice: grandTotal,
        invoiceId: invoiceId, 
      },
    });

  } catch (error) {
    console.error(error);
    showToast("error", "Failed to create invoice");
  }
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