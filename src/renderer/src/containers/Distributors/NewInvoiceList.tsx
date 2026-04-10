import { Paper, Box, Typography } from "@mui/material";
import {
  UniversalTable,
  Column,
} from "@/components/uncontrolled/UniversalTable";
import ShareMenu from "@/containers/distributors/ShareMenu";
import { useEffect, useState } from "react";
import {  getAllInvoices, InvoiceListResponse  } from "@/service/distributorInvoiceService";
import { getDistributors } from "@/service/distributorService";
type InvoiceItem = {
  invoice: string;
  name: string;
  createdAt: string;
  price: number;
  paymentStatus: string;
};

const columns: Column<InvoiceItem>[] = [
  { key: "invoice", label: "Invoice No" },
  { key: "name", label: "Customer / Company" },
  { key: "createdAt", label: "Date" },
  {
    key: "price",
    label: "Amount",
    render: (row) => `₹ ${row.price}`,
  },
  { key: "paymentStatus", label: "Status" },
  {
    key: "invoice",
    label: "Actions",
    render: (row) => <ShareMenu itemName={row.name} />,
  },
];

export default function NewInvoiceList() {
  const [tableData, setTableData] = useState<InvoiceItem[]>([]);
useEffect(() => {
  const fetchInvoices = async () => {
    try {
      const [invoiceData, distributorData] = await Promise.all([
        getAllInvoices(),
        getDistributors(),
      ]);

const formatted = invoiceData.map((inv: InvoiceListResponse) => {
  const distributor = distributorData.find(
    (d) => d.distributorId === inv.distributorId
  );

  return {
    invoice: String(inv.invoiceId),
    name: distributor?.companyName || "Distributor",
    createdAt: new Date(inv.invoiceDate).toLocaleDateString("en-GB"),
    price: inv.totalAmount,
    paymentStatus: inv.paymentStatus,
  };
});

      setTableData(formatted);
    } catch (error) {
      console.error("Fetch invoices failed", error);
    }
  };

  fetchInvoices();
}, []);

 

  return (
  <Paper
   sx={{ mt: 3, p: { xs: 1, md: 3 }, }}
  >
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        
      }}
    >
      <Typography fontSize={{ xs: 18, md: 22 }} fontWeight={600} mb={2}>
        New Invoice Details
      </Typography>
    </Box>

    <UniversalTable<InvoiceItem>
      data={tableData}
      columns={columns}
      showSearch
      showExport
      enableCheckbox
      rowsPerPage={5}
      getRowId={(row) => row.invoice}
     onDeleteSelected={(rows) => {
  const idsToDelete = rows.map((r) => r.invoice);

  const updatedData = tableData.filter(
    (row) => !idsToDelete.includes(row.invoice)
  );

  setTableData(updatedData);
  localStorage.setItem("currentNewInvoiceList", JSON.stringify(updatedData));
}}
    />
  </Paper>
);}