import React, { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Slide,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  UniversalTable,
  type Column,
  ACTION_KEY,
} from "@/components/uncontrolled/UniversalTable";
import EditSalesForm from "./EditSalesForm";
import { URL_PATH } from "@/constants/UrlPath";

//  IMPORT reusable functions
import { showConfirmation, showToast } from "@/components/uncontrolled/ToastMessage.tsx"; 

// TYPES 
export interface SalesData {
  id: number;
  name: string;
  medicine: string;
  quantity: number;
  totalPrice: number;
  date: string;
  time: string;
  [key: string]: string | number;
}

//  INITIAL DATA 
const initialSalesData: SalesData[] = [
  { id: 1, name: "Kishor Kedar", medicine: "Medicine Two", quantity: 1, totalPrice: 152, date: "Jan 05, 2026", time: "10:00AM" },
  { id: 2, name: "Rohit Raut", medicine: "Paracetamol", quantity: 5, totalPrice: 57, date: "Jan 05, 2026", time: "11:00AM" },
  { id: 3, name: "Smita Rao", medicine: "Honitus", quantity: 1, totalPrice: 125, date: "Jan 04, 2026", time: "04:00PM" },
  { id: 4, name: "Shilpa Rathod", medicine: "Eladi", quantity: 1, totalPrice: 160, date: "Jan 03, 2026", time: "12:00PM" },
  { id: 5, name: "Kanta Jain", medicine: "Insulin", quantity: 10, totalPrice: 1799, date: "Jan 01, 2026", time: "10:00AM" },
  { id: 6, name: "Amit Sharma", medicine: "Aspirin", quantity: 3, totalPrice: 45, date: "Dec 30, 2025", time: "02:00PM" },
];

//  COMPONENT
const SalesTable: React.FC = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [salesData, setSalesData] = useState<SalesData[]>(initialSalesData);
  const [editingRow, setEditingRow] = useState<SalesData | null>(null);

  //  SEARCH 
  const filteredSalesData = useMemo(() => {
    if (!searchQuery.trim()) return salesData;

    return salesData.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.medicine.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, salesData]);

  //  TABLE COLUMNS
  const columns: Column<SalesData>[] = [
    { key: "name", label: "Name" },
    { key: "medicine", label: "Medicine" },
    { key: "quantity", label: "Qty" },
    {
      key: "totalPrice",
      label: "Price",
      render: (row) => `₹ ${row.totalPrice.toFixed(2)}`,
    },
    { key: "date", label: "Date" },
    { key: "time", label: "Time" },
    { key: ACTION_KEY, label: "Actions" },
  ];

  //  EDIT 
  const handleEdit = (row: SalesData) => {
    setEditingRow(row);
  };

  //  DELETE
  const handleDelete = async (row: SalesData) => {
    const confirmed = await showConfirmation(
      `Are you sure you want to delete ${row.name}'s record?`,
      "Confirm Delete"
    );

    if (confirmed) {
      setSalesData((prev) =>
        prev.filter((item) => item.id !== row.id)
      );

      //  Toast from reusable
      showToast("success", `${row.name}'s record deleted successfully`);
    }
  };

  // ---------------- SAVE EDIT ----------------
  const handleSaveEdit = (data: SalesData) => {
    setSalesData((prev) =>
      prev.map((item) =>
        item.id === data.id ? { ...item, ...data } : item
      )
    );

    setEditingRow(null);

    showToast("success", "Record updated successfully");
  };

  return (
    <>
      <Slide direction="up" in timeout={600}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Typography variant="h6" fontWeight={600}>
                Recent Sales List
              </Typography>

              <TextField
                size="small"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: 200 }}
              />
            </Box>

            <Chip label="All Records" sx={{ mb: 2 }} />

            <UniversalTable<SalesData>
              data={filteredSalesData}
              columns={columns}
              rowsPerPage={5}
              enableCheckbox
              getRowId={(row) => row.id}
              actions={{
                view: (row) =>
                  navigate(URL_PATH.SalesView, {
                    state: { sale: row },
                  }),
                edit: handleEdit,
                delete: handleDelete,
              }}
            />
          </CardContent>
        </Card>
      </Slide>

      {/* Edit Dialog */}
      <EditSalesForm
        editingRow={editingRow}
        onClose={() => setEditingRow(null)}
        onSave={handleSaveEdit}
      />
    </>
  );
};

export default SalesTable;
