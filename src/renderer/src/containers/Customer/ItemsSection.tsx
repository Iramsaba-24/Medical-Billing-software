 import { Box, Button, Typography, Grid, TextField, MenuItem, IconButton, Divider, Paper } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { ItemRow } from "@/containers/customer/AddCustomerForm";

// Define what information this component needs from the parent
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

  // Function to add a new empty row for a medicine
  const addRow = () => setRows([...rows, { id: Date.now(), name: "", qty: "", price: "" }]);

  // Function to remove a specific row using its ID
  const removeRow = (id: number) => setRows(rows.filter(r => r.id !== id));

  // Function to update values (name, qty, or price) in a specific row
  const updateRow = (id: number, field: keyof ItemRow, value: string | number) => {
    setRows(rows.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  return (
    <Paper 
      sx={{ p: { xs: 2, md: 3 }, borderRadius: "7px", border: "1px solid #e0e0e0", boxShadow: "0px 3px 6px rgba(0,0,0,0.1)" }} 
      elevation={0}
    >
      {/* Title and Add Button */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h6" fontWeight={600}>Items List</Typography>
        <Button  size="small"   startIcon={<Add />}   onClick={addRow} 
          sx={{ color: "#248a76", fontWeight: "bold", textTransform: "none" }} >
          Add Item
        </Button>
      </Box>
      
      <Divider sx={{ mb: 3 }} />

      {/*  Loop through each row and create input fields */}
      {rows.map((row, i) => (
        <Box key={row.id} sx={{ mb: 2, p: { xs: 1.5, md: 0 }, bgcolor: { xs: "#fcfcfc", md: "transparent" }, borderRadius: "8px" }}>
          <Grid container spacing={2} alignItems="center">
            
            {/*  Medicine Name */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField   size="small" fullWidth label="Item Name" value={row.name} 
                onChange={(e) => updateRow(row.id, "name", e.target.value)}    />
            </Grid>

            {/* Quantity */}
            <Grid size={{ xs: 12, sm: 2 }}>
              <TextField  size="small" fullWidth label="Qty" type="number" value={row.qty} 
                onChange={(e) => updateRow(row.id, "qty", e.target.value === "" ? "" : Number(e.target.value))}  />
            </Grid>

            {/*  Price per item */}
            <Grid size={{ xs: 12, sm: 2 }}>
              <TextField   size="small" fullWidth label="Price" type="number" value={row.price} 
                onChange={(e) => updateRow(row.id, "price", e.target.value === "" ? "" : Number(e.target.value))}  />
            </Grid>

            {/*  Calculated Total for this row Qty * Price */}
            <Grid size={{ xs: 12, sm: 2 }}>
              <TextField   size="small" fullWidth label="Total" 
                value={(Number(row.qty) * Number(row.price)) || 0}  disabled  />
            </Grid>

            {/* Delete Button  */}
            <Grid size={{ xs: 12, sm: 2 }} textAlign={{ xs: "right", md: "center" }}>{rows.length > 1 && (
                <IconButton onClick={() => removeRow(row.id)} color="error">
                  <Remove />
                </IconButton>
              )}
            </Grid>
          </Grid>

          {/* Line separator for mobile view only */}
          {i !== rows.length - 1 && <Divider sx={{ my: 2, display: { md: "none" } }} />}
        </Box>
      ))}

      {/* Payment Mode, GST Selection, and  Total */}
      <Box sx={{  mt: 2, pt: 2, borderTop: "2px solid #f0f0f0",  display: 'flex', flexDirection: { xs: "column", md: "row" },   justifyContent: 'space-between', gap: 2, alignItems: 'center'  }}>
        
        {/* Payment & GST Dropdowns */}
        <Box sx={{ display: 'flex', flexDirection: { xs: "column", sm: "row" }, gap: 2, width: { xs: "100%", md: "400px" } }}>
          <TextField  select size="small" label="Payment" value={paymentMode} 
            onChange={(e) => setPaymentMode(e.target.value)} sx={{ flex: 1 }}  >
            {["Cash", "UPI", "Card"].map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
          </TextField>

          <TextField  select size="small" label="GST" value={gst} 
            onChange={(e) => setGst(Number(e.target.value))} sx={{ flex: 1 }}>
            {[5, 12, 18].map(g => <MenuItem key={g} value={g}>{g}%</MenuItem>)}
          </TextField>
        </Box>

        {/* Display Final Bill Amount */}
        <Typography variant="h5"  sx={{  fontWeight: "600", bgcolor: "#e8f5f2", px: 3, py: 1, 
            borderRadius: '12px', textAlign: "center", color: "#248a76" 
          }} >
          Total: ₹{finalTotal.toFixed(2)}
        </Typography>
      </Box>
    </Paper>
  );
};

export default ItemsSection;