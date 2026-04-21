import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import CardPayment from "@/containers/billing/CardPayment";
import UpiPayment from "@/containers/billing/UpiPayment";
import CashPayment from "@/containers/billing/CashPayment";
import InvoiceTabButtons from "./InvoiceTabButtons";
import RadioField from "@/components/controlled/RadioField";
import { useNavigate, useLocation } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { updatePaymentStatus, createSingleRetailInvoiceItem, updateRetailInvoice, getRetailInvoiceById } from "@/service/retailInvoiceService";
 
type PaymentMethods = {
  paymentMethod: "debitCard" | "upi" | "cash";
 
  cardLastFour?: string;
 
  cardholderName?: string;
 
  Cvv?: string;
 
  upiId?: string;
};
 
type PaymentState = {
  invoiceId: number;
  rows: {
    medicineId: string;
    medicineName?: string;
     strength?: string;        
  companyName?: string;
    expiryDate?: string;
    quantity: number | "";
    price: number | "";
  }[];
  totalFromInvoice: number;
  customerName?: string;
  doctorName?: string;
    usedPoints?: number;  
};
const radioStyle = {
  "& .MuiRadio-root": {
    color: "default.main",
 
    "&.Mui-checked": {
      color: "#238878",
    },
  },
};
 
const PaymentMethod = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const methods = useForm<PaymentMethods>({
 
    defaultValues: {
      paymentMethod: "debitCard",
    },
    mode: "onChange",
  });
 
  const payment = useWatch({
    control: methods.control,
 
    name: "paymentMethod",
  });
 
  const [finalAmount, setFinalAmount] = useState(0);
 
 
 
  useEffect(() => {
    const stateAmount = (location.state as { totalFromInvoice?: number })?.totalFromInvoice;
 
    if (stateAmount && stateAmount > 0) {
      setFinalAmount(stateAmount);
    }
  }, [location.state]);
 
 
 
 
  const saveInvoice = async () => {
    console.log("SAVE INVOICE CALLED");
    try {
      const state = location.state as PaymentState & { flow?: string };
 
      if (!state?.invoiceId) {
        console.error("Missing invoiceId");
        return;
      }
 
      // FLOW CHECK
      if (state.flow === "retail") {
        if (!state.rows) {
          console.error("Missing rows for retail");
          return;
        }
 
const totalItems = state.rows.length || 1;
 
const discountPerItem = Number(
  ((state.usedPoints || 0) / totalItems).toFixed(2)
);
 
 
        // Retail Items Save
        for (const r of state.rows) {
         await createSingleRetailInvoiceItem({
  retailInvoiceId: state.invoiceId,
  medicineId: Number(r.medicineId),
  quantity: Number(r.quantity),
  price: Number(r.price),
 gstPercent: Number(location.state?.gstPercent || 0),
discount: discountPerItem,
  strength: r.strength,            
  companyName: r.companyName,      
});
        }
 
const gstPercent = Number(location.state?.gstPercent || 0);
const usedPoints = Number(location.state?.usedPoints || 0);
 
const amountAfterDiscount = state.totalFromInvoice - usedPoints;
const gstAmount = (amountAfterDiscount * gstPercent) / 100;
 
 
        const invoiceData = await getRetailInvoiceById(state.invoiceId);
        await updateRetailInvoice(state.invoiceId, {
          userId: invoiceData.userId,
          customerId: invoiceData.customerId,
          invoiceType: invoiceData.invoiceType,
          invoiceDate: invoiceData.invoiceDate,
          totalAmount: state.totalFromInvoice,
           totalGST: gstAmount,
         totalDiscount: usedPoints,
         gstPercent: location.state?.gstPercent || 0,
          medipointsEarned: invoiceData.medipointsEarned,
           
          paymentStatus: "Paid",
        });
 
        navigate(`${URL_PATH.InvoiceView}/${state.invoiceId}`, {
 
          state: {
  usedPoints: location.state?.usedPoints,
    gstPercent: location.state?.gstPercent,  
  invoice: {
    invoice: String(state.invoiceId),
    name: state.customerName || "",
    doctor: state.doctorName || "",
    address: "",
    date: new Date().toLocaleDateString("en-GB"),
    medicines: state.rows.map((r) => ({
      name: r.medicineName || String(r.medicineId),
      qty: Number(r.quantity),
      amount: Number(r.quantity) * Number(r.price),
      batch: "",
      expiry: r.expiryDate
        ? new Date(r.expiryDate).toLocaleDateString("en-GB")
        : "",
    })),
    totalAmount: state.totalFromInvoice,
  },
}
        });
 
      } else if (state.flow === "new") {
        //  DISTRIBUTOR FLOW
        await updatePaymentStatus(state.invoiceId, "Paid");
        navigate(`/billing/invoice-bill/${state.invoiceId}`, {
          state: {
            invoiceId: state.invoiceId,
            totalAmount: state.totalFromInvoice,
          },
        });
 
      }
    } catch (error) {
      console.error("Payment save failed", error);
    }
  };
 
 
  return (
    <FormProvider {...methods}>
      <InvoiceTabButtons />
 
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
        <Box display="flex" gap={2} mb={1}>
          <RadioField
            name="paymentMethod"
            options={[
              { label: "Credit / Debit Card", value: "debitCard" },
 
              { label: "UPI Payment", value: "upi" },
 
              { label: "Cash", value: "cash" },
            ]}
            label=""
            sx={radioStyle}
          />
        </Box>
 
        {payment === "debitCard" && (
          <CardPayment finalAmount={finalAmount} onSuccess={saveInvoice} />
        )}
 
        {payment === "upi" && (
          <UpiPayment finalAmount={finalAmount} onSuccess={saveInvoice} />
        )}
 
        {payment === "cash" && (
          <CashPayment
            payment={payment}
            finalAmount={finalAmount}
            onSuccess={saveInvoice}
          />
        )}
      </Box>
    </FormProvider>
  );
};
 
export default PaymentMethod;
 
 