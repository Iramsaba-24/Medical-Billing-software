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

type Props = {
  editingRow: SalesData | null;
  onClose: () => void;
  onSave: (data: SalesData) => void;
};

const EditSalesForm = ({ editingRow, onClose, onSave }: Props) => {
  const [formData, setFormData] = useState<SalesData | null>(null);

  useEffect(() => {
    setFormData(editingRow);
  }, [editingRow]);

  if (!formData) return null;

  return (
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
          label="Customer Name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
        />

        <TextField
          label="Medicine"
          value={formData.medicine}
          onChange={(e) =>
            setFormData({ ...formData, medicine: e.target.value })
          }
        />

        <TextField
          label="Quantity"
          type="number"
          value={formData.quantity}
          onChange={(e) =>
            setFormData({
              ...formData,
              quantity: Number(e.target.value),
            })
          }
        />

        <TextField
          label="Total Price"
          type="number"
          value={formData.totalPrice}
          onChange={(e) =>
            setFormData({
              ...formData,
              totalPrice: Number(e.target.value),
            })
          }
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
  );
};

export default EditSalesForm;
