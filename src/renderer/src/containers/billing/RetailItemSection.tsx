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
import { getMedicines, MedicineResponse } from "@/service/medicineService";

export interface ItemRow {
  retailItemId: number;
  retailInvoiceId?: number;
  medicineId: string;
  medicineName?: string;
  strength?: string;      
  companyName?: string;
  expiryDate?: string;
  quantity: number | "";
  price: number | "";
  amount?: number;
  
}

export type InventoryItem = {
  itemName: string;
  medicineId: string;
  quantity: number;
  pricePerUnit: number;
  expiryDate: string;
};

interface RetailItemsSectionProps {
  rows: ItemRow[];
  setRows: (rows: ItemRow[]) => void;
  finalTotal: number;
  isSubmitted: boolean;
  gst?: number;
  setGst?: (value: number) => void;
}

const RetailItemSection = ({
  rows,
  setRows,

  isSubmitted,
  gst = 0,
  setGst,
}: RetailItemsSectionProps) => {

  
const [inventory, setInventory] = useState<MedicineResponse[]>([]);

 useEffect(() => {
  const fetchMedicines = async () => {
    try {
      const data = await getMedicines();
      setInventory(data);
    } catch (error) {
      console.error("Error fetching medicines", error);
    }
  };
  fetchMedicines();
}, []);

 const itemOptions = Array.from(
  new Map(
    inventory.map((item) => [
      item.medicineName,
      {
        label: item.medicineName,
        value: item.medicineName,
      },
    ])
  ).values()
);

  const getStrengthOptions = (medicineName?: string) => {
  if (!medicineName) return [];

const strengths = inventory
  .filter(
    (item) =>
      item.medicineName === medicineName && item.strength
  )
  .map((item) => item.strength as string);


  const uniqueStrengths = Array.from(new Set(strengths));

  return uniqueStrengths.map((s) => ({
    label: s,
    value: s,
  }));
};


const addRow = () =>
  setRows([
    ...rows,
    {
      retailItemId: Date.now(),
      medicineId: "",
      quantity: 1,
      price: "",
      amount: 0,
    },
  ]);

  const removeRow = (id: number) => setRows(rows.filter((r) => r.retailItemId  !== id));

  const updateRow = (
    id: number,
    field: keyof ItemRow,
    value: string | number
  ) => {
    setRows(
      rows.map((r) => {
        if (r.retailItemId  === id) {
          if (
            (field === "quantity" || field === "price") &&
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
  setRows(
    rows.map((r) => {
      if (r.retailItemId === id) {
        return {
          ...r,
          medicineId: "",
          medicineName: selectedName,
          strength: "",
          companyName: "",
          expiryDate: "",
          price: "",
        };
      }
      return r;
    })
  );
};


  const subTotal = rows.reduce((acc, row) => {
    return acc + Number(row.quantity) * Number(row.price);
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
          isSubmitted && (row.quantity === "" || Number(row.quantity) <= 0);

        const priceError =
          isSubmitted && (row.price === "" || Number(row.price) <= 0);

        const nameError = isSubmitted && row.medicineId.trim() === "";

        return (
          <Box
            key={row.retailItemId}
            sx={{
              display: "grid",
              gridTemplateColumns: {
  md: "3fr 2fr 2fr 1fr 1.5fr 1.5fr 50px",
  xs: "1fr",
},
              gap: 2,
              mb: { xs: 4, md: 2 },
              alignItems: "start",
            }}
          >
            <DropdownField
              name={`item_${row.retailItemId}`}
              label="Item Name"
              options={itemOptions}
value={row.medicineName || ""}
              editable
              freeSolo={false}
              
              required
              error={nameError}
              helperText={nameError ? "Please select item" : ""}
              onChangeCallback={(value) => {
                handleNameChange(row.retailItemId, value);
              }}
            />


<DropdownField
  name={`strength_${row.retailItemId}`}
  label="Strength"
  options={getStrengthOptions(row.medicineName)}
  value={row.strength || ""}
  editable
  onChangeCallback={(value) => {
    const selected = inventory.find(
  (i) =>
    i.medicineName === row.medicineName &&
    i.strength === value &&
    i.medicineId
);

if (selected) {
  setRows(
    rows.map((r) =>
      r.retailItemId === row.retailItemId
        ? {
            ...r,
            strength: selected.strength,
            medicineId: String(selected.medicineId),
          price: Number(selected.mrpPerTablet),
            companyName: selected.companyName,
            expiryDate: selected.expiryDate,
          }
        : r
    )
  );
}
  }}
/>

<TextField
  fullWidth
  label="Company"
  value={row.companyName || ""}
  onChange={(e) =>
    updateRow(row.retailItemId, "companyName", e.target.value)
  }
/>

            <TextField
              fullWidth
              label="Qty"
              type="number"
              value={row.quantity}
              error={qtyError}
              onKeyDown={(e) =>
                ["e", "E", "-", "+"].includes(e.key) && e.preventDefault()
              }
              onChange={(e) =>
                updateRow(
                  row.retailItemId,
                  "quantity",
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
              value={(Number(row.quantity) * Number(row.price)).toFixed(2)}
              disabled
            />

            <Box display="flex" justifyContent="center">
              {rows.length > 1 && (
                <IconButton onClick={() => removeRow(row.retailItemId)} color="error">
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

export default RetailItemSection;