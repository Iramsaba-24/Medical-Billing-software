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
  GlobalStyles,
  useTheme,
  useMediaQuery
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import Sign from "@/assets/Sign.svg";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { PharmacyFormValues } from "@/containers/setting/PharmacyProfile";
export interface Invoice {
  name: string;
  company: string;
  doctor: string;
  address: string;
  invoice: string;
  date: string;
  gst?: number;
  totalAmount?: number;
  gstIn?: string;
  medicines: {
    name: string;
      quantity: string;  
        mrp?: number; 
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
 quantity: number | string;
  amount: number;
  hsn?: string;
  expiry?: string;
   mrp?: number;
}

const NewInvoiceBill = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
  const grandTotal = invoice?.totalAmount ?? (subTotal + gstAmount);

  const displayDate = invoice?.date || new Date().toLocaleDateString();
  const displayName = invoice?.company || invoice?.name || "-";
  const displayAddress = invoice?.address || "-";

  // fettch pharmacy name and address through the pharmacy setting
const [pharmacyData, setPharmacyData] = useState<PharmacyFormValues | null>(null);

useEffect(() => {
  const stored = localStorage.getItem("pharmacyProfile");
  if (stored) {
    setPharmacyData(JSON.parse(stored) as PharmacyFormValues);
  }
}, []);

const pharmacyName = pharmacyData?.pharmacyName || "Your Pharmacy";
const pharmacyAddress = pharmacyData?.address || "-";

  // MOBILE VIEW 
  // CGST & SGST columns hidden on mobile 
  if (isMobile) {
    return (
      <>
        <GlobalStyles
          styles={{
            "@media print": {
              "body *": { visibility: "hidden" },
              "#invoice, #invoice *": { visibility: "visible" },
              "#invoice": { position: "absolute", left: 0, top: 0, width: "100%" },
            },
          }}
        />

        <Paper sx={{ p: "6px", mx: 0, overflow: "hidden" }} id="invoice">
          <Typography
            textAlign="center"
            mb={1.5}
            fontSize={13}
            sx={{ textDecoration: "underline", textUnderlineOffset: 4 }}
          >
            Distributor Tax Invoice / Cash Memo
          </Typography>

          {/* Shop Info */}
          <Box sx={{ border: "1.5px solid #000", p: "8px 10px" }}>
            <Typography fontSize={12} fontWeight={600}>{pharmacyName}</Typography>
            <Typography fontSize={10}>{pharmacyAddress}</Typography>
          </Box>

          {/* Customer Info */}
          <Box sx={{ border: "1.5px solid #000", borderTop: "none", p: "8px 10px" }}>
            <Typography fontSize={11}><strong>Name:</strong> {displayName}</Typography>
            <Typography fontSize={11} mt={0.5}><strong>Address:</strong> {displayAddress}</Typography>
            <Box sx={{ mt: 1, pt: 1, borderTop: "1px solid #000" }}>
              <Typography fontSize={11}><strong>Invoice No.:</strong> {invoice?.invoice}</Typography>
              <Typography fontSize={11}><strong>GSTIN:</strong> {invoice?.gstIn || "-"}</Typography>
              <Typography fontSize={11}><strong>Date:</strong> {displayDate}</Typography>
            </Box>
          </Box>

          
          <Box
            sx={{
              border: "1.5px solid #000",
              borderTop: "none",
              display: "grid",
              gridTemplateColumns: "22px 1fr 34px 60px 24px 48px",
              px: "4px",
              py: "5px",
              backgroundColor: "#f5f5f5",
            }}
          >
            {["Sr.", "Particulars", "HSN", "Expiry", "Qty", "Rate (₹)"].map((h) => (
              <Typography key={h} fontSize={9} fontWeight={700} textAlign="center" noWrap>
                {h}
              </Typography>
            ))}
          </Box>

         
          {invoice?.medicines?.map((med: Medicine, index: number) => {
             const rate = Number(med.quantity) > 0 ? med.amount / Number(med.quantity) : 0;
          
            return (
              <Box
                key={index}
                sx={{
                  border: "1.5px solid #000",
                  borderTop: "none",
                  display: "grid",
                  gridTemplateColumns: "22px 1fr 34px 60px 24px 48px",
                  px: "4px",
                  py: "4px",
                  backgroundColor: index % 2 === 0 ? "#fff" : "#fafafa",
                  alignItems: "start",
                }}
              >
                <Typography fontSize={9.5} textAlign="center" pt="1px">{index + 1}</Typography>
                <Typography fontSize={9.5} textAlign = "center"sx={{ wordBreak: "break-word", overflowWrap: "break-word", minWidth: 0 }}>
                  {med.name}
                </Typography>
                <Typography fontSize={9.5} textAlign="center">{med.hsn || "-"}</Typography>
                <Typography fontSize={9.5} textAlign="center">{med.expiry || "-"}</Typography>
                <Typography fontSize={9.5} textAlign="center">{med.quantity}</Typography>
                <Typography fontSize={9.5} textAlign="center">{rate.toFixed(2)}</Typography>
              </Box>
            );
          })}

          {/* Totals */}
          <Box sx={{ border: "1.5px solid #000", borderTop: "none", p: "6px 10px" }}>
            <Box display="flex" justifyContent="space-between">
              <Typography fontSize={11} fontWeight={600}>Sub Total</Typography>
              <Typography fontSize={11}>₹ {subTotal.toFixed(2)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mt={0.5}>
              <Typography fontSize={11} fontWeight={600}>Total GST ({invoiceGst}%)</Typography>
              <Typography fontSize={11}>₹ {gstAmount.toFixed(2)}</Typography>
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              mt={0.5}
              pt={0.5}
              sx={{ borderTop: "1px solid #000" }}
            >
              <Typography fontSize={12} fontWeight={700}>NET</Typography>
              <Typography fontSize={12} fontWeight={700}>₹ {grandTotal.toFixed(2)}</Typography>
            </Box>
          </Box>

          {/* Footer */}
          <Box sx={{ border: "1.5px solid #000", borderTop: "none", p: "8px 10px" }}>
            <Typography fontSize={9.5} color="text.secondary">
              Vat Tin No. :<br />
              Drug Lic No. : MH-PZ4-115478,115479,115480<br />
              I/We hereby certify that my/our registration certificate under the Maharashtra Value Added Tax Act 2002
              is in force on the date on the which sales of the goods specified in this tax invoice is made by me/us and
              that the transaction of the sale covered by this tax invoice has been effected by me/us and it shall be
              accounted for in the turnover of sales while filling of return and the due tax, if any, payble on the
              sales has been paid or shall be paid.
            </Typography>
            <Box display="flex" flexDirection="column" alignItems="center" mt={1.5}>
              <Typography fontSize={11} fontWeight={600}>For {pharmacyData?.pharmacyName || "Your Pharmacy"}</Typography>
              <Box component="img" src={Sign} alt="Store Sign" sx={{ width: 80, py: 1 }} />
              <Typography fontSize={11}>Pharmacist</Typography>
            </Box>
          </Box>
        </Paper>

        <Box m={2} display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            sx={{
              px: 3, textTransform: "none", fontSize: 13,
              color: "#238878", border: "2px solid #238878",
              "&:hover": { backgroundColor: "#238878", color: "#fff" },
            }}
          >
            Cancel
          </Button>
          <Button
            startIcon={<PrintIcon />}
            variant="contained"
            onClick={() => window.print()}
            sx={{
              px: 3, fontSize: 13, backgroundColor: "#238878",
              color: "#fff", border: "2px solid #238878", textTransform: "none",
              "&:hover": { backgroundColor: "#fff", color: "#238878", border: "2px solid #238878" },
            }}
          >
            Print
          </Button>
        </Box>
      </>
    );
  }

  //  DESKTOP VIEW
  return (
    <>
      <GlobalStyles
        styles={{
          "@media print": {
            "body *": { visibility: "hidden" },
            "#invoice, #invoice *": { visibility: "visible" },
            "#invoice": { position: "absolute", left: 0, top: 0, width: "100%" },
          },
        }}
      />

      <Paper sx={{ p: { xs: 2, md: 4 }, mx: { xs: 0, md: 3 } }} id="invoice">
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
            }}
          >
            <TableBody>

              {/* Header */}
              <TableRow>
                <TableCell colSpan={4} sx={{ border: "2px solid #000" }}>
                  <Typography fontSize={20} fontWeight={600}>{pharmacyData?.pharmacyName || "Your Pharmacy"}</Typography>
                  <Typography>{pharmacyData?.address || "Your Address"}</Typography>
                </TableCell>

                <TableCell colSpan={4} sx={{ border: "2px solid #000" }}>
                  <Typography><strong>Name:</strong> {displayName}</Typography>
                  <Typography sx={{ mt: 0.5 }}><strong>Address:</strong> {displayAddress}</Typography>
                  <Box
                    sx={{
                      mt: 1, pt: 1,
                      borderTop: "2px solid #000",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography><strong>Invoice No.:</strong> {invoice?.invoice}</Typography>
                      <Typography><strong>GSTIN:</strong> {invoice?.gstIn || "-"}</Typography>
                    </Box>
                    <Typography><strong>Date:</strong> {displayDate}</Typography>
                  </Box>
                </TableCell>
              </TableRow>

              {/* Column Headers */}
              <TableRow>
                {columns.map((col) => (
                  <TableCell
                    key={col.label}
                    sx={{ width: col.width, border: "2px solid #000", fontWeight: "bold", textAlign: "center" }}
                  >
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>

              {/* Medicines */}
              {invoice?.medicines?.map((med: Medicine, index: number) => {
                const rate = Number(med.quantity) > 0 ? med.amount / Number(med.quantity) : 0;
                return (
                  <TableRow key={index} sx={{ "& td": { borderLeft: "2px solid #000", borderRight: "2px solid #000" } }}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">{med.name}</TableCell>
                    <TableCell align="center">{med.hsn || "-"}</TableCell>
                    <TableCell align="center">{med.expiry || "-"}</TableCell>
                    <TableCell align="center">{med.quantity}</TableCell>
                    <TableCell align="center">{rate.toFixed(2)}</TableCell>
                    <TableCell align="center">{invoiceGst}%</TableCell>
                    <TableCell align="center">-</TableCell>
                  </TableRow>
                );
              })}

              {/* SubTotal */}
              <TableRow>
                {[...Array(6)].map((_, i) => (
              <TableCell key={i} sx={{ borderLeft: "2px solid #000", borderRight: "2px solid #000" }} />
                ))}
              <TableCell sx={{ border: "2px solid #000" }} align="center">
              <strong>Sub Total</strong>
              </TableCell>
              <TableCell sx={{ border: "2px solid #000" }} align="center">
                  ₹ {subTotal.toFixed(2)}
              </TableCell>
              </TableRow>
              
              {/* GST */}
              <TableRow>
                {[...Array(6)].map((_, i) => (
              <TableCell key={i} sx={{ borderLeft: "2px solid #000", borderRight: "2px solid #000" }} />
                ))}
              <TableCell sx={{ border: "2px solid #000" }} align="center">
              <strong>Total GST ({invoiceGst}%)</strong>
              </TableCell>
              <TableCell sx={{ border: "2px solid #000" }} align="center">
                  ₹ {gstAmount.toFixed(2)}
              </TableCell>
              </TableRow>

              {/* NET */}
              <TableRow>
                <TableCell colSpan={5} sx={{ border: "2px solid #000" }}>
                  Get Well Soon.. GSTIN {invoice?.gstIn || "-"}
                </TableCell>
                <TableCell sx={{ border: "2px solid #000" }} align="right">
                  <Typography fontWeight={600}>NET :</Typography>
                </TableCell>
                <TableCell colSpan={2} sx={{ border: "2px solid #000" }}>
                  <Typography fontWeight={600}>₹ {grandTotal.toFixed(2)}</Typography>
                </TableCell>
              </TableRow>

              {/* Footer */}
              <TableRow>
                <TableCell colSpan={5} sx={{ border: "2px solid #000" }}>
                  Vat Tin No. :<br />
                  Drug Lic No. : MH-PZ4-115478,115479,115480<br />
                  I/We hereby certify that my/our registration certificate under the Maharashtra Value Added Tax Act 2002
                  is in force on the date on the which sales of the goods specified in this tax invoice is made by me/us and
                  that the transaction of the sale covered by this tax invoice has been effected by me/us and it shall be
                  accounted for in the turnover of sales while filling of return and the due tax, if any, payble on the
                  sales has been paid or shall be paid.
                </TableCell>
                <TableCell colSpan={3} align="center" sx={{ border: "2px solid #000" }}>
                  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                    <strong>For {pharmacyData?.pharmacyName || "Your Pharmacy"}</strong>
                    <Box
                      component="img"
                      src={Sign}
                      alt="Store Sign"
                      sx={{ width: { xs: 80, md: 120 }, py: 2 }}
                    />
                    <Typography>Pharmacist</Typography>
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
            px: 4, textTransform: "none", fontSize: 14,
            color: "#238878", border: "2px solid #238878",
            "&:hover": { backgroundColor: "#238878", color: "#fff" },
          }}
        >
          Cancel
        </Button>
        <Button
          startIcon={<PrintIcon />}
          variant="contained"
          onClick={() => window.print()}
          sx={{
            px: 4, fontSize: 14, backgroundColor: "#238878",
            color: "#fff", border: "2px solid #238878", textTransform: "none",
            "&:hover": { backgroundColor: "#fff", color: "#238878", border: "2px solid #238878" },
          }}
        >
          Print
        </Button>
      </Box>
    </>
  );
};

export default NewInvoiceBill;