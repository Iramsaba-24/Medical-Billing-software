// export default PaymentMethod;import { useForm, FormProvider, useWatch } from "react-hook-form";
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
  const navigate = useNavigate();
  const location = useLocation();
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
    const stateAmount = (location.state as { totalFromInvoice?: number })
      ?.totalFromInvoice;
    if (stateAmount && stateAmount > 0) {
      setFinalAmount(stateAmount);
    } else {
      const storedRetail = localStorage.getItem("currentRetailInvoice");
      const storedInvoice = localStorage.getItem("currentNewInvoice");
      if (storedRetail) {
        console.log("Retail Invoice Found →", storedRetail);

        const retail = JSON.parse(storedRetail);

        setFinalAmount(retail.totalPrice || 0);
      } else if (storedInvoice) {
        const invoices = JSON.parse(storedInvoice);
        const lastInvoice = invoices[invoices.length - 1];
        setFinalAmount(lastInvoice?.totalPrice || 0);
      }
    }

    // distributor default payment method
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
  }, [location.state, methods]);

  const saveInvoice = () => {
    const storedRetail = localStorage.getItem("currentRetailInvoice");
    const storedNew = localStorage.getItem("currentNewInvoice");

    // Retail Flow
    if (storedRetail) {
      const existingInvoices = JSON.parse(
        localStorage.getItem("currentInvoice") || "[]"
      );
      const retail = JSON.parse(storedRetail);

      const newInvoice = {
        invoice: retail.invoice,
        name: retail.name,
        doctor: retail.doctor,
        address: retail.address,
        doctorAddress: retail.doctorAddress,
        date: new Date().toLocaleDateString("en-GB"),
        price: retail.totalPrice,
        status: "Paid",
        medicines: retail.medicines,
        gst: retail.gst,
        gstAmount: retail.gstAmount,
        subTotal: retail.subTotal,
        totalPrice: retail.totalPrice,
      };

      const updated = [newInvoice, ...existingInvoices];
      localStorage.setItem("currentInvoice", JSON.stringify(updated));
      localStorage.removeItem("currentRetailInvoice");
      console.log("Retail Saved Invoices → ", updated);
      navigate(`${URL_PATH.InvoiceView}/${newInvoice.invoice}`, {
        state: { invoice: newInvoice },
      });
      return;
    }

    // New Invoice Flow
    if (storedNew) {
      const existingInvoices = JSON.parse(
        localStorage.getItem("currentInvoice") || "[]"
      );
      const invoices = JSON.parse(storedNew);
      const lastInvoice = invoices[invoices.length - 1];

      const summaryInvoice = {
        invoice: lastInvoice.id?.toString() || Date.now().toString(),
        name: lastInvoice.company,
        date: new Date().toLocaleDateString(),
        price: lastInvoice.totalPrice,
        status: "Paid",
        medicines: lastInvoice.medicines,
        totalPrice: lastInvoice.totalPrice,
      };

      const updated = [summaryInvoice, ...existingInvoices];
      localStorage.setItem("currentInvoice", JSON.stringify(updated));

      localStorage.setItem("currentInvoiceBill", JSON.stringify(lastInvoice));
      localStorage.removeItem("currentNewInvoice");
      console.log("Complete Invoice Saved → ", lastInvoice);

      navigate(URL_PATH.NewInvoiceBill, {
        state: { invoice: lastInvoice },
      });
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

      {/* Outer Box */}
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
