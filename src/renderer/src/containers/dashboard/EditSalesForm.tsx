import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { SalesData } from "./SalesTable";
import { InventoryItem } from "@/containers/inventory/InvetoryList";
import DropdownField from "@/components/controlled/DropdownField";
import { useForm, FormProvider } from "react-hook-form";

type Props = {
  editingRow: SalesData | null;
  onClose: () => void;
  onSave: (data: SalesData) => void;
};

const EditSalesForm = ({ editingRow, onClose, onSave }: Props) => {
  const methods = useForm();
  
  const [formData, setFormData] = useState<SalesData | null>(null);
const [inventory, setInventory] = useState<InventoryItem[]>([]);

useEffect(() => {
  if (editingRow) {
    setFormData(editingRow);

    methods.reset({
      medicine: editingRow.medicine,
    });
  }
}, [editingRow, methods]);

useEffect(() => {
  const stored = localStorage.getItem("inventory");
  if (!stored) return;
  setInventory(JSON.parse(stored));
}, []);

if (!formData) return null;
  return (
    <FormProvider {...methods}>
    <Dialog
      open={Boolean(editingRow)}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Edit Sales Record</DialogTitle>

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          sx={{ mt: 1}}
          label="Customer Name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
        />

<DropdownField
  label="Medicine"
  name="medicine"
  options={inventory.map((item) => ({
    label: item.itemName,
    value: item.itemName,
  }))}
  required
  onChangeCallback={(selectedValue) => {
    const selectedItem = inventory.find(
      (item) => item.itemName === selectedValue
    );

    if (!selectedItem) return;

    setFormData((prev) => ({
      ...prev!,
      medicine: selectedValue,
      quantity: 1,
      totalPrice: selectedItem.pricePerUnit,
    }));
  }}
/>

<TextField
  label="Quantity"
  type="number"
  value={formData.quantity}
  onChange={(e) => {
    const qty = Number(e.target.value);

    const selectedItem = inventory.find(
      (item) => item.itemName === formData.medicine
    );

    if (!selectedItem) return;

    setFormData({
      ...formData,
      quantity: qty,
      totalPrice: qty * selectedItem.pricePerUnit, // ✅ auto total
    });
  }}
/>

<TextField
  label="Total Price"
  type="number"
  value={formData.totalPrice}
  InputProps={{ readOnly: true }}
/>

        <TextField
          label="Date"
          value={formData.date}
          onChange={(e) =>
            setFormData({ ...formData, date: e.target.value })
          }
        />

        <TextField
          label="Time"
          value={formData.time}
          onChange={(e) =>
            setFormData({ ...formData, time: e.target.value })
          }
        />
      </DialogContent>

      <DialogActions sx={{ gap: 2, px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            px: 4,
            width: "18%",
            textTransform: "none",
            border: "2px solid #1b7f6b",
            color: "#1b7f6b",
            "&:hover": {
              backgroundColor: "#1b7f6b",
              color: "#fff",
            },
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={() => {
            onSave(formData);
            onClose();
          }}
          sx={{
            px: 4,
            width: "18%",
            textTransform: "none",
            backgroundColor: "#1b7f6b",
            "&:hover": {
              backgroundColor: "#fff",
              color: "#1b7f6b",
              border: "2px solid #1b7f6b",
            },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
    </FormProvider>
  );
};

export default EditSalesForm;
