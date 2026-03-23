import {
  Box,
  Button,
  Typography,
  TextField,
  IconButton,
  Divider,
  Paper,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { useEffect, useState } from "react";
import DropdownField from "@/components/controlled/DropdownField";

export interface ItemRow {
  id: number;
  name: string;
  qty: number | "";
  price: number | "";
  expiry?: string;
}

export type InventoryItem = {
  itemName: string;
  itemId: string;
  medicineGroup: string;
  stockQty: number;
  pricePerUnit: number;
  expiryDate: string;
  supplier: string;
};

interface ItemsSectionProps {
  rows: ItemRow[];
  setRows: (rows: ItemRow[]) => void;
  finalTotal: number;
  isSubmitted: boolean;
  gst?: number;
  setGst?: (value: number) => void;
}

const ItemsSection = ({
  rows,
  setRows,

  isSubmitted,
  gst = 0,
  setGst,
}: ItemsSectionProps) => {
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

  const itemOptions = inventory.map((item) => ({
    label: item.itemName,
    value: item.itemName,
  }));

  const addRow = () =>
    setRows([...rows, { id: Date.now(), name: "", qty: "", price: "", expiry: "" }]);

  const removeRow = (id: number) => setRows(rows.filter((r) => r.id !== id));

  const updateRow = (
    id: number,
    field: keyof ItemRow,
    value: string | number
  ) => {
    setRows(
      rows.map((r) => {
        if (r.id === id) {
          if (
            (field === "qty" || field === "price") &&
            value !== "" &&
            Number(value) < 0
          )
            return r;

          return { ...r, [field]: value };
        }
        return r;
      })
    );
  };

  const handleNameChange = (id: number, selectedName: string) => {
    const item = inventory.find(
      (i) =>
        i.itemName.trim().toLowerCase() === selectedName.trim().toLowerCase()
    );

    setRows(
      rows.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            name: selectedName,
            price: item ? Number(item.pricePerUnit) : "",
            expiry: item ? item.expiryDate : "",
          };
        }
        return r;
      })
    );
  };

  const subTotal = rows.reduce((acc, row) => {
    return acc + Number(row.qty) * Number(row.price);
  }, 0);

  const finalWithGst = subTotal + (subTotal * gst) / 100;

  return (
    <Paper
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: "7px",
        border: "1px solid #e0e0e0",
      }}
      elevation={3}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        mb={2}
        alignItems="center"
      >
        <Typography variant="h6" fontWeight={600}>
          Items List
        </Typography>

        <Button
          startIcon={<Add />}
          onClick={addRow}
          sx={{ color: "#248a76", fontWeight: "bold" }}
        >
          ADD ITEM
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {rows.map((row) => {
        const qtyError =
          isSubmitted && (row.qty === "" || Number(row.qty) <= 0);

        const priceError =
          isSubmitted && (row.price === "" || Number(row.price) <= 0);

        const nameError = isSubmitted && row.name.trim() === "";

        return (
          <Box
            key={row.id}
            sx={{
              display: "grid",
              gridTemplateColumns: {
                md: "4fr 1fr 1.5fr 1.5fr 50px",
                xs: "1fr",
              },
              gap: 2,
              mb: { xs: 4, md: 2 },
              alignItems: "start",
            }}
          >
            <DropdownField
              name={`item_${row.id}`}
              label="Item Name"
              options={itemOptions}
              value={row.name}
              editable
              freeSolo={false}
              alphanumeric
              required
              error={nameError}
              helperText={nameError ? "Please select item" : ""}
              onChangeCallback={(value) => {
                handleNameChange(row.id, value);
              }}
            />

            <TextField
              fullWidth
              label="Qty"
              type="number"
              value={row.qty}
              error={qtyError}
              onKeyDown={(e) =>
                ["e", "E", "-", "+"].includes(e.key) && e.preventDefault()
              }
              onChange={(e) =>
                updateRow(
                  row.id,
                  "qty",
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
            />

            <TextField
              fullWidth
              label="Price"
              type="number"
              required
              disabled
              value={row.price}
              error={priceError}
            />

            <TextField
              label="Total"
              value={(Number(row.qty) * Number(row.price)).toFixed(2)}
              disabled
            />

            <Box display="flex" justifyContent="center">
              {rows.length > 1 && (
                <IconButton onClick={() => removeRow(row.id)} color="error">
                  <Remove />
                </IconButton>
              )}
            </Box>
          </Box>
        );
      })}

      <Box
        sx={{
          borderTop: "1px solid #eee",
          pt: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* GST Dropdown */}
        {setGst && (
          <Box sx={{ width: "150px" }}>
            <DropdownField
              name="gst"
              label="GST (%)"
              value={String(gst)}
              options={[
                { label: "5%", value: "5" },
                { label: "12%", value: "12" },
                { label: "18%", value: "18" },
              ]}
              onChangeCallback={(value) => setGst(Number(value))}
            />
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "center", md: "flex-end" },
            width: "100%",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              bgcolor: "#e8f5f2",
              px: { xs: 5, md: 3 },
              py: 1,
              borderRadius: "8px",
              width: { xs: "100%", sm: "auto" },
              textAlign: "center",
            }}
          >
            Grand Total: ₹{finalWithGst.toFixed(2)}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default ItemsSection;