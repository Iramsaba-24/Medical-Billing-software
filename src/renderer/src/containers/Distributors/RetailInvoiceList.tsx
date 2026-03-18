import { Paper, Box, Typography } from "@mui/material";
import {
  UniversalTable,
  Column,
} from "@/components/uncontrolled/UniversalTable";
import ShareMenu from "./ShareMenu";
import { useEffect, useState } from "react";

type RetailRow = {
  name: string;
  qty: number;
  mrp: number;
  discount?: number;
};

type RetailInvoice = {
  id?: number;
  company: string;
  supplier: string;
  items?: RetailRow[];
};

type InvoiceItem = {
  id: number;
  company: string;
  supplier: string;
  item: string;
  quantity: number;
  mrp: number;
  total: number;
};

const columns: Column<InvoiceItem>[] = [
  { key: "company", label: "Company" },
  { key: "supplier", label: "Supplier" },
  { key: "item", label: "Item" },
  { key: "quantity", label: "Quantity" },
  {
    key: "mrp",
    label: "MRP",
    render: (row) => `₹ ${row.mrp}`,
  },
  {
    key: "total",
    label: "Total",
    render: (row) => `₹ ${row.total}`,
  },
  {
    key: "id",
    label: "Actions",
    render: (row) => <ShareMenu itemName={row.item} />,
  },
];

export default function RetailInvoiceList() {
  const [tableData, setTableData] = useState<InvoiceItem[]>([]);

  useEffect(() => {
  const storedData = localStorage.getItem("currentRetailInvoice");

  if (!storedData) return;

const parsed: RetailInvoice[] = JSON.parse(storedData);

const rows = parsed.flatMap((invoice: RetailInvoice) =>
  (invoice.items || []).map((item: RetailRow) => ({
    id: invoice.id!,
    company: invoice.company,
    supplier: invoice.supplier,
    item: item.name,
    quantity: item.qty,
    mrp: item.mrp,
    total: item.qty * (item.mrp - (item.discount ?? 0)),
  }))
);

  setTableData(rows);
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
        Retail Invoice Details
      </Typography>
    </Box>

    <UniversalTable<InvoiceItem>
      data={tableData}
      columns={columns}
      showSearch
      showExport
      enableCheckbox
      rowsPerPage={5}
      getRowId={(row) => row.id}
      onDeleteSelected={(rows) => {
        const idsToDelete = rows.map((r) => r.id);

        const updatedData = tableData.filter(
          (row) => !idsToDelete.includes(row.id)
        );

        setTableData(updatedData);
        const stored = localStorage.getItem("currentRetailInvoice");

if (!stored) return;
      }}
    />
  </Paper>
);}