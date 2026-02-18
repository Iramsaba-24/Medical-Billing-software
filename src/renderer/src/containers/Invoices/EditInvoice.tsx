import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Invoice, InvoiceStatus } from "@/types/invoice";

type Props = {
  editingRow: Invoice | null;
  onClose: () => void;
  onSave: (data: Invoice) => void;
};

const EditInvoice = ({ editingRow, onClose, onSave }: Props) => {
  const [formData, setFormData] = useState<Invoice | null>(null);

  useEffect(() => {
    if (editingRow) {
      setFormData(editingRow);
    }
  }, [editingRow]);

  if (!formData) return null;

  const handleChange = (field: keyof Invoice, value: string | number) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  return (
    <Dialog open={Boolean(editingRow)} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Invoice</DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Invoice No"
          value={formData.invoice}
          disabled
        />

        <TextField
          label="Patient"
          value={formData.patient}
          onChange={(e) => handleChange("patient", e.target.value)}
        />

        <TextField
          label="Date"
          value={formData.date}
          onChange={(e) => handleChange("date", e.target.value)}
        />

        <TextField
          label="Price"
          type="number"
          value={formData.price}
          onChange={(e) =>
            handleChange("price", Number(e.target.value))
          }
        />

        <Select
          value={formData.status}
          onChange={(e) =>
            handleChange("status", e.target.value as InvoiceStatus)
          }
        >
          <MenuItem value="Paid">Paid</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Overdue">Overdue</MenuItem>
        </Select>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onSave(formData)}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditInvoice;
