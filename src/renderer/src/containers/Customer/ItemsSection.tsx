 import { Box, Button, Typography, TextField, MenuItem, IconButton, Divider, Paper } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { useEffect } from "react"; 
import { ItemRow } from "@/containers/customer/AddCustomerForm";

// Defining the types for the props passed to this component
interface ItemsSectionProps {
  rows: ItemRow[];
  setRows: (rows: ItemRow[]) => void;
  gst: number;
  setGst: (val: number) => void;
  paymentMode: string;
  setPaymentMode: (val: string) => void;
  finalTotal: number;
}

const ItemsSection = ({ rows, setRows, gst, setGst, paymentMode, setPaymentMode, finalTotal }: ItemsSectionProps) => {

  // Save the items list to local storage whenever the rows state changes
  useEffect(() => {
    localStorage.setItem("customer_items", JSON.stringify(rows));
  }, [rows]);

  // Function to add a new empty row to the item list
  const addRow = () => {
    setRows([...rows, { id: Number(Date.now()), name: "", qty: 1, price: "" }]);
  };

  // Function to remove a specific row using its ID
  const removeRow = (id: number) => setRows(rows.filter((r) => r.id !== id));

  // Function to update values (name, qty, price) in a specific row
  const updateRow = (id: number, field: keyof ItemRow, value: string | number) => {
    setRows(rows.map((r) => {
      if (r.id === id) {
        //  negative numbers for quantity and price
        if ((field === "qty" || field === "price") && value !== "" && Number(value) < 0) {
          return r; 
        }
        // Validation Only allow letters and spaces in the Item Name
        if (field === "name") {
          return { ...r, [field]: String(value).replace(/[^a-zA-Z\s]/g, "") };
        }
        return { ...r, [field]: value as ItemRow[typeof field] };
      }
      return r;
    }));
  };

  return (
    <Paper sx={{ p: 3, borderRadius: "7px", border: "1px solid #e0e0e0" }} elevation={0}>
      {/* Header section with Title and Add Item button */}
      <Box display="flex" justifyContent="space-between" mb={2} alignItems="center">
        <Typography variant="h6" fontWeight={600}>Items List</Typography>
        <Button startIcon={<Add />} onClick={addRow} sx={{ color: "#248a76", fontWeight: "bold", textTransform: "none" }}>
          ADD ITEM
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Loop through the rows to display input fields for each item */}
      {rows.map((row) => (
        <Box 
          key={row.id} 
          sx={{ 
            display: "grid", 
            gridTemplateColumns: { md: "4fr 1fr 1.5fr 1.5fr 50px", xs: "1fr" }, 
            gap: 2, 
            mb: 1, 
            alignItems: "start" 
          }}
        >
          {/* Item Name Input */}
          <TextField
            label="Item Name"
            value={row.name}
            error={row.name.trim() === ""}
            helperText={row.name.trim() === "" ? "Item Name is Required" : " "}
            onChange={(e) => updateRow(row.id, "name", e.target.value)}
          />

          {/* Quantity Input */}
          <TextField
            label="Qty"
            type="number"
            value={row.qty}
            error={row.qty === "" || Number(row.qty) <= 0}
            helperText={row.qty === "" || Number(row.qty) <= 0 ? "Only positive numbers" : " "}
            onKeyDown={(e) => ["e", "E", "-", "+"].includes(e.key) && e.preventDefault()}
            onChange={(e) => updateRow(row.id, "qty", e.target.value === "" ? "" : Number(e.target.value))}
          />

          {/* Price Input */}
          <TextField
            label="Price"
            type="number"
            value={row.price}
            error={row.price === "" || Number(row.price) <= 0}
            helperText={row.price === "" || Number(row.price) <= 0 ? "Only positive numbers" : " "}
            onKeyDown={(e) => ["e", "E", "-", "+"].includes(e.key) && e.preventDefault()}
            onChange={(e) => updateRow(row.id, "price", e.target.value === "" ? "" : Number(e.target.value))}
          />

          {/* Read-only Total field (Qty * Price) */}
          <TextField
            label="Total"
            value={(Number(row.qty) * Number(row.price)).toFixed(2) || 0}
            disabled
            helperText=" "
          />

          {/* Remove Row Button - Hidden if only one row exists */}
          <Box display="flex" justifyContent="center">
            {rows.length > 1 && (
              <IconButton onClick={() => removeRow(row.id)} color="error" sx={{ mt: 1 }}>
                <Remove />
              </IconButton>
            )}
          </Box>
        </Box>
      ))}

      {/* Footer section for Payment Mode, GST selection, and Final Total */}
      <Box sx={{ borderTop: "1px solid #eee", pt: 2, display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", alignItems: { xs: "stretch", md: "center" }, gap: 2 }}>
        
        <Box sx={{ display: "flex", gap: 2, width: { md: "400px", xs: "100%" }, flexDirection: { xs: "column", sm: "row" } }}>
          {/* Payment Mode Dropdown */}
          <TextField select label="Payment" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} fullWidth size="small">
            {["Cash", "UPI", "Card"].map((m) => (
              <MenuItem key={m} value={m}>{m}</MenuItem>
            ))}
          </TextField>

          {/* GST Percentage Dropdown */}
          <TextField select label="GST" value={gst} onChange={(e) => setGst(Number(e.target.value))} fullWidth size="small">
            {[5, 12, 18].map((g) => (
              <MenuItem key={g} value={g}>{g}%</MenuItem>
            ))}
          </TextField>
        </Box>

        {/* Display Final Calculated Total */}
        <Typography variant="h6" sx={{ fontWeight: "bold", bgcolor: "#e8f5f2", px: 3, py: 0.5, borderRadius: "8px", textAlign: "center" }}>
          Total: ₹{finalTotal.toFixed(2)}
        </Typography>

      </Box>
    </Paper>
  );
};

export default ItemsSection;