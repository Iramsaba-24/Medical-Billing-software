import { Paper, Box, Typography } from "@mui/material";
import {
  UniversalTable,
  Column,
} from "@/components/uncontrolled/UniversalTable";
import ShareMenu from "@/containers/distributors/ShareMenu";
import { useEffect, useState } from "react";

type InvoiceItem = {
  invoice: string;
  name: string;
  date: string;
  price: number;
  status: string;
};

const columns: Column<InvoiceItem>[] = [
  { key: "invoice", label: "Invoice No" },
  { key: "name", label: "Customer / Company" },
  { key: "date", label: "Date" },
  {
    key: "price",
    label: "Amount",
    render: (row) => `₹ ${row.price}`,
  },
  { key: "status", label: "Status" },
  {
    key: "invoice",
    label: "Actions",
    render: (row) => <ShareMenu itemName={row.name} />,
  },
];

export default function NewInvoiceList() {
  const [tableData, setTableData] = useState<InvoiceItem[]>([]);
  useEffect(() => {
  const storedInvoices = localStorage.getItem("currentNewInvoiceList");

  if (storedInvoices) {
    const parsed = JSON.parse(storedInvoices);
    setTableData(parsed);
  }
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