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
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import Sign from "@/assets/Sign.svg";
import LogoImage from "@/assets/logoimg.svg";
import { useNavigate } from "react-router-dom";
import { Invoice } from "./InvoiceView";
import { PharmacySettingsResponse } from "@/service/pharmacySettingsService";

interface Medicine {
  name: string;
  qty: number | string;
  amount: number;
  batch?: string;
  manufacturing?: string;
  expiry?: string;
}

interface DesktopInvoiceViewProps {
  invoice: Invoice | null;
  pharmacyData: PharmacySettingsResponse | null;
  showLogo: boolean;
  // showHsn: boolean;
  subTotal: number;
  usedPoints: number;
  gstPercent: number;
  cgst: number;
  sgst: number;
  netTotal: number;
  currentDate: string;
}

const DesktopInvoiceView = ({
  invoice,
  pharmacyData,
  showLogo,
  subTotal,
  usedPoints,
  gstPercent,
  cgst,
  sgst,
  netTotal,
  currentDate,
}: DesktopInvoiceViewProps) => {
  const navigate = useNavigate();
  const pharmacyName = pharmacyData?.pharmacyName || "Your Pharmacy";
  const pharmacyAddress = pharmacyData?.address || "-";

  const columns = [
    { label: "Sr No.", width: "7%" },
    { label: "Particulars", width: "33%" },
    { label: "HSN Code", width: "13%" },
    { label: "MFG", width: "12%" },
    { label: "Expiry", width: "12%" },
    { label: "MRP × Qty", width: "10%" },
    { label: "Amount", width: "15%" },
  ];

  return (
    <>
      <Paper sx={{ p: { xs: 2, md: 4 }, mx: { xs: 0, md: 3 } }} id="invoice">
        <Typography
          textAlign="center"
          mb={2}
          sx={{
            textDecoration: "underline",
            textUnderlineOffset: 4,
          }}
        >
          Tax Invoice / Cash Memo
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
              {/* Header Row */}
              <TableRow>
                <TableCell colSpan={2} sx={{ border: "2px solid #000" }}>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    {showLogo && (
                      <Box
                        component="img"
                        src={pharmacyData?.logoUrl || LogoImage}
                        alt="logo"
                        sx={{
                          width: { xs: 36, md: 48 },
                          height: { xs: 36, md: 48 },
                          objectFit: "contain",
                        }}
                      />
                    )}
                    <Box>
                      <Typography fontSize={20}>{pharmacyName}</Typography>
                      <Typography>{pharmacyAddress}</Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell colSpan={4} sx={{ border: "2px solid #000" }}>
                  <Typography>
                    <strong>Name:</strong> {invoice?.name}
                  </Typography>
                  <Typography sx={{ mt: 0.5 }}>
                    <strong>Doctor:</strong> {invoice?.doctor}{" "}
                    {invoice?.doctor && invoice?.doctorAddress ? "- " : ""}
                    {invoice?.doctorAddress}
                  </Typography>
                  <Box
                    gap={8}
                    sx={{
                      mt: 1,
                      pt: 1,
                      borderTop: "2px solid #000",
                      display: "flex",
                    }}
                  >
                    <Typography>
                      <strong>Invoice No.:</strong> {invoice?.invoice}
                    </Typography>
                    <Typography>
                      <strong>Date:</strong> {currentDate}
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
                      border: "2px solid #000",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>

              {/* Medicine Rows */}
              {invoice?.medicines?.map((med: Medicine, index: number) => (
                <TableRow
                  key={index}
                  sx={{
                    "& td": {
                      borderLeft: "2px solid #000",
                      borderRight: "2px solid #000",
                    },
                  }}
                >
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell>{med.name}</TableCell>
                  <TableCell align="center">{med.batch}</TableCell>
                  <TableCell align="center">{med.manufacturing}</TableCell>
                  <TableCell align="center">{med.expiry}</TableCell>
                  <TableCell align="center">{med.qty}</TableCell>
                  <TableCell align="center">₹ {med.amount.toFixed(2)}</TableCell>
                </TableRow>
              ))}

              {/* Sub Total */}
              <TableRow
                sx={{
                  "& td": {
                    borderLeft: "2px solid #000",
                    borderRight: "2px solid #000",
                  },
                }}
              >
                <TableCell /><TableCell /><TableCell /><TableCell /><TableCell />
                <TableCell align="center"><strong>Sub Total</strong></TableCell>
                <TableCell align="center">₹ {subTotal.toFixed(2)}</TableCell>
              </TableRow>

              {/* Discount */}
              <TableRow
                sx={{
                  "& td": {
                    borderLeft: "2px solid #000",
                    borderRight: "2px solid #000",
                  },
                }}
              >
                <TableCell /><TableCell /><TableCell /><TableCell /><TableCell />
                <TableCell align="center"><strong>Discount</strong></TableCell>
                <TableCell align="center">₹ {usedPoints.toFixed(2)}</TableCell>
              </TableRow>

              {/* CGST */}
              <TableRow
                sx={{
                  "& td": {
                    borderLeft: "2px solid #000",
                    borderRight: "2px solid #000",
                  },
                }}
              >
                <TableCell /><TableCell /><TableCell /><TableCell /><TableCell />
                <TableCell align="center">
                  <strong>CGST ({gstPercent / 2}%)</strong>
                </TableCell>
                <TableCell align="center">₹ {cgst.toFixed(2)}</TableCell>
              </TableRow>

              {/* SGST */}
              <TableRow
                sx={{
                  "& td": {
                    borderLeft: "2px solid #000",
                    borderRight: "2px solid #000",
                  },
                }}
              >
                <TableCell /><TableCell /><TableCell /><TableCell /><TableCell />
                <TableCell align="center">
                  <strong>SGST ({gstPercent / 2}%)</strong>
                </TableCell>
                <TableCell align="center">₹ {sgst.toFixed(2)}</TableCell>
              </TableRow>

              {/* NET Total */}
              <TableRow sx={{ borderTop: "2px solid #000" }}>
                <TableCell colSpan={5} sx={{ border: "2px solid #000" }}>
                  Get Well Soon..
                </TableCell>
                <TableCell sx={{ border: "2px solid #000" }}>
                  <Typography fontWeight={600} sx={{ textAlign: "right" }}>
                    NET :
                  </Typography>
                </TableCell>
                <TableCell sx={{ pl: { xs: 1, md: 2 }, border: "2px solid #000" }}>
                  <Typography fontWeight={600}>₹ {netTotal.toFixed(2)}</Typography>
                </TableCell>
              </TableRow>

              {/* Footer */}
              <TableRow>
                <TableCell colSpan={5} sx={{ border: "2px solid #000" }}>
                  Vat Tin No. :
                  <br />
                  Drug Lic No. : MH-PZ4-115478,115479,115480
                  <br />
                  I/We hereby certify that my/our registration certificate under
                  the Maharashtra Value Added Tax Act 2002 is in force on the
                  date on the which sales of the goods specified in this tax
                  invoice is made by me/us and that the transaction of the sale
                  covered by this tax invoice has been effected by me/us and it
                  shall be accounted for in the turnover of sales while filling
                  of return and the due tax, if any, payble on the sales has
                  been paid or shall be paid.
                </TableCell>
                <TableCell colSpan={2} align="center" sx={{ border: "2px solid #000" }}>
                  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                    <strong>For {pharmacyName}</strong>
                    <Box
                      component="img"
                      src={Sign}
                      alt="Store Sign"
                      sx={{ width: { xs: 80, md: 120 }, alignItems: "center", py: 2 }}
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
            px: 4,
            textTransform: "none",
            fontSize: 14,
            color: "#238878",
            border: "2px solid #238878",
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
            px: 4,
            fontSize: 14,
            backgroundColor: "#238878",
            color: "#fff",
            border: "2px solid #238878",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#fff",
              color: "#238878",
              border: "2px solid #238878",
            },
          }}
        >
          Print
        </Button>
      </Box>
    </>
  );
};

export default DesktopInvoiceView;