import { Paper, Box, Typography } from "@mui/material";
import {
  UniversalTable,
  Column,
} from "@/components/uncontrolled/UniversalTable";
import ShareMenu from "./ShareMenu";
import { useEffect, useState } from "react";

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
    const storedData = localStorage.getItem("retailInvoices");
    if (storedData) {
      const parsed = JSON.parse(storedData);

      const normalized = parsed
        .map((inv: any) => {
          if (inv.items) {
            return inv.items.map((row: any) => ({
              id: inv.id || Date.now() + Math.random(),
              company: inv.company,
              supplier: inv.supplier,
              item: row.name,
              quantity: row.qty,
              mrp: row.mrp,
              total: row.qty * (row.mrp - (row.discount || 0)),
            }));
          }
          return inv;
        })
        .flat();

      setTableData(normalized);
      localStorage.setItem("retailInvoices", JSON.stringify(normalized));
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
        localStorage.setItem("retailInvoices", JSON.stringify(updatedData));
      }}
    />
  </Paper>
);}