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
    batch: string;
    expiry: string;
  }[];
}

const columns = [
  { label: "Sr No.", width: "6%" },
  { label: "Particulars", width: "28%" },
  { label: "Batch No.", width: "11%" },
  { label: "Expiry", width: "10%" },
  { label: "Qty", width: "8%" },
  { label: "Rate (₹)", width: "10%" },
  { label: "Amount (₹)", width: "11%" },
  { label: "CGST", width: "8%" },
  { label: "SGST", width: "8%" }
];

interface Medicine {
  name: string;
  qty: number | string;
  amount: number;
  batch?: string;
  expiry?: string;
}

const NewInvoiceBill = () => {
  const { invoiceNo } = useParams<{ invoiceNo: string }>();
  const location = useLocation();
  const [invoice, setInvoice] = useState<Invoice | null>(
    (location.state as { invoice: Invoice })?.invoice || null
  );

  const navigate = useNavigate();
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
            "body *": {
              visibility: "hidden"
            },
            "#invoice, #invoice *": {
              visibility: "visible"
            },
            "#invoice": {
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%"
            }
          }
        }}
      />

      <Paper sx={{ p: { xs: 2, md: 4 }, mx: { xs: 0, md: 3 } }} id="invoice">
        <Typography
          textAlign="center"
          mb={2}
          sx={{
            textDecoration: "underline",
            textUnderlineOffset: 4
          }}
        >

          Tax Invoice / Cash Memo
        </Typography>

        <TableContainer>
          <Table

            sx={{
              width: "100%",
              borderCollapse: "collapse",
              border: "2px solid #000"
            }}
          >
            <TableBody>

              {/* Header */}
              <TableRow>
                <TableCell colSpan={2} sx={{ border: "2px solid #000" }}>
                  <Typography fontSize={20}>MEDIPLUS MEDICAL & GENERAL</Typography>
                  <Typography>Shinoli, Tal: Ambegaon, Dist: Pune</Typography>
                </TableCell>

                <TableCell colSpan={5} sx={{ border: "2px solid #000" }}>


                  <Typography>
                    <strong>Name:</strong> {displayName}
                  </Typography>


                  <Typography sx={{ mt: 0.5 }}>
                    <strong>Address:</strong> {displayAddress}
                  </Typography>

                  <Box
                    gap={8}
                    sx={{
                      mt: 1,
                      pt: 1,
                      borderTop: "2px solid #000",
                      display: "flex"
                    }}
                  >
                    <Typography>
                      <strong>Invoice No.:</strong> {invoice?.invoice}
                    </Typography>


                    <Typography>
                      <strong>Date:</strong> {displayDate}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>

              {/* Column headers */}
              <TableRow>

                {columns.map((col) => (
                  <TableCell

                    key={col.label}
                    sx={{
                      width: col.width,
                      border: "2px solid #000",
                      fontWeight: "bold",
                      textAlign: "center"
                    }}>
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>

              {/* Medicines */}
              {invoice?.medicines?.map((med: Medicine, index: number) => {
                const rate = Number(med.qty) > 0 ? (med.amount / Number(med.qty)) : 0;
                return (
                  <TableRow

                    key={index}
                    sx={{ "& td": { borderLeft: "2px solid #000", borderRight: "2px solid #000" } }}
                  >
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell>{med.name}</TableCell>
                    <TableCell align="center">{med.batch || "-"}</TableCell>
                    <TableCell align="center">{med.expiry || "-"}</TableCell>
                    <TableCell align="center">{med.qty}</TableCell>
                    <TableCell align="center">{rate.toFixed(2)}</TableCell>
                    <TableCell align="center">{med.amount.toFixed(2)}</TableCell>
                    <TableCell align="center">{invoiceGst}%</TableCell>


                    <TableCell align="center">-</TableCell>

                    {/* ✅ SGST = dash */}
                  </TableRow>

                );

              })}

              {/* Subtotal */}
              <TableRow>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell align="center">
                  <strong>Sub Total</strong>
                </TableCell>
                <TableCell align="center">

                  ₹ {subTotal.toFixed(2)}
                </TableCell>
              </TableRow>

              {/* CGST */}
              <TableRow>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell align="center">


                  <strong>Total CGST ({invoiceGst}%)</strong>
                </TableCell>
                <TableCell align="center">

                  ₹ {gstAmount.toFixed(2)}
                </TableCell>
              </TableRow>

              {/* SGST */}
              <TableRow>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell align="center">
                  <strong>Total SGST</strong>
                </TableCell>


                <TableCell align="center">-</TableCell>
              </TableRow>

              {/* NET */}
              <TableRow>
                <TableCell colSpan={5} sx={{ border: "2px solid #000" }}>

                  Get Well Soon.. GSTIN ABC12345SDGFJK789
                </TableCell>

                <TableCell sx={{ border: "2px solid #000" }}>
                  <Typography fontWeight={600} textAlign="right">

                    NET :
                  </Typography>
                </TableCell>

                <TableCell sx={{ border: "2px solid #000" }}>

                  {/*  NET = grandTotal */}
                  <Typography fontWeight={600}>

                    ₹ {grandTotal.toFixed(2)}
                  </Typography>
                </TableCell>
              </TableRow>

              {/* Footer */}
              <TableRow>
                <TableCell colSpan={5} sx={{ border: "2px solid #000" }}>

                  Vat Tin No. :
                  <br />

                  Drug Lic No. : MH-PZ4-115478,115479,115480
                </TableCell>

                <TableCell colSpan={2} align="center" sx={{ border: "2px solid #000" }}>
                  <Box display="flex" flexDirection="column" alignItems="center">
                    <strong>For MEDIPLUS MEDICAL & GENERAL STORE</strong>

                    <Box
                      component="img"
                      src={Sign}
                      alt="Store Sign"
                      sx={{ width: 120, py: 2 }}
                    />
                    <Typography>Pharmacist</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Buttons */}
      <Box m={3} display="flex" justifyContent="flex-end" gap={2}>
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          sx={{
            px: 4,
            textTransform: "none",
            color: "#238878",
            border: "2px solid #238878"
          }}>
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
