import { Box, Button, Typography, TextField, MenuItem, IconButton, Divider, Paper } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { ItemRow } from "@/containers/Customer/AddCustomerForm";
import { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";


export type InventoryItem = {
  itemName: string;
  itemId: string;
  medicineGroup: string;
  stockQty: number;
  pricePerUnit: number;
  gst: "12%";
  expiryDate: string;
  supplier: string;
};

// Define the props from the component
interface ItemsSectionProps {
  rows: ItemRow[];
  setRows: (rows: ItemRow[]) => void;
  gst: number;
  setGst: (val: number) => void;
  paymentMode: string;
  setPaymentMode: (val: string) => void;
  finalTotal: number;
  isSubmitted: boolean;
}

const ItemsSection = ({ rows, setRows, gst, setGst, paymentMode, setPaymentMode, finalTotal, isSubmitted }: ItemsSectionProps) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("inventory");
    if (!stored) return setInventory([]);
    const parsed: InventoryItem[] = JSON.parse(stored).map(
      (item: InventoryItem) => ({
        ...item,
        stockQty: Number(item.stockQty),
      })
    );
    setInventory(parsed);
  }, []);

  // Logic to add a new empty row for a new medicine
  const addRow = () => setRows([...rows, { id: Date.now(), name: "", qty: "", price: "" }]);

  // Logic to remove a row by its ID
  const removeRow = (id: number) => setRows(rows.filter((r) => r.id !== id));

  // Logic to update values like Name, Quantity, or Price in a specific row
  const updateRow = (id: number, field: keyof ItemRow, value: string | number) => {
    setRows(rows.map((r) => {
      if (r.id === id) {
        // Prevent typing negative numbers for quantity and price
        if ((field === "qty" || field === "price") && value !== "" && Number(value) < 0) return r;

        // For name, no special character removal needed as it's selected from dropdown
        return { ...r, [field]: value };
      }
      return r;
    }));
  };

  // Handler for item name selection
  const handleNameChange = (id: number, selectedName: string) => {
    const item = inventory.find(i => i.itemName === selectedName);

    setRows(rows.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          name: selectedName,
          price: item ? item.pricePerUnit : r.price
        };
      }
      return r;
    }));
  };

  return (
    <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: "7px", border: "1px solid #e0e0e0" }} elevation={3}>

      {/* Header with Title and Add Button */}
      <Box display="flex" justifyContent="space-between" mb={2} alignItems="center">
        <Typography variant="h6" fontWeight={600}>Items List</Typography>
        <Button startIcon={<Add />} onClick={addRow} sx={{ color: "#248a76", fontWeight: "bold" }}>ADD ITEM</Button>
      </Box>
      <Divider sx={{ mb: 3 }} />

      {/* Medicine Rows Responsive Grid */}
      {rows.map((row) => {
        // Validation: Show error if fields are empty after clicking Save
        const nameError = isSubmitted && row.name.trim() === "";
        const qtyError = isSubmitted && (row.qty === "" || Number(row.qty) <= 0);
        const priceError = isSubmitted && (row.price === "" || Number(row.price) <= 0);

        return (
          <Box key={row.id} sx={{
            display: "grid",
            // Laptop: 5 columns in a row | Mobile: 1 column (Stacked)
            gridTemplateColumns: { md: "4fr 1fr 1.5fr 1.5fr 50px", xs: "1fr" },
            gap: 2,
            mb: { xs: 4, md: 2 }, // Extra gap between rows on mobile
            alignItems: "start"
          }}>
            {/* Item Name  */}
            <Autocomplete
              options={inventory}
              getOptionLabel={(option) => option.itemName}
              value={inventory.find(i => i.itemName === row.name) || null}
              onChange={(_, selected) => {
                handleNameChange(row.id, selected?.itemName || "");
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Item Name"
                  error={nameError}
                  fullWidth
                />
              )}
            />


            {/* Quantity Input Blocked 'e', '-', '+' keys */}
            <TextField
              fullWidth
              label="Qty"
              type="number"
              value={row.qty}
              error={qtyError}
              onKeyDown={(e) => ["e", "E", "-", "+"].includes(e.key) && e.preventDefault()}
              onChange={(e) => updateRow(row.id, "qty", e.target.value === "" ? "" : Number(e.target.value))}
            />

            {/* Price Input */}
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={row.price}
              error={priceError}
              onKeyDown={(e) => ["e", "E", "-", "+"].includes(e.key) && e.preventDefault()}
              onChange={(e) => updateRow(row.id, "price", e.target.value === "" ? "" : Number(e.target.value))}
            />

            {/* Row Total (Calculated Automatically) */}
            <TextField label="Total" value={(Number(row.qty) * Number(row.price)).toFixed(2)} disabled />

            {/* Delete Icon (Hidden if only one row exists) */}
            <Box display="flex" justifyContent="center">
              {rows.length > 1 && (
                <IconButton onClick={() => removeRow(row.id)} color="error"  ><Remove /></IconButton>
              )}
            </Box>
          </Box>
        );
      })}

      {/* Billing Summary (Payment, GST, Total) */}
      <Box sx={{
        borderTop: "1px solid #eee",
        pt: 3,
        display: "flex",
        flexDirection: "column",
        gap: 3
      }}>

        {/* Payment and GST Selectors - Mobile: Column | Tablet+: Row */}
        <Box sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          width: "100%",
          maxWidth: { md: "500px" }
        }}>
          {/* Dropdown for Payment Mode */}
          <TextField select label="Payment Mode" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} fullWidth size="small">
            {["Cash", "UPI", "Card"].map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
          </TextField>

          {/* Dropdown for GST Percentage */}
          <TextField select label="GST %" value={gst} onChange={(e) => setGst(Number(e.target.value))} fullWidth size="small">
            {[5, 12, 18].map((g) => <MenuItem key={g} value={g}>{g}%</MenuItem>)}
          </TextField>
        </Box>

        {/* Grand Total Display - Mobile: Center | Laptop: End */}
        <Box sx={{
          display: "flex",
          justifyContent: { xs: "center", md: "flex-end" },
          width: "100%"
        }}>
          <Typography variant="h6" sx={{
            fontWeight: "bold",
            bgcolor: "#e8f5f2",
            px: { xs: 5, md: 3 },
            py: 1,
            borderRadius: "8px",
            width: { xs: "100%", sm: "auto" },
            textAlign: "center"
          }}>
            Grand Total: ₹{finalTotal.toFixed(2)}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default ItemsSection;