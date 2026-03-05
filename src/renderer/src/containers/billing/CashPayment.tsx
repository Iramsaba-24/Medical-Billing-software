import React from "react";
import { Paper, Box, Button } from "@mui/material";
import TextInputField from "@/components/controlled/TextInputField";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useEffect, useState } from "react";
import RadioField from "@/components/controlled/RadioField";

type CashRow = {
  id: number;
  note: string;
  qty: string;
};

type RetailInvoiceItem = {
  total: number;
};

type Props = {
  payment: string;
};

const PaperStyle = {
  borderRadius: 2,
  p: { xs: 1, sm: 2 },
};

const btnStyle = {
  backgroundColor: "#238878",
  height: 40,
  minWidth: 150,
  color: "#fff",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#fff",
    color: "#238878",
    borderColor: "#238878",
  },
};

const radioStyle = {
  "& .MuiRadio-root": {
    color: "default.main",
    "&.Mui-checked": {
      color: "#238878",
    },
  },
};

const CashPayment = ({ payment }: Props) => {

  const paymentMethod = payment;

  const [cashRows, setCashRows] = useState<CashRow[]>([
    { id: Date.now(), note: "", qty: "" },
  ]);

  const [paymentStatus, setPaymentStatus] = useState<
    "default" | "loading" | "success"
  >("default");

  const [finalAmount, setFinalAmount] = useState<number>(0);

  useEffect(() => {
    const storedInvoice = localStorage.getItem("currentInvoice");
    const storedRetailInvoice = localStorage.getItem("currentRetailInvoice");

    if (storedInvoice) {
      const invoice = JSON.parse(storedInvoice);
      setFinalAmount(invoice.totalPrice);
    }

    if (storedRetailInvoice) {
      const retailInvoices: RetailInvoiceItem[] =
        JSON.parse(storedRetailInvoice);

      const total = retailInvoices.reduce(
        (sum, item) => sum + item.total,
        0
      );

      setFinalAmount(total);
    }
  }, []);

  const addCashRow = () => {
    setCashRows([
      ...cashRows,
      { id: Date.now(), note: "", qty: "" },
    ]);
  };

  const removeCashRow = (id: number) => {
    setCashRows(cashRows.filter((row) => row.id !== id));
  };

  const updateCashRow = (
    id: number,
    field: "note" | "qty",
    value: string
  ) => {
    setCashRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const subTotal = cashRows.reduce((sum, row) => {
    return sum + Number(row.note || 0) * Number(row.qty || 0);
  }, 0);

  const onCashPay = () => {
    setPaymentStatus("loading");

    setTimeout(() => {
      setPaymentStatus("success");

      const storedInvoice = localStorage.getItem("currentInvoice");
      const storedRetailInvoice = localStorage.getItem("currentRetailInvoice");

      if (storedInvoice) {
        const invoice = JSON.parse(storedInvoice);
        const existingSales = JSON.parse(
          localStorage.getItem("salesData") || "[]"
        );

        existingSales.push(invoice);
        localStorage.setItem("salesData", JSON.stringify(existingSales));
        localStorage.removeItem("currentInvoice");
      }

      if (storedRetailInvoice) {
        const retailInvoices = JSON.parse(storedRetailInvoice);
        const existingRetail = JSON.parse(
          localStorage.getItem("retailInvoices") || "[]"
        );

        const updatedRetail = [...existingRetail, ...retailInvoices];
        localStorage.setItem("retailInvoices", JSON.stringify(updatedRetail));
        localStorage.removeItem("currentRetailInvoice");
      }
    }, 1500);
  };

  const showPaymentStatus = () => {
    if (paymentStatus === "loading") {
      return (
        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
          <CircularProgress />
          <Box textAlign="center">
            Processing Cash Payment…
          </Box>
        </Box>
      );
    }

    if (paymentStatus === "success") {
      return (
        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
          <CheckCircleIcon
            sx={{ color: "success.main", fontSize: { xs: 44, sm: 60 } }}
          />
          <Box fontWeight={700}>Successful ₹{finalAmount}</Box>
        </Box>
      );
    }

    return null;
  };

 return (
  <Paper sx={PaperStyle}>
    <RadioField
      name="paymentMethod"
      options={[{ label: "Cash", value: "cash" }]}
      label=""
      sx={radioStyle}
    />

    <Box
      display="grid"
      gridTemplateColumns={{ xs: "1fr", md: "2fr 1fr" }}
      gap={4}
    >
      {/* LEFT SIDE - CASH ROWS */}
      <Box display="flex" flexDirection="column" gap={2}>
        {cashRows.map((row) => {
          const rowTotal =
            Number(row.note || 0) * Number(row.qty || 0);

          return (
           <Box
              key={row.id}
              display="grid"
              gridTemplateColumns={{
                xs: "1fr",
                md: "2fr 40px 1.5fr 40px 2fr 40px", 
              }}
              alignItems="center"
              gap={2}
            >
              <TextInputField
                name={`note-${row.id}`}
                label=""
                inputType="numbers"
                value={row.note}
                disabled={paymentMethod !== "cash"}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateCashRow(row.id, "note", e.target.value)
                }
              />

              <Box textAlign="center" fontWeight={600}>
                x
              </Box>

              <TextInputField
                name={`qty-${row.id}`}
                label=""
                inputType="numbers"
                value={row.qty}
                disabled={paymentMethod !== "cash"}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateCashRow(row.id, "qty", e.target.value)
                }
              />

              <Box textAlign="center" fontWeight={600}>
                =
              </Box>

              <TextInputField
                name={`total-${row.id}`}
                label=""
                value={rowTotal.toString()}
                disabled
              />
              {cashRows.length > 1 && (
  <Button
    color="error"
    onClick={() => removeCashRow(row.id)}
    disabled={paymentMethod !== "cash"}
  >
    -
  </Button>)}
            </Box>
          );
        })}

        <Box>
          <Button
            onClick={addCashRow}
            disabled={paymentMethod !== "cash"}
            sx={{ color: "#238878", fontWeight: 600 }}
          >
            + Add Row
          </Button>
        </Box>
      </Box>

      {/* RIGHT SIDE - TOTAL SECTION */}
      <Box display="flex" flexDirection="column" gap={2}>

        <Box display="flex" alignItems="center" gap={2}>
          <Box width="120px">Sub Total</Box>

          <TextInputField
            name="subTotal"
            label=""
            value={subTotal.toString()}
            disabled
          />
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          <Box width="120px">Disc. %</Box>

          <TextInputField
            name="discount"
            label=""
            inputType="numbers"
            disabled={paymentMethod !== "cash"}
          />
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          <Box width="120px" fontWeight={600}>
            Total
          </Box>

          <TextInputField
            name="total"
            label=""
            value={subTotal.toString()}
            disabled
          />
        </Box>

        <Box display="flex" justifyContent="flex-end">
          <Button
            type="button"
            variant="contained"
            onClick={onCashPay}
             sx={{
              ...btnStyle,
              width: { xs: "100%", sm: "auto" },
            }}
            disabled={paymentMethod !== "cash"}
          >
             Pay ₹{finalAmount}
          </Button>
        </Box>

        <Box textAlign="center">{showPaymentStatus()}</Box>
      </Box>
    </Box>
  </Paper>
  );
};

export default CashPayment;