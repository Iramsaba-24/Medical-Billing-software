import {
  Box,
  Paper,
  Typography,
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";
import { useEffect, useState } from "react";
import { Invoice } from "@/types/invoice";
import Sign from "@/assets/Sign.svg";

const InvoiceView = () => {
  const { invoiceNo } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    const stateInvoice = location.state as Invoice | null;

    if (stateInvoice && stateInvoice.invoice === invoiceNo) {
      setInvoice({
        ...stateInvoice,
        medicines: stateInvoice.medicines.map((m) => ({
          ...m,
          amount: Number(m.amount),
        })),
      });
      return;
    }

    const stored = localStorage.getItem("selectedInvoice");
    if (stored) {
      const parsed: Invoice = JSON.parse(stored);
      if (parsed.invoice === invoiceNo) {
        setInvoice({
          ...parsed,
          medicines: parsed.medicines.map((m) => ({
            ...m,
            amount: Number(m.amount),
          })),
        });
        return;
      }
    }

    navigate(URL_PATH.Invoices, { replace: true });
  }, [invoiceNo, location.state, navigate]);

  if (!invoice) return null;

  return (
    <Paper
      sx={{
        p: 4,
        maxWidth: 1000,
        mx: "auto",
        mt: 3,
        fontSize: "0.9rem",
        "@media print": { boxShadow: "none", p: 0, mx: 0 },
      }}
    >
      {/* Header */}
      <Typography
        align="center"
        fontWeight={600}
        fontSize={18}
        mb={2}
        sx={{ textTransform: "uppercase" }}
      >
        Tax Invoice / Cash Memo
      </Typography>

      <Box display="flex" justifyContent="space-between" mb={2}>
        <Box>
          <Typography fontWeight={600} fontSize={16}>
            MEDIPLUS MEDICAL & GENERAL
          </Typography>
          <Typography variant="body2">
            Shinoli, Tal.- Ambegaon, Dist.- Pune
          </Typography>
        </Box>

        <Box textAlign="right">
          <Typography variant="body2">
            <b>Name:</b> {invoice.patient}
          </Typography>
          <Typography variant="body2">
            <b>Invoice No.:</b> {invoice.invoice}
          </Typography>
          <Typography variant="body2">
            <b>Date:</b> {invoice.date}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Table
        size="small"
        sx={{
          border: "1px solid #000",
          borderCollapse: "collapse",
          "& th, & td": { border: "1px solid #000", padding: "6px 8px" },
          fontSize: "0.9rem",
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell align="center"><b>Sr. No</b></TableCell>
            <TableCell><b>Particulars</b></TableCell>
            <TableCell align="center"><b>Batch No.</b></TableCell>
            <TableCell align="center"><b>Expiry</b></TableCell>
            <TableCell align="center"><b>Quantity</b></TableCell>
            <TableCell align="right"><b>Amount</b></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {invoice.medicines.map((med, index) => (
            <TableRow key={index}>
              <TableCell align="center">{index + 1}</TableCell>
              <TableCell>{med.name}</TableCell>
              <TableCell align="center">{med.batch}</TableCell>
              <TableCell align="center">{med.expiry}</TableCell>
              <TableCell align="center">{med.qty}</TableCell>
              <TableCell align="right">₹ {Number(med.amount).toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Box display="flex" justifyContent="flex-end" mt={1}>
        <Typography fontWeight={700} fontSize={16}>
          NET : ₹ {Number(invoice.price).toFixed(2)}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box display="flex" justifyContent="space-between" flexWrap="wrap">
        <Box maxWidth={600}>
          <Typography variant="caption">
            Get Well Soon.. GSTIN ABC12345SDGFJK789 <br />
            <Divider sx={{ my: 2 }} />
            Vat Tin No.: <br />
            Drug Lic No. : MH-PZ4-115478,115479,115480 <br />
            I/We hereby certify that my/our registration certificate under the Maharashtra Value Added Tax Act 2002
            is in force on the date on the which sales of the goods specified in this tax invoice is made by me/us and
            that the transaction of the sale covered by this tax invoice has been effected by me/us and it shall be 
            accounted for in the turnover of sales while filling of return and the due tax, if any, payble on the sales
            has been paid or shall be paid.
          </Typography>
        </Box>

        <Box textAlign="center" sx={{ mt: { xs: 2, md: 6 } }}>
          <Typography variant="body2">For MEDIPLUS MEDICAL & GENERAL STORE</Typography>
          <Box
            component="img"
            src={Sign}
            alt="Store Logo"
            sx={{
              width: { xs: 80, md: 120 },
              height: 'auto',
            }}
          />
          <Typography >Pharmacist</Typography>
        </Box>
      </Box>

      <Box
        mt={4}
        display="flex"
        justifyContent="flex-end"
        gap={2}
        sx={{ "@media print": { display: "none" } }}
      >
        <Button
          variant="outlined"
          onClick={() => navigate(URL_PATH.Invoices)}
          sx={{
            backgroundColor: "#fff",
            color: "#238878",
            border: "2px solid #238878",
            "&:hover": { backgroundColor: "#238878", color: "#fff" },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => window.print()}
          sx={{
            backgroundColor: "#238878",
            color: "#fff",
            border: "2px solid #238878",
            textTransform: "none",
            "&:hover": { backgroundColor: "#fff", color: "#238878", border: "2px solid #238878" },
          }}
        >
          Print
        </Button>
      </Box>
    </Paper>
  );
};

export default InvoiceView;
