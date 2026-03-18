import { useState } from "react";
import { Paper, Box, Button, TextField, Typography } from "@mui/material";
import TextInputField from "@/components/controlled/TextInputField";

type CashRow = {
  note: number;
  qty: string;
};

const PaperStyle = {
  borderRadius: 2,
  p: { xs: 1, sm: 2 },
};

const noteValues = [500, 200, 100, 50, 20, 10];

const btnStyle = {
  backgroundColor: "#238878",
  height: 40,
  minWidth: 150,
  color: "#fff",
  textTransform: "none",
};

type Props = {
  payment: "credit-card" | "upi" | "cash";
  finalAmount: number;
  onSuccess: () => void;
};

const CashPayment = ({ payment, finalAmount}: Props) => {
  const paymentMethod = payment;

  const [cashRows, setCashRows] = useState<CashRow[]>(
    noteValues.map((note) => ({
      note,
      qty: "",
    })),
  );

  const updateCashRow = (index: number, value: string) => {
    setCashRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, qty: value } : row)),
    );
  };

  const subTotal = cashRows.reduce((sum, row) => {
    return sum + Number(row.note) * Number(row.qty || 0);
  }, 0);
  const isAmountMatched = subTotal === finalAmount;
  const onCashPay = () => {
    const storedInvoice = localStorage.getItem("currentInvoice");
    const storedRetailInvoice = localStorage.getItem("currentRetailInvoice");

    if (storedInvoice) {
      const invoice = JSON.parse(storedInvoice);
      const existingSales = JSON.parse(
        localStorage.getItem("salesData") || "[]",
      );

      existingSales.push(invoice);
      localStorage.setItem("salesData", JSON.stringify(existingSales));
      localStorage.removeItem("currentInvoice");
    }

    if (storedRetailInvoice) {
      const retailInvoices = JSON.parse(storedRetailInvoice);
      const existingRetail = JSON.parse(
        localStorage.getItem("retailInvoices") || "[]",
      );

      const updatedRetail = [...existingRetail, ...retailInvoices];
      localStorage.setItem("retailInvoices", JSON.stringify(updatedRetail));
      localStorage.removeItem("currentRetailInvoice");
    }
  };

  return (
    <Paper sx={PaperStyle}>
      <Typography 
      fontSize={{xs:16, md:18}} 
      mb={2}
      fontWeight={600}>
        Cash Payment
      </Typography>

      <Box display="flex" flexDirection="column" gap={3}>
        {cashRows.map((row, index) => {
          const rowTotal = Number(row.note) * Number(row.qty || 0);

          return (
            <Box
              key={index}
              display="grid"
              gridTemplateColumns={{
                xs: "1fr",
                sm: "1fr 1fr 1fr",
                md: "2fr 40px 1.5fr 40px 2fr",
              }}
              alignItems="center"
              gap={2}
            >
              <TextField
                name={`note-${index}`}
                label=""
                sx={{ mb: 3 }}
                type="number"
                value={row.note}
                disabled
              />

              <Box textAlign="center" mb={2} fontWeight={600}>
                x
              </Box>

              <TextField
                fullWidth
                label="Qty"
                type="number"
                value={row.qty}
                disabled={paymentMethod !== "cash"}
                onChange={(e) => updateCashRow(index, e.target.value)}
                inputProps={{ min: 0 }}
                sx={{ mb: 3 }}
              />

              <Box textAlign="center" mb={2} fontWeight={600}>
                =
              </Box>

              <TextField
                fullWidth
                value={rowTotal || ""}
                sx={{ mb: 3 }}
                disabled
              />
            </Box>
          );
        })}

        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          maxWidth={{ xs: "100%", sm: 400 }}
          ml={{ xs: 0, sm: "auto" }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Box width="120px">Total Amount</Box>

            <TextField fullWidth value={subTotal} disabled />
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <Box width="120px" fontWeight={600}>
              Total
            </Box>

            <TextInputField
              name="total"
              label=""
              value={finalAmount.toString()}
              disabled
              sx={{ width: "100%" }}
            />
          </Box>

          <Box display="flex" justifyContent="flex-end">
            {isAmountMatched && paymentMethod === "cash" && (
              <Button
                type="button"
                variant="contained"
                onClick={onCashPay}
                sx={{
              ...btnStyle,
              width: { xs: "100%", sm: "auto" },
            }}
              >
                Pay ₹{finalAmount}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default CashPayment;
