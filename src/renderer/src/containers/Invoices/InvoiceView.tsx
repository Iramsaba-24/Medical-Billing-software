import { Paper, Table, TableBody, TableCell, TableContainer,
   Box, TableRow, Typography, Button, GlobalStyles, useMediaQuery, 
   useTheme } from "@mui/material"
import PrintIcon from "@mui/icons-material/Print";
import Sign from "@/assets/Sign.svg";
import {  useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import LogoImage from "@/assets/logoimg.svg";
import { PharmacyFormValues } from "../setting/PharmacyProfile";
import { getRetailInvoiceById, getRetailInvoiceItemsByInvoiceId } from "@/service/retailInvoiceService";
 import { getMedicines } from "@/service/medicineService";
 import { getCustomerById } from "@/service/customerService";
 
 
export interface Invoice {
  name: string;
  doctor: string;
  address: string;
    doctorAddress?: string;
  invoice: string;
  date: string;
  medicines: {
    name: string;
    qty: string;
    amount: number;
    batch: string;
    expiry: string;
  }[];
  subTotal?: number;
 
  totalAmount?: number;
  usedPoints?: number;
  total?: number;
}
interface Medicine {
  name: string;
  qty: number | string;
  amount: number;
  batch?: string;
  expiry?: string;
}

type InvoiceNavigationState = {
  invoice?: {
    usedPoints?: number;
  };
};
 
const InvoiceView = () => {
  const { invoiceNo } = useParams<{ invoiceNo: string }>();

 const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [showLogo, setShowLogo] = useState<boolean>(false);
  const [showHsn, setShowHsn] = useState<boolean>(false);
  const location = useLocation() as { state: InvoiceNavigationState };
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
 
  const columns = [
    { label: "Sr No.", width: "7%" },
    { label: "Particulars", width: "33%" },
    ...(showHsn ? [{ label: "HSN Code", width: "13%" }] : []),
    { label: "Expiry", width: "12%" },
    { label: "Quantity", width: "10%" },
    { label: "Amount", width: "15%" },
  ];
 
useEffect(() => {
  const fetchInvoice = async () => {
    if (!invoiceNo) return;

    try {
      const data = await getRetailInvoiceById(Number(invoiceNo));
      const items = await getRetailInvoiceItemsByInvoiceId(Number(invoiceNo));
      const medicines = (await getMedicines()) || [];

      let doctorName = "";
      if (data?.customerId) {
        try {
          const customer = await getCustomerById(data.customerId);
          doctorName = customer?.doctor || "";
        } catch {
          doctorName = "";
        }
      }

      if (data) {
        setInvoice({
          invoice: String(data.retailInvoiceId),
          name: data.customerName || "",
          doctor: doctorName || "",
          address: "",
          date: new Date(data.invoiceDate).toLocaleDateString("en-GB"),

          medicines: (items || []).map((item: {
            medicineId: number;
            quantity: number;
            price: number;
            amount: number;
          }) => {
            const medicine = medicines.find(
              (m: {
                medicineId: number;
                itemName: string;
                expiryDate?: string;
                hsnCode?: string;
              }) => Number(m.medicineId) === Number(item.medicineId)
            );

            console.log(
              "item.medicineId:",
              item.medicineId,
              "found:",
              medicine?.itemName,
              "HSN:",
              medicine?.hsnCode
            );

            return {
              name: medicine?.itemName || String(item.medicineId),
              qty: item.quantity,
              amount: item.amount,

              batch: medicine?.hsnCode || "", 

              expiry: medicine?.expiryDate
                ? new Date(medicine.expiryDate).toLocaleDateString("en-GB")
                : "",
            };
          }),

          totalAmount: data.totalAmount,
          
        });
      } else {
        navigate(-1);
      }
    } catch (error) {
      navigate(-1);
    }

    const invoiceSettings = localStorage.getItem("invoiceSettings");
    if (invoiceSettings) {
      const parsed = JSON.parse(invoiceSettings);
      const printOptions: string[] = parsed.product_linking || [];

      setShowLogo(printOptions.includes("show_logo"));
      setShowHsn(printOptions.includes("show_hsn_code")); // ✅ HSN toggle
    }
  };

  fetchInvoice();
}, [invoiceNo, navigate]);
 
 
const subTotal = invoice?.medicines?.reduce(
  (sum, med) => sum + Number(med.amount), 0) || 0;

  const usedPoints = location.state?.invoice?.usedPoints || 0;
const discountedTotal = invoice?.totalAmount ?? subTotal;
const netTotal = discountedTotal;
 
  const currentDate = invoice?.date || new Date().toLocaleDateString("en-GB");
 

  const [pharmacyData, setPharmacyData] = useState<PharmacyFormValues | null>(null);
 
useEffect(() => {
  const stored = localStorage.getItem("pharmacyProfile");
  if (stored) {
    setPharmacyData(JSON.parse(stored) as PharmacyFormValues);
  }
}, []);
const pharmacyName = pharmacyData?.pharmacyName || "Your Pharmacy";
const pharmacyAddress = pharmacyData?.address || "-";
 
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
        <Paper sx={{ p: 2, mx: 0 }} id="invoice">
          <Typography textAlign="center" mb={2} fontSize={14} sx={{
            textDecoration: "underline", textUnderlineOffset: 4
          }}>Tax Invoice / Cash Memo</Typography>
          {/* Header — Shop Info */}
          <Box sx={{ border: "1.5px solid #000", p: 1.5, mb: 0 }}>
            <Box display="flex" alignItems="center" gap={1}>
              {showLogo && (
                <Box
                  component="img"
                  src={(() => {
                    const savedLogo = localStorage.getItem("pharmacyLogo");
                    return savedLogo || LogoImage;
                  })()}
                  alt="logo"
                  sx={{ width: 36, height: 36, objectFit: "contain" }}
                />
              )}
              <Box>
                <Typography fontSize={13} fontWeight={600}> {pharmacyName}</Typography>
                <Typography fontSize={11}>{pharmacyAddress}</Typography>
              </Box>
            </Box>
          </Box>
          {/* Customer Info */}
          <Box sx={{ border: "1.5px solid #000", borderTop: "none", p: 1.5, mb: 0 }}>
            <Typography fontSize={12}><strong>Name:</strong> {invoice?.name}</Typography>
            <Typography fontSize={12} mt={0.5}>
              <strong>Doctor:</strong> {invoice?.doctor}
              {invoice?.doctor && invoice?.doctorAddress ? ' - ' : ''}
              {invoice?.doctorAddress}
            </Typography>
            <Box sx={{ mt: 1, pt: 1, borderTop: "1px solid #000", display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Typography fontSize={12}><strong>Invoice No.:</strong> {invoice?.invoice}</Typography>
              <Typography fontSize={12}><strong>Date:</strong> {currentDate}</Typography>
            </Box>
          </Box>
          {/* Column Headers */}
          <Box sx={{ border: "1.5px solid #000", borderTop: "none", display: "grid", gridTemplateColumns: "30px 1fr 50px 55px 55px", p: "6px 8px", backgroundColor: "#f5f5f5" }}>
            <Typography fontSize={10} fontWeight={700}>#</Typography>
            <Typography fontSize={10} fontWeight={700}>Particulars</Typography>
            <Typography fontSize={10} fontWeight={700} textAlign="center">Expiry</Typography>
            <Typography fontSize={10} fontWeight={700} textAlign="center">Qty</Typography>
            <Typography fontSize={10} fontWeight={700} textAlign="center">Amt</Typography>
          </Box>
          {/* Medicine Rows */}
          {invoice?.medicines?.map((med: Medicine, index: number) => (
            <Box
              key={index}
              sx={{
                border: "1.5px solid #000",
                borderTop: "none",
                display: "grid",
                gridTemplateColumns: "30px 1fr 50px 55px 55px",
                p: "5px 8px",
                backgroundColor: index % 2 === 0 ? "#fff" : "#fafafa",
              }}
            >
              <Typography fontSize={11}>{index + 1}</Typography>
              <Typography fontSize={11}>{med.name}</Typography>
              <Typography fontSize={11} textAlign="center">{med.expiry}</Typography>
              <Typography fontSize={11} textAlign="center">{med.qty}</Typography>
              <Typography fontSize={11} textAlign="center">₹{med.amount.toFixed(2)}</Typography>
            </Box>
          ))}
          {/* Totals */}
          <Box sx={{ border: "1.5px solid #000", borderTop: "none", p: "6px 8px" }}>
            <Box display="flex" justifyContent="space-between">
              <Typography fontSize={12} fontWeight={600}>Sub Total</Typography>
              <Typography fontSize={12}>₹ {subTotal.toFixed(2)}</Typography>
            </Box>




            <Box display="flex" justifyContent="space-between" mt={0.5}>
  <Typography fontSize={12} fontWeight={600}>Medipoint</Typography>
  <Typography fontSize={12}>₹ 0.00</Typography>
</Box>
<Box display="flex" justifyContent="space-between" mt={0.5}>
  <Typography fontSize={12} fontWeight={600}>CGST (5%)</Typography>
  <Typography fontSize={12}>₹ 0.00</Typography>
</Box>

<Box display="flex" justifyContent="space-between" mt={0.5}>
  <Typography fontSize={12} fontWeight={600}>SGST (5%)</Typography>
  <Typography fontSize={12}>₹ 0.00</Typography>
</Box>
            
           
            <Box display="flex" justifyContent="space-between" mt={0.5} pt={0.5} sx={{ borderTop: "1px solid #000" }}>
              <Typography fontSize={13} fontWeight={700}>NET</Typography>
              <Typography fontSize={13} fontWeight={700}>₹ {netTotal.toFixed(2)}</Typography>
            </Box>
          </Box>
          {/* Footer */}
          <Box sx={{ border: "1.5px solid #000", borderTop: "none", p: 1.5 }}>
            <Typography fontSize={10} color="text.secondary">
              Vat Tin No. :<br />
              Drug Lic No. : MH-PZ4-115478,115479,115480<br />
              I/We hereby certify that my/our registration certificate under the Maharashtra Value Added Tax Act 2002 is in force on the date on the which sales of the goods specified in this tax invoice is made by me/us and that the transaction of the sale covered by this tax invoice has been effected by me/us and it shall be accounted for in the turnover of sales while filling of return and the due tax, if any, payble on the sales has been paid or shall be paid.
            </Typography>
            <Box display="flex" flexDirection="column" alignItems="center" mt={1.5}>
              <Typography fontSize={11} fontWeight={600}>For {pharmacyName}</Typography>
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
 
  // Desktop view
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
        <Typography textAlign="center" mb={2} sx={{
          textDecoration: "underline", textUnderlineOffset: 4
        }}>Tax Invoice / Cash Memo</Typography>
        <TableContainer>
          <Table sx={{ width: "100%", borderCollapse: "collapse", border: "2px solid #000" }}>
            <TableBody>
              <TableRow>
                <TableCell colSpan={2} sx={{ border: "2px solid #000" }}>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    {showLogo && (
                      <Box
                        component="img"
                        src={(() => {
                          const savedLogo = localStorage.getItem("pharmacyLogo");
                          return savedLogo || LogoImage;
                        })()}
                        alt="logo"
                        sx={{ width: { xs: 36, md: 48 }, height: { xs: 36, md: 48 }, objectFit: "contain" }}
                      />
                    )}
                    <Box>
                      <Typography fontSize={20}>{pharmacyName}</Typography>
                      <Typography>{pharmacyAddress}</Typography>
                    </Box>
                  </Box>
                </TableCell>
 
                <TableCell colSpan={4} sx={{ border: "2px solid #000" }}>
                  <Typography><strong>Name:</strong> {invoice?.name}</Typography>
                 <Typography sx={{ mt: 0.5 }}><strong>Doctor:</strong> {invoice?.doctor} {invoice?.doctor && invoice?.doctorAddress ? '- ' : ''}{invoice?.doctorAddress}</Typography>
                  <Box gap={8} sx={{ mt: 1, pt: 1, borderTop: "2px solid #000", display: "flex" }}>
                    <Typography><strong>Invoice No.:</strong> {invoice?.invoice}</Typography>
                    <Typography><strong>Date:</strong> {currentDate}</Typography>
                  </Box>
                </TableCell>
              </TableRow>
 
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
 
              {invoice?.medicines?.map((med: Medicine, index: number) => (
                <TableRow key={index} sx={{ "& td": { borderLeft: "2px solid #000", borderRight: "2px solid #000" } }}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell>{med.name}</TableCell>
                  {showHsn && <TableCell align="center">{med.batch}</TableCell>}
                  <TableCell align="center">{med.expiry}</TableCell>
                  <TableCell align="center">{med.qty}</TableCell>
                  <TableCell align="center">₹ {med.amount.toFixed(2)}</TableCell>
                </TableRow>
              ))}
 
              <TableRow sx={{ "& td": { borderLeft: "2px solid #000", borderRight: "2px solid #000" } }}>
                <TableCell /><TableCell /><TableCell /><TableCell />
                <TableCell sx={{ borderBottom: "2px solid #000", borderTop: "2px solid #000" }} align="center"><strong>Sub Total</strong></TableCell>
                <TableCell sx={{ borderBottom: "2px solid #000", borderTop: "2px solid #000" }} align="center">₹ {subTotal.toFixed(2)}</TableCell>
              </TableRow>
 

<TableRow sx={{ "& td": { borderLeft: "2px solid #000", borderRight: "2px solid #000" } }}>
  <TableCell /><TableCell /><TableCell /><TableCell />
  <TableCell sx={{ borderBottom: "2px solid #000", borderTop: "2px solid #000" }} align="center"><strong>Medipoint</strong></TableCell>
  <TableCell sx={{ borderBottom: "2px solid #000", borderTop: "2px solid #000" }} align="center">₹ {usedPoints.toFixed(2)}</TableCell>
</TableRow>

<TableRow sx={{ "& td": { borderLeft: "2px solid #000", borderRight: "2px solid #000" } }}>
  <TableCell /><TableCell /><TableCell /><TableCell />
  <TableCell sx={{ borderBottom: "2px solid #000", borderTop: "2px solid #000" }} align="center"><strong>CGST (5%)</strong></TableCell>
  <TableCell sx={{ borderBottom: "2px solid #000", borderTop: "2px solid #000" }} align="center">₹ 0.00</TableCell>
</TableRow>


 <TableRow sx={{ "& td": { borderLeft: "2px solid #000", borderRight: "2px solid #000" } }}>
  <TableCell /><TableCell /><TableCell /><TableCell />
  <TableCell
    sx={{ borderBottom: "2px solid #000", borderTop: "2px solid #000" }}
    align="center"
  >
    <strong>SGST (2.5%)</strong>
  </TableCell>
  <TableCell
    sx={{ borderBottom: "2px solid #000", borderTop: "2px solid #000" }}
    align="center"
  >
    ₹ 0.00
  </TableCell>
</TableRow>
              <TableRow sx={{ borderTop: "2px solid #000" }}>
                <TableCell colSpan={4} sx={{ border: "2px solid #000" }}>
                  Get Well Soon..
                </TableCell>
                <TableCell sx={{ border: "2px solid #000" }}>
                  <Typography fontWeight={600} sx={{ textAlign: "right" }}>NET :</Typography>
                </TableCell>
                <TableCell sx={{ pl: { xs: 1, md: 2 }, border: "2px solid #000" }}>
                  <Typography fontWeight={600}>₹ {netTotal.toFixed(2)}</Typography>
                </TableCell>
              </TableRow>
 
              <TableRow>
                <TableCell colSpan={4} sx={{ border: "2px solid #000" }}>
                  Vat Tin No. :
                  <br />
                  Drug Lic No. : MH-PZ4-115478,115479,115480
                  <br />
                  I/We hereby certify that my/our registration certificate under the Maharashtra Value Added Tax Act 2002
                  is in force on the date on the which sales of the goods specified in this tax invoice is made by me/us and
                  that the transaction of the sale covered by this tax invoice has been effected by me/us and it shall be accounted for in the turnover of sales while filling of return and the due tax, if any, payble on the sales has been paid or shall be paid.
                </TableCell>
                <TableCell colSpan={2} align="center" sx={{ border: "2px solid #000" }}>
                  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                    <strong>For {pharmacyName}</strong>
                    <Box component="img" src={Sign} alt="Store Sign" sx={{ width: { xs: 80, md: 120 }, alignItems: "center", py: 2 }} />
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
  )
}
 
export default InvoiceView
 