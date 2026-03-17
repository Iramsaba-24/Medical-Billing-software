// import { useForm, FormProvider, useWatch } from "react-hook-form";
// import { Box } from "@mui/material";
// import { useEffect, useState } from "react";

// import CardPayment from "@/containers/billing/CardPayment";
// import UpiPayment from "@/containers/billing/UpiPayment";
// import CashPayment from "@/containers/billing/CashPayment";
// import InvoiceTabButtons from "./InvoiceTabButtons";
// import RadioField from "@/components/controlled/RadioField";

// type PaymentMethods = {
//   paymentMethod: "credit-card" | "upi" | "cash";
//   CardNumber?: string;
//   CardHolderName?: string;
//   Cvv?: string;
//   UpiId?: string;
// };
// const radioStyle = {
//   "& .MuiRadio-root": {
//     color: "default.main",
//     "&.Mui-checked": {
//       color: "#238878",
//     },
//   },
// };
// const PaymentMethod = () => {
//   const methods = useForm<PaymentMethods>({
//     defaultValues: {
//       paymentMethod: "credit-card",
//     },
//   });

//   const payment = useWatch({
//     control: methods.control,
//     name: "paymentMethod",
//   });

//   const [finalAmount, setFinalAmount] = useState(0);

//   useEffect(() => {
//     const storedInvoice = localStorage.getItem("currentNewInvoice");
//     const storedRetail = localStorage.getItem("currentRetailInvoice");

//   if (storedInvoice) {
//     const invoices = JSON.parse(storedInvoice);

//     const lastInvoice = invoices[invoices.length - 1];

//     setFinalAmount(lastInvoice?.totalPrice || 0);
//   }

//     if (storedRetail) {
//       const retail = JSON.parse(storedRetail);
//       setFinalAmount(retail.totalPrice || 0);
//     }

//     // distributor settings
//     const distributorSettings = localStorage.getItem("distributorSettings");

//     if (distributorSettings) {
//       const settings = JSON.parse(distributorSettings);

//       if (
//         settings.payment_method === "cash" ||
//         settings.payment_method === "upi" ||
//         settings.payment_method === "credit-card"
//       ) {
//         methods.setValue("paymentMethod", settings.payment_method);
//       }
//     }
//   }, []);

//   // central save logic
//   const saveInvoice = () => {
//     const storedInvoice = localStorage.getItem("currentNewInvoice");
//     const storedRetail = localStorage.getItem("currentRetailInvoice");

//     if (storedInvoice) {
//       const invoice = JSON.parse(storedInvoice);

//       const existingSales = JSON.parse(
//         localStorage.getItem("salesData") || "[]",
//       );

//       existingSales.push({
//         invoice: invoice.id?.toString() || Date.now().toString(),
//         patient: invoice.name,
//         date: invoice.date,
//         price: invoice.totalPrice,
//         status: "Paid",
//         medicines: invoice.medicines || [],
//       });

//       localStorage.setItem("salesData", JSON.stringify(existingSales));
//       localStorage.removeItem("currentNewInvoice");
//     }

//     if (storedRetail) {
//       const retailInvoices = JSON.parse(storedRetail);

//       const existingRetail = JSON.parse(
//         localStorage.getItem("retailInvoices") || "[]",
//       );

//       const updatedRetail = [...existingRetail, ...retailInvoices];

//       localStorage.setItem("retailInvoices", JSON.stringify(updatedRetail));

//       localStorage.removeItem("currentRetailInvoice");
//     }
//   };

//   return (
//     <FormProvider {...methods}>
//       {/* Top Buttons */}
//       <InvoiceTabButtons />

//       {/* Outer Box (same as old design) */}
//       <Box
//         display="flex"
//         flexDirection="column"
//         sx={{
//           border: "1px solid #ccc",
//           gap: { xs: 2, sm: 3 },
//           backgroundColor: "#fff",
//           p: { xs: 2, sm: 3 },
//         }}
//       >
//         <Box display="flex" gap={2} mb={1}>
//           <RadioField
//             name="paymentMethod"
//             options={[
//               { label: "Credit / Debit Card", value: "credit-card" },
//               { label: "UPI Payment", value: "upi" },
//               { label: "Cash", value: "cash" },
//             ]}
//             label=""
//             sx={radioStyle}
//           />
//         </Box>
//         {payment === "credit-card" && (
//           <CardPayment finalAmount={finalAmount} onSuccess={saveInvoice} />
//         )}

//         {payment === "upi" && (
//           <UpiPayment finalAmount={finalAmount} onSuccess={saveInvoice} />
//         )}

//         {payment === "cash" && (
//           <CashPayment
//             payment={payment}
//             finalAmount={finalAmount}
//             onSuccess={saveInvoice}
//           />
//         )}
//       </Box>
//     </FormProvider>
//   );
// };

// export default PaymentMethod;
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";

import CardPayment from "@/containers/billing/CardPayment";
import UpiPayment from "@/containers/billing/UpiPayment";
import CashPayment from "@/containers/billing/CashPayment";
import InvoiceTabButtons from "./InvoiceTabButtons";
import RadioField from "@/components/controlled/RadioField";

import { useNavigate, useLocation } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";

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

  // PRIORITY 1: navigate state se direct amount (sabse accurate)

  const stateAmount = (location.state as { totalFromInvoice?: number })?.totalFromInvoice;

  if (stateAmount && stateAmount > 0) {

    setFinalAmount(stateAmount);

  } else {

    // PRIORITY 2: localStorage fallback

    const storedRetail = localStorage.getItem("currentRetailInvoice");

    const storedInvoice = localStorage.getItem("currentNewInvoice");
 
    if (storedRetail) {

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
        date: retail.date,
        price: retail.totalPrice,
        status: "Paid",
      };

      const updated = [newInvoice, ...existingInvoices];
      localStorage.setItem("currentInvoice", JSON.stringify(updated));
      localStorage.removeItem("currentRetailInvoice");

      console.log("Retail Saved Invoices → ", updated);
      navigate(URL_PATH.InvoiceView);
      return;
    }

    // New Invoice Flow - COMPLETE DATA SAVE & PASS
    if (storedNew) {
      const existingInvoices = JSON.parse(
        localStorage.getItem("currentInvoice") || "[]"
      );

      const invoices = JSON.parse(storedNew);
      const lastInvoice = invoices[invoices.length - 1];

      // Summary साठी currentInvoice मध्ये save
      const summaryInvoice = {
        invoice: lastInvoice.id?.toString() || Date.now().toString(),
        name: lastInvoice.company,
        date: new Date().toLocaleDateString(),
        price: lastInvoice.totalPrice,
        status: "Paid",
      };

      const updated = [summaryInvoice, ...existingInvoices];
      localStorage.setItem("currentInvoice", JSON.stringify(updated));

      

      // COMPLETE BILL DATA LOCALSTORAGE मध्ये save
      localStorage.setItem("currentInvoiceBill", JSON.stringify(lastInvoice));
      
      localStorage.removeItem("currentNewInvoice");

      console.log("Complete Invoice Saved → ", lastInvoice);

      // COMPLETE DATA सोबत navigate
      navigate(URL_PATH.NewInvoiceBill, {
        state: { invoice: lastInvoice }
      });
    }
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