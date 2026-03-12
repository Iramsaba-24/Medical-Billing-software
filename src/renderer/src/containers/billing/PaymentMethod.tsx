
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import CardPayment from "@/containers/billing/CardPayment";
import UpiPayment from "@/containers/billing/UpiPayment";
import { URL_PATH } from "@/constants/UrlPath";
import { useNavigate, useLocation } from "react-router-dom";
import CashPayment from "@/containers/billing/CashPayment";
import RadioField from "@/components/controlled/RadioField";

export type PaymentMethods = {
  paymentMethod: "credit-card" | "upi" | "cash";
  CardNumber?: string;
  CardHolderName?: string;
  Cvv?: string;
  UpiId?: string;
};
const radioStyle = {
  "& .MuiRadio-root": {
    color: "default.main",
    "&.Mui-checked": {
      color: "#238878",
    },
  },
};

export type RetailInvoiceItem = {
  total: number;
};

const PaymentMethod = () => {
  const methods = useForm<PaymentMethods>({
    defaultValues: { paymentMethod: "credit-card" },
  });

  const payment = useWatch({
    control: methods.control,
    name: "paymentMethod",
  });

  const [finalAmount, setFinalAmount] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"new" | "retail">("new");

  const navigate = useNavigate();
  const location = useLocation();
useEffect(() => {

  const storedSettings = localStorage.getItem("distributorSettings");

  if (activeTab === "retail" && storedSettings) {

    const settings = JSON.parse(storedSettings);

    const method = settings.payment_method;

    if (method === "UPI") {
      methods.setValue("paymentMethod", "upi");
    } 
    else if (method === "Cash") {
      methods.setValue("paymentMethod", "cash");
    } 
    else if (method === "Credit") {
      methods.setValue("paymentMethod", "credit-card");
    }

  } 
  else if (activeTab === "new") {

    methods.setValue("paymentMethod", "credit-card");

  }
}, [activeTab]);
useEffect(() => {

  if (location.pathname === URL_PATH.RetailInvoice) {
    setActiveTab("retail");
  }

  if (location.pathname === URL_PATH.Billing) {
    setActiveTab("new");
  }

}, [location.pathname]);

  useEffect(() => {
    const storedInvoice = localStorage.getItem("currentInvoice");
    const storedRetailInvoice = localStorage.getItem("currentRetailInvoice");

    if (activeTab === "retail" && storedRetailInvoice) {
      const retailInvoices: RetailInvoiceItem[] = JSON.parse(storedRetailInvoice);
      const total = retailInvoices.reduce((sum, item) => sum + item.total, 0);
      setFinalAmount(total);
    } else if (storedInvoice) {
      const invoice = JSON.parse(storedInvoice);
      setFinalAmount(invoice.totalPrice);
    } else {
      setFinalAmount(0);
    }
  }, [activeTab]); 

  return (
    <FormProvider {...methods}>
      <form noValidate>
        {/* Invoice type buttons */}
        <Button
          onClick={() => {
            setActiveTab("new");
            if (location.pathname !== URL_PATH.Billing) navigate(URL_PATH.Billing);
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

        <Button
          onClick={() => {
            setActiveTab("retail");
            if (location.pathname !== URL_PATH.RetailInvoice)
              navigate(URL_PATH.RetailInvoice);
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

        <Box
          display="flex"
          flexDirection="column"
          sx={{
            border: "1px solid #ccc",
            gap: { xs: 2, sm: 3 },
            backgroundColor: "#fff",
            p: { xs: 2, sm: 3 },
          }}
        >
                    <Box>
  <RadioField
    name="paymentMethod"
    label=""
    options={[
      { label: "Debit/Credit Card", value: "credit-card" },
      { label: "UPI", value: "upi" },
      { label: "Cash", value: "cash" },
    ]}
    row
    sx={radioStyle}
  />
</Box>

          {/* Pass finalAmount & payment prop */}
{payment === "credit-card" && (
    <CardPayment finalAmount={finalAmount} />
  )}

  {payment === "upi" && (
    <UpiPayment finalAmount={finalAmount} />
  )}

  {payment === "cash" && (
    <CashPayment payment={payment} />
  )}
        </Box>
      </form>
    </FormProvider>
  );
};

export default PaymentMethod;