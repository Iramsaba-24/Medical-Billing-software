import { useForm, FormProvider, useWatch } from "react-hook-form";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";

import CardPayment from "@/containers/billing/CardPayment";
import UpiPayment from "@/containers/billing/UpiPayment";
import CashPayment from "@/containers/billing/CashPayment";
import InvoiceTabButtons from "./InvoiceTabButtons";
import RadioField from "@/components/controlled/RadioField";

type PaymentMethods = {
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
const PaymentMethod = () => {
  const methods = useForm<PaymentMethods>({
    defaultValues: {
      paymentMethod: "credit-card",
    },
  });

  const payment = useWatch({
    control: methods.control,
    name: "paymentMethod",
  });

  const [finalAmount, setFinalAmount] = useState(0);

useEffect(() => {
  const storedInvoice = localStorage.getItem("currentInvoice");
  const storedRetail = localStorage.getItem("currentRetailInvoice");

  //  currentInvoice 
  if (storedInvoice) {
    const invoice = JSON.parse(storedInvoice);
    setFinalAmount(invoice.totalPrice || 0);

    // DistributorSettings  payment method 
    const distributorSettings = localStorage.getItem("distributorSettings");
    if (distributorSettings) {
      const settings = JSON.parse(distributorSettings);
      if (settings.payment_method) {
        methods.setValue("paymentMethod", settings.payment_method);
      }
    }
  }

if (storedRetail) {
  const retail = JSON.parse(storedRetail);
  setFinalAmount(retail.totalPrice || 0);
}
}, []);

  // central save logic
  const saveInvoice = () => {
    const storedInvoice = localStorage.getItem("currentInvoice");
    const storedRetail = localStorage.getItem("currentRetailInvoice");

    if (storedInvoice) {
      const invoice = JSON.parse(storedInvoice);

      const existingSales = JSON.parse(
        localStorage.getItem("salesData") || "[]",
      );

      existingSales.push({
        invoice: invoice.id?.toString() || Date.now().toString(),
        patient: invoice.name,
        date: invoice.date,
        price: invoice.totalPrice,
        status: "Paid",
        medicines: invoice.medicines || [],
      });

      localStorage.setItem("salesData", JSON.stringify(existingSales));
      localStorage.removeItem("currentInvoice");
    }

    if (storedRetail) {
      const retailInvoices = JSON.parse(storedRetail);

      const existingRetail = JSON.parse(
        localStorage.getItem("retailInvoices") || "[]",
      );

      const updatedRetail = [...existingRetail, ...retailInvoices];

      localStorage.setItem("retailInvoices", JSON.stringify(updatedRetail));

      localStorage.removeItem("currentRetailInvoice");
    }
  };

  return (
    <FormProvider {...methods}>

      {/* Top Buttons */}
      <InvoiceTabButtons />

      {/* Outer Box (same as old design) */}
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
      { label: "Credit / Debit Card", value: "credit-card" },
      { label: "UPI Payment", value: "upi" },
      { label: "Cash", value: "cash" },
    ]}
    label=""
    sx={radioStyle}
  />
</Box>
  {payment === "credit-card" && (
    <CardPayment finalAmount={finalAmount} onSuccess={saveInvoice} />
  )}

  {payment === "upi" && (
    <UpiPayment finalAmount={finalAmount} onSuccess={saveInvoice} />
  )}

  {payment === "cash" && (
    <CashPayment payment={payment} finalAmount={finalAmount} onSuccess={saveInvoice} />
  )}
</Box>
    </FormProvider>
  );
};

export default PaymentMethod;
