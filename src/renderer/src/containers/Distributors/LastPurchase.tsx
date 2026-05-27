

import { Paper, Box, Typography } from "@mui/material";
import {
  UniversalTable,
  Column,
  ACTION_KEY,
} from "@/components/uncontrolled/UniversalTable";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "@/constants/ApiEndpoints";

/*  TYPES  */

type InvoiceItem = {
  item: string;
  stock: number;
  typeStrength: string;
  purchaseAmount: number;
  expiryDate: string;
};

type MedicineApi = {
  medicineId: number;
  medicineName: string;
  totalStockTablets: number;
  expiryDate: string;
  type: string;
  strength: string;
  distributorId: number;

  
  purchasePricePerStrip?: number;
  mrpPerStrip?: number;
};

type DistributorState = {
  id: string;
};

/*  COMPONENT */

export default function LastPurchase() {
  const [tableData, setTableData] = useState<InvoiceItem[]>([]);
  const location = useLocation();
  const distributor = location.state?.distributor as DistributorState;

  /*  COLUMNS  */

  const columns: Column<InvoiceItem>[] = [
    { key: "item", label: "Item" },
    { key: "stock", label: "Stock" },
    { key: "typeStrength", label: "Type / Strength" },

 
    { key: "purchaseAmount", label: "Purchase Amount" },

    { key: "expiryDate", label: "Expiry Date" },
    { key: ACTION_KEY, label: "Action" },
  ];

  /* FETCH DATA  */

  useEffect(() => {
    const fetchDistributorInventory = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get<{ data: MedicineApi[] }>(
          API_ENDPOINTS.MEDICINE,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        const medicines = response.data.data || [];
        const distributorId = Number(distributor?.id);

        const filtered = medicines.filter(
          (m) => Number(m.distributorId) === distributorId
        );

        /*   MAPPING  */

        const formatted: InvoiceItem[] = filtered.map((m) => ({
  item: m.medicineName,
  stock: m.totalStockTablets,
  typeStrength: `${m.type} / ${m.strength}`,

  // Purchase Price Per Strip 
  purchaseAmount: m.purchasePricePerStrip || 0,

  expiryDate: m.expiryDate.split("T")[0],
}));

        setTableData(formatted);
      } catch (error) {
        console.error("Error fetching last purchase:", error);
        setTableData([]);
      }
    };

    if (distributor?.id) {
      fetchDistributorInventory();
    }
  }, [distributor]);

  /*  DELETE ACTION  */

  const handleDeleteSelected = (rows: InvoiceItem[]) => {
    const ids = rows.map((r) => r.item);

    const updated = tableData.filter((row) => !ids.includes(row.item));

    setTableData(updated);

    localStorage.setItem(
      "currentLastPurchaseList",
      JSON.stringify(updated)
    );
  };

  const handleDelete = (row: InvoiceItem) => {
    const updated = tableData.filter((r) => r.item !== row.item);
    setTableData(updated);
  };

  /*  UI */

  return (
    <Paper sx={{ mt: 3, p: { xs: 1, md: 3 } }}>
      <Box sx={{ mb: 2 }}>
        <Typography fontSize={{ xs: 18, md: 22 }} fontWeight={600}>
          Last Purchased Details
        </Typography>
      </Box>

      <UniversalTable<InvoiceItem>
        data={tableData}
        columns={columns}
        showSearch
        showExport
        enableCheckbox
        rowsPerPage={5}
        getRowId={(row) => row.item}
        onDeleteSelected={handleDeleteSelected}
        actions={{
          delete: handleDelete,
        }}
      />
    </Paper>
  );
}