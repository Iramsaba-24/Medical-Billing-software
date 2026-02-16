import { Box, Button, Paper } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";
import TextInputField from "@/components/controlled/TextInputField";
import MobileField from "@/components/controlled/MobileField";
import DropdownField from "@/components/controlled/DropdownField";
import ItemsSection from "@/containers/customer/ItemsSection";
import NumericField from "@/components/controlled/NumericField";
import { useNavigate, useLocation } from "react-router-dom";
import { Print } from "@mui/icons-material";
import { URL_PATH } from "@/constants/UrlPath";
import RetailInvoice from "@/containers/billing/RetailInvoice";
 
// Payprint button reuse sx
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
 
type NewInvoiceFormValues = {
  name: string;
  age: string;
  mobile: string;
  email: string;
  doctor: string;
  reference: string;
  addressLeft: string;
  addressRight: string;
};
 
const doctorOptions = [
  { label: "Dr. Amit Sharma", value: "amit_sharma" },
  { label: "Dr. Sneha Patil", value: "sneha_patil" },
  { label: "Dr. Rahul Mehta", value: "rahul_mehta" },
];
 
function POSMaster() {
  const navigate = useNavigate();
  const location = useLocation();
  const methods = useForm<NewInvoiceFormValues>({
    defaultValues: {
      name: "",
      age: "",
      mobile: "",
      email: "",
      doctor: "",
      reference: "",
      addressLeft: "",
      addressRight: "",
    },
  });
 
 
  const activeTab: "new" | "retail" = location.pathname.includes('retail-invoice') ? "retail" : "new";
  const isRetail = activeTab === "retail";
 
 
  const activeInvoice = location.pathname.match(/invoice(\d+)/)?.[1] ?? "1";
 
  const invoiceButtonSx = (isActive: boolean) => ({
    backgroundColor: isActive ? "#fff" : "#238878",
    color: isActive ? "#238878" : "#fff",
    border: "2px solid #238878",
    textTransform: "none",
    minWidth: "250px",
    height: "36px",
    "&:hover": {
      backgroundColor: "#fff",
      color: "#238878",
      border: "2px solid #238878",
    },
  });
 
  const onSubmit = (data: NewInvoiceFormValues) => {
    console.log(data);
    navigate(URL_PATH.MediPoints);
  };
 
  type ItemRow = {
    id: number;
    name: string;
    qty: number | "";
    price: number | "";
  };
 
  const [rows, setRows] = useState<ItemRow[]>([
    { id: Date.now(), name: "", qty: 1, price: "" },
  ]);
 
  const [gst, setGst] = useState(5);
  const [paymentMode, setPaymentMode] = useState("Cash");
 
  const subTotal = rows.reduce(
    (sum, r) => sum + (Number(r.qty) * Number(r.price) || 0),
    0
  );
 
  const finalTotal = subTotal + (subTotal * gst) / 100;
 
  return (
    <FormProvider {...methods}>
      {/* New Invoice */}
      <Button
        onClick={() => {
          if (location.pathname !== URL_PATH.Billing) {
            navigate(URL_PATH.Billing);
          }
        }}
        sx={{
          textTransform: "none",
          width: { xs: "50%", md: "10%" },
          height: "38px",
          fontWeight: 500,
          borderRadius: "0px 18px 0px 0px",
          backgroundColor: activeTab === "new" ? "#238878" : "#fff",
          color: activeTab === "new" ? "#fff" : "#000",
          border: activeTab === "new" ? "none" : "1px solid #ccc",
          "&:hover": {
            backgroundColor: activeTab === "new" ? "#238878" : "#f5f5f5",
          },
        }}
      >
        New Invoice
      </Button>
 
      {/* Retail Invoice */}
      <Button
        onClick={() => {
          if (location.pathname !== URL_PATH.RetailInvoice) {
            navigate(URL_PATH.RetailInvoice);
          }
        }}
        sx={{
          textTransform: "none",
          width: { xs: "50%", md: "10%" },
          height: "38px",
          fontWeight: 500,
          borderRadius: "0px 18px 0px 0px",
          backgroundColor: activeTab === "retail" ? "#238878" : "#fff",
          color: activeTab === "retail" ? "#fff" : "#000",
          border: activeTab === "retail" ? "none" : "1px solid #ccc",
          "&:hover": {
            backgroundColor: activeTab === "retail" ? "#238878" : "#f5f5f5",
          },
        }}
      >
        Retail Invoice
      </Button>
 
      {isRetail ? (
        <RetailInvoice />
      ) : (
        <Box
          sx={{
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "grey.400",
            p: 2,
            backgroundColor: "#fff",
          }}>
 
          <Box
            display="flex"
            gap={1.5}
            mb={2}
            flexWrap="wrap"
            sx={{
              justifyContent: { xs: "flex-start", md: "flex-start" },
            }}
          >
            {Array.from({ length: 10 }, (_, i) => {
              const invoiceNumber = i + 1;
              const isActive = String(invoiceNumber) === activeInvoice;
 
              return (
                <Button
                  key={invoiceNumber}
                  sx={{
                    ...invoiceButtonSx(isActive),
                    width: { xs: "calc(50% - 6px)", md: "auto" },
                    minWidth: { xs: "unset", md: "250px" },
                    fontSize: { xs: "12px", md: "14px" },
                  }}
                  onClick={() =>
                    navigate(`${URL_PATH.Billing}/invoice${invoiceNumber}`)
                  }
                >
                  Invoice {invoiceNumber}
                </Button>
              );
            })}
          </Box>
 
          <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
            <Paper sx={{ p: 3, borderRadius: 2 }} elevation={3}>
              {/* inner box */}
              <Box
                display="flex"
                gap={2}
                flexDirection={{ xs: "column", md: "row" }}
              >
                {/* left box */}
                <Box flex={2} display="flex" flexDirection="column" gap={2}>
                  <Box
                    display="flex"
                    gap={2}
                    flexDirection={{ xs: "column", sm: "row" }}
                  >
                    <Box width={{ xs: "100%", sm: "260px" }}>
                      <TextInputField
                        name="name"
                        label="Name"
                        required
                        inputType="alphabet"
                      />
                    </Box>
 
                    <Box width={{ xs: "100%", sm: "260px" }}>
                      <NumericField name="age" label="Age" maxlength={3}/>
                    </Box>
                  </Box>
 
                  <Box
                    display="flex"
                    gap={2}
                    flexDirection={{ xs: "column", sm: "row" }}
                  >
                    <Box width={{ xs: "100%", sm: "260px" }}>
                      <MobileField name="mobile" label="Mobile Number" required />
                    </Box>
 
                    <Box width={{ xs: "100%", sm: "260px" }}>
  <TextInputField
    name="email"
    label="Email"
    rules={{
      required: "Email is required",
      validate: (value: string) => {
        if (!/[@]/.test(value)) return "Add special character (@)";
        if (!/[.]/.test(value)) return "Add special character (.)";
        return true;
      },
    }}
  />
</Box>
 
                  </Box>
 
                  <Box sx={{ width: { xs: "100%", md: "535px" } }}>
                    <TextInputField
                      name="addressLeft"
                      label="Address"
                      inputType="textarea"
                      rows={3}
                    />
                  </Box>
                </Box>
                {/* right */}
                <Box
                  flex={1}
                  display="flex"
                  flexDirection="column"
                  gap={{ xs: 2, md: 1.5 }}
                >
                  <Box width={{ xs: "100%", sm: "260px" }}>
                    <DropdownField
                      name="doctor"
                      label="Doctor"
                      required
                      options={doctorOptions}
                      freeSolo={false}
                      placeholder="Doctor"
                    />
                  </Box>
 
                  <Box width={{ xs: "100%", sm: "260px" }}>
                  <TextInputField
                    name="reference"
                    label="New Reference"
                    inputType="alphanumeric"  
                    minLength={3}    
                    maxLength={50}    
                    rules={{
                      pattern: {
                        value: /^[A-Za-z0-9\s-]+$/,  
                        message: "Only letters, numbers, spaces, and hyphens allowed",
                      },
                    }}
                  />
                  </Box>
 
                  <Box width={{ xs: "100%", sm: "260px" }}>
                    <TextInputField
                      name="addressRight"
                      label="Address"
                      inputType="textarea"
                      rows={3}
                    />
                  </Box>
                </Box>
              </Box>
            </Paper>
 
            <Box mt={3}>
              <ItemsSection
                rows={rows}
                setRows={setRows}
                gst={gst}
                setGst={setGst}
                paymentMode={paymentMode}
                setPaymentMode={setPaymentMode}
                finalTotal={finalTotal}
              />
            </Box>
           
            {/* Bottom pay print button */}
            <Box
              sx={{
                mt: 4,
                mb: 5,
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                justifyContent: { xs: "center", md: "flex-end" },
              }}
            >
              <Button
                variant="contained"
                type="submit"
                sx={{
                  ...PayNPrint,
                  minWidth: "140px",
                }}
              >
                Save & Continue
              </Button>
              <Button
                variant="outlined"
                startIcon={<Print />}
                sx={{
                  ...PayNPrint,
                  minWidth: "140px",
                }}
                onClick={() => window.print()}
              >
                Print
              </Button>
            </Box>
          </form>
        </Box>
      )}
    </FormProvider>
  );
}
 
export default POSMaster;
 
 