import { Box, Typography } from "@mui/material";
import {
  UniversalTable,
  Column,
} from "@/components/uncontrolled/UniversalTable";

//  import SendIcon from '@mui/icons-material/Send';
import ShareMenu from "./ShareMenu";

type InvoiceItem = {
  id: number;
  company: string;
  supplier: string;
  item: string;
  quantity: number;
  mrp: number;
  total: number;
};
import { useEffect, useState } from "react";

const columns: Column<InvoiceItem>[] = [
  {
    key: "company",
    label: "Company",
  },
  {
    key: "supplier",
    label: "Supplier",
  },
  {
    key: "item",
    label: "Item",
  },
  {
    key: "quantity",
    label: "Quantity",
  },
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
    render: (row) => (
      <ShareMenu itemName={row.item} />
    ),
  },
];


    
export default function RetailInvoiceList() {
  const [tableData, setTableData] = useState<InvoiceItem[]>([]);
useEffect(() => {
  const storedData = localStorage.getItem("retailInvoices");
  if (storedData) {
    const parsed = JSON.parse(storedData);

    // normalize old invoices with items array
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

    // Optional: overwrite localStorage to avoid old structure again
    localStorage.setItem("retailInvoices", JSON.stringify(normalized));
  }
}, []);
    
  return (
    <Box sx={{ boxShadow: 2, padding: 2, borderRadius: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Typography sx={{ fontSize: 20 }}>Retail Invoice Details</Typography>
        
      </Box>
      <UniversalTable<InvoiceItem>
        data={tableData}
        columns={columns}
        // caption="Inventory List"
        showSearch
        showExport
        enableCheckbox
        rowsPerPage={5}
        getRowId={(row) => row.id}
        onDeleteSelected={(rows) => {
  const idsToDelete = rows.map((r) => r.id);
  
  const updatedData = tableData.filter((row) => !idsToDelete.includes(row.id));
  setTableData(updatedData);
  localStorage.setItem("retailInvoices", JSON.stringify(updatedData));
}}
      />
    </Box>
  );
}
