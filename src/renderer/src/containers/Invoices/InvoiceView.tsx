import { GlobalStyles, useMediaQuery, useTheme } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getRetailInvoiceById,
  getRetailInvoiceItemsByInvoiceId,
} from "@/service/retailInvoiceService";
import { getMedicines } from "@/service/medicineService";
import { getCustomerById } from "@/service/customerService";
import {
  PharmacySettingsResponse,
  pharmacySettingsService,
} from "@/service/pharmacySettingsService";
import MobileInvoiceView from "@/containers/invoices/MobileInvoiceView";
import DesktopInvoiceView from "@/containers/invoices/DesktopInvoiceView";

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
  gstPercent?: number;
}
 
const InvoiceView = () => {
  const { invoiceNo } = useParams<{ invoiceNo: string }>();
 
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [showLogo, setShowLogo] = useState<boolean>(false);
  // const [showHsn, setShowHsn] = useState<boolean>(false);
  const [pharmacyData, setPharmacyData] = useState<PharmacySettingsResponse | null>(null);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Fetch Invoice Data
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
          console.log("data.totalDiscount:", data.totalDiscount);
          console.log("data.totalAmount:", data.totalAmount);
          console.log("data.medipointsEarned:", data.medipointsEarned);
 
          setInvoice({
            invoice: String(data.retailInvoiceId),
            name: data.customerName || "",
            doctor: doctorName || "",
            address: "",
            date: new Date(data.invoiceDate).toLocaleDateString("en-GB"),
 
            medicines: (items || []).map(
              (item: {
                medicineId: number;
                quantity: number;
                price: number;
                amount: number;
                strength?: string;
                companyName?: string;
              }) => {
                const medicine = medicines.find(
                  (m: {
                    medicineId: number;
                    medicineName: string;
                    expiryDate?: string;
                    hsnCode?: string;
                  }) => Number(m.medicineId) === Number(item.medicineId),
                );
                const nameParts = [
                  medicine?.medicineName,
                  item.strength || medicine?.strength,
                  item.companyName || medicine?.companyName,
                ]
                  .filter(Boolean)
                  .join(" - ");
 
                return {
                  name: nameParts || "Medicine",
                  qty: `${item.price} × ${item.quantity}`,
                  amount: Number(item.price) * Number(item.quantity),
                  batch: medicine?.hsnCode || "",
                  manufacturing: medicine?.manufacturingDate
                    ? new Date(medicine.manufacturingDate).toLocaleDateString("en-GB")
                    : "",
                  expiry: medicine?.expiryDate
                    ? new Date(medicine.expiryDate).toLocaleDateString("en-GB")
                    : "",
                };
              },
            ),
 
            totalAmount: data.totalAmount,
            gstPercent: data.gstPercent || 0,
            usedPoints: data.totalDiscount,
          });
        } else {
          navigate(-1);
        }
      } catch {
        navigate(-1);
      }

      // Read invoice display settings from localStorage
      const invoiceSettings = localStorage.getItem("invoiceSettings");
      if (invoiceSettings) {
        const parsed = JSON.parse(invoiceSettings);
        const printOptions: string[] = parsed.product_linking || [];
        setShowLogo(printOptions.includes("show_logo"));
      }
    };
 
    fetchInvoice();
  }, [invoiceNo, navigate]);

  // Fetch Pharmacy Settings
  useEffect(() => {
    const fetchPharmacySettings = async () => {
      try {
        const settings = await pharmacySettingsService.getSettings(1);
        setPharmacyData(settings);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Pharmacy fetch error message:", error.message);
        }
      }
    };
    fetchPharmacySettings();
  }, []);

  //  Computed Values
  const subTotal =
    invoice?.medicines?.reduce((sum, med) => sum + Number(med.amount), 0) || 0;
 
  const usedPoints = invoice?.usedPoints || 0;
  const gstPercent = invoice?.gstPercent || 0;
  const netTotal = invoice?.totalAmount || 0;
 
  const amountAfterDiscount = subTotal - usedPoints;
  const gstAmount = (amountAfterDiscount * gstPercent) / 100;
  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;
 
  const currentDate = invoice?.date || new Date().toLocaleDateString("en-GB");

  //Shared Props 
  const sharedProps = {
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
  };

  // ─── Render ───────────────────────────────────────────────────────────────
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
              width: "100%",
            },
          },
        }}
      />

      {isMobile ? (
        <MobileInvoiceView {...sharedProps} />
      ) : (
        <DesktopInvoiceView {...sharedProps} />
      )}
    </>
  );
};

export default InvoiceView;
