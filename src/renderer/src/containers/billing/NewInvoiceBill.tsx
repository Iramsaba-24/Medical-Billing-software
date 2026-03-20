import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Box,
  TableRow,
  Typography,
  Button,
  GlobalStyles
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import Sign from "@/assets/Sign.svg";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export interface Invoice {
  name: string;
  company: string;
  doctor: string;
  address: string;
  invoice: string;
  date: string;
  gst?: number;
  totalPrice?: number;
  medicines: {
    name: string;
    qty: string;
    amount: number;
    hsn: string;
    expiry: string;
  }[];
}

const columns = [
  { label: "Sr No.", width: "6%" },
  { label: "Particulars", width: "30%" },
  { label: "HSN Number", width: "12%" },
  { label: "Expiry", width: "10%" },
  { label: "Qty", width: "10%" },
  { label: "Rate (₹)", width: "12%" },
  { label: "CGST", width: "10%" },
  { label: "SGST", width: "10%" }
];

interface Medicine {
  name: string;
  qty: number | string;
  amount: number;
  hsn?: string;
  expiry?: string;
}

const NewInvoiceBill = () => {

  const { invoiceNo } = useParams<{ invoiceNo: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState<Invoice | null>(
    (location.state as { invoice: Invoice })?.invoice || null
  );

  useEffect(() => {
    if (!invoice && invoiceNo) {
      const savedInvoices = JSON.parse(localStorage.getItem("invoices") || "[]");
      const found = savedInvoices.find((inv: Invoice) => inv.invoice === invoiceNo);
      if (found) setInvoice(found);
      else navigate(-1);
    }
  }, [invoice, invoiceNo, navigate]);

  const subTotal =
    invoice?.medicines?.reduce((sum, med) => sum + Number(med.amount), 0) || 0;

  const invoiceGst = invoice?.gst ?? 0;

  const gstAmount = (subTotal * invoiceGst) / 100;

  const grandTotal = invoice?.totalPrice ?? (subTotal + gstAmount);

  const displayDate = invoice?.date || new Date().toLocaleDateString();
  const displayName = invoice?.company || invoice?.name || "-";
  const displayAddress = invoice?.address || "-";

  return (
    <>
      <GlobalStyles
        styles={{
          "@media print": {
            "body *": { visibility: "hidden" },
            "#invoice, #invoice *": { visibility: "visible" },
            "#invoice": {
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%"
            }
          }
        }}
      />

      <Paper sx={{ p: 4, mx: 3 }} id="invoice">

        <Typography
          textAlign="center"
          mb={2}
          sx={{ textDecoration: "underline", textUnderlineOffset: 4 }}
        >
          Distributor Tax Invoice / Cash Memo
        </Typography>

        <TableContainer>
          <Table
            sx={{
              width: "100%",
              borderCollapse: "collapse",
              border: "2px solid #000",
              "& td, & th": { border: "1px solid #000" }
            }}
          >
            <TableBody>

              {/* Header */}
              <TableRow>
                <TableCell colSpan={4}>
                  <Typography fontSize={20} fontWeight={600}>
                    MEDIPLUS MEDICAL & GENERAL
                  </Typography>
                  <Typography>
                    Shinoli, Tal: Ambegaon, Dist: Pune
                  </Typography>
                </TableCell>

                <TableCell colSpan={4}>
                  <Typography>
                    <strong>Name:</strong> {displayName}
                  </Typography>

                  <Typography sx={{ mt: 1 }}>
                    <strong>Address:</strong> {displayAddress}
                  </Typography>

                  <Box
  sx={{
    mt: 1,
    pt: 1,
    borderTop: "1px solid #000",
    display: "flex",
    justifyContent: "space-between"
  }}
>
  <Box>
    <Typography>
      <strong>Invoice No:</strong> {invoice?.invoice}
    </Typography>

    <Typography>
      <strong>GSTIN:</strong> ABC12345SDGFJK789
    </Typography>
  </Box>

  <Typography>
    <strong>Date:</strong> {displayDate}
  </Typography>
</Box>
                </TableCell>
              </TableRow>

              {/* Column Headers */}
              <TableRow>
                {columns.map((col) => (
                  <TableCell
                    key={col.label}
                    sx={{
                      width: col.width,
                      fontWeight: "bold",
                      textAlign: "center"
                    }}
                  >
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>

              {/* Medicines */}
              {invoice?.medicines?.map((med: Medicine, index: number) => {

                const rate =
                  Number(med.qty) > 0
                    ? med.amount / Number(med.qty)
                    : 0;

                return (
                  <TableRow key={index}>

                    <TableCell align="center">{index + 1}</TableCell>

                    <TableCell>{med.name}</TableCell>

                    <TableCell align="center">
                      {med.hsn || "-"}
                    </TableCell>

                    <TableCell align="center">
                      {med.expiry || "-"}
                    </TableCell>

                    <TableCell align="center">
                      {med.qty}
                    </TableCell>

                    <TableCell align="center">
                      {rate.toFixed(2)}
                    </TableCell>

                    <TableCell align="center">
                      {invoiceGst}%
                    </TableCell>

                    <TableCell align="center">
                      {invoiceGst}%
                    </TableCell>

                  </TableRow>
                );
              })}

              {/* SubTotal */}
              <TableRow>
                <TableCell colSpan={6}></TableCell>
                <TableCell>
                  <strong>Sub Total</strong>
                </TableCell>
                <TableCell>
                  ₹ {subTotal.toFixed(2)}
                </TableCell>
              </TableRow>

              {/* CGST */}
              {/* <TableRow>
                <TableCell colSpan={6}></TableCell>
                <TableCell colSpan={2}> */}
                  {/* <strong>Total CGST ({invoiceGst}%)</strong> */}
                {/* </TableCell> */}
              {/* </TableRow> */}

              {/* SGST */}
              <TableRow>
                <TableCell colSpan={6}></TableCell>
                <TableCell>
                  <strong>Total GST ({invoiceGst}%)</strong>
                </TableCell>
                <TableCell>
                  ₹ {gstAmount.toFixed(2)}
                </TableCell>
              </TableRow>

              {/* NET */}
              <TableRow>

                <TableCell colSpan={5}>
                  Get Well Soon.. GSTIN ABC12345SDGFJK789
                </TableCell>

                <TableCell align="right">
                  <strong>NET :</strong>
                </TableCell>

                <TableCell colSpan={2}>
                  <strong>₹ {grandTotal.toFixed(2)}</strong>
                </TableCell>

              </TableRow>

              {/* Footer */}
              <TableRow>

                <TableCell colSpan={5}>
                  Vat Tin No :
                  <br />
                  Drug Lic No :
                  MH-PZ4-115478,115479,115480
                </TableCell>

                <TableCell colSpan={3} align="center">

                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >

                    <strong>
                      For MEDIPLUS MEDICAL & GENERAL STORE
                    </strong>

                    <Box
                      component="img"
                      src={Sign}
                      sx={{ width: 120, py: 2 }}
                    />

                    <Typography>
                      Pharmacist
                    </Typography>

                  </Box>

                </TableCell>

              </TableRow>

            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Box m={3} display="flex" justifyContent="flex-end" gap={2}>

        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          sx={{
            px: 4,
            textTransform: "none",
            color: "#238878",
            border: "2px solid #238878"
          }}
        >
          Cancel
        </Button>

        <Button
          startIcon={<PrintIcon />}
          variant="contained"
          onClick={() => window.print()}
          sx={{
            px: 4,
            backgroundColor: "#238878",
            border: "2px solid #238878",
            textTransform: "none"
          }}
        >
          Print
        </Button>

      </Box>
    </>
  );
};

export default NewInvoiceBill;
