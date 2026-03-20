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
    const storedInvoice = localStorage.getItem("currentNewInvoice");
    const storedRetail = localStorage.getItem("currentRetailInvoice");
    console.log("BillingTable Storage →", storedInvoice);

  if (storedInvoice) {
    const invoices = JSON.parse(storedInvoice);

    const lastInvoice = invoices[invoices.length - 1];

    setFinalAmount(lastInvoice?.totalPrice || 0);
  }

    if (storedRetail) {
      console.log("Retail Invoice Found →", storedRetail);
      const retail = JSON.parse(storedRetail);
      setFinalAmount(retail.totalPrice || 0);
    }

    // distributor settings
    const distributorSettings = localStorage.getItem("distributorSettings");

    if (distributorSettings) {
      const settings = JSON.parse(distributorSettings);

      if (
        settings.payment_method === "cash" ||
        settings.payment_method === "upi" ||
        settings.payment_method === "credit-card"
      ) {
        methods.setValue("paymentMethod", settings.payment_method);
      }
    }
  }, []);

  // central save logic
  const saveInvoice = () => {
  const storedRetail = localStorage.getItem("currentRetailInvoice");
  const storedNew = localStorage.getItem("currentNewInvoice");


 if (storedRetail) {
  const existingInvoices = JSON.parse(
    localStorage.getItem("currentInvoice") || "[]"
  );

  const retail = JSON.parse(storedRetail);


  const newInvoice = {
    invoice: retail.invoice,
    name: retail.name,
    date: retail.date,
    price: retail.totalPrice,
    status: "Paid",
  };

  const updated = [newInvoice, ...existingInvoices];

  localStorage.setItem("currentInvoice", JSON.stringify(updated));

  localStorage.removeItem("currentRetailInvoice");
}

  if (storedNew) {
    const existingInvoices = JSON.parse(
  localStorage.getItem("currentInvoice") || "[]"
);
    const invoices = JSON.parse(storedNew);
    const lastInvoice = invoices[invoices.length - 1];

    const newInvoice = {
      invoice: lastInvoice.id?.toString() || Date.now().toString(),
      name: lastInvoice.company,
      date: new Date().toLocaleDateString(),
      price: lastInvoice.totalPrice,
      status: "Paid",
    };

    const updated = [newInvoice, ...existingInvoices];

    localStorage.setItem("currentInvoice", JSON.stringify(updated));

    localStorage.removeItem("currentNewInvoice");
  }
    console.log("Saved Invoices → ", localStorage.getItem("currentInvoice"));
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

