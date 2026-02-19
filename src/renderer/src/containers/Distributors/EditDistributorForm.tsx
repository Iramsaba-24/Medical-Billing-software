import {Dialog, DialogTitle, DialogContent,DialogActions,Button,TextField,Select, MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";

export type Distributor = {
  id: string;
  companyName: string;
  mobile: string;
  email: string;
  date: string;
  registrationNumber: string;
  address: string;
  status: "Active" | "Inactive";
};

type Props = {
  editingRow: Distributor | null;
  onClose: () => void;
  onSave: (data: Distributor) => void;
};

const EditDistributorForm = ({
  editingRow,
  onClose,
  onSave,
}: Props) => {
  const [formData, setFormData] =
    useState<Distributor | null>(null);

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
      <DialogTitle>Edit Distributor</DialogTitle>

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Company Name"
          value={formData.companyName}
          onChange={(e) =>
            setFormData({
              ...formData,
              companyName: e.target.value,
            })
          }
        />

        <TextField
          label="Registration No"
          value={formData.registrationNumber}
          onChange={(e) =>
            setFormData({
              ...formData,
              registrationNumber: e.target.value,
            })
          }
        />

        <TextField
          label="Mobile"
          value={formData.mobile}
          onChange={(e) =>
            setFormData({
              ...formData,
              mobile: e.target.value,
            })
          }
        />

        <TextField
          label="Email"
          value={formData.email}
          onChange={(e) =>
            setFormData({
              ...formData,
              email: e.target.value,
            })
          }
        />

        <TextField
          label="Date"
          value={formData.date}
          onChange={(e) =>
            setFormData({
              ...formData,
              date: e.target.value,
            })
          }
        />

        <TextField
          label="Address"
          value={formData.address}
          onChange={(e) =>
            setFormData({
              ...formData,
              address: e.target.value,
            })
          }
        />

        <Select
          value={formData.status}
          onChange={(e) =>
            setFormData({
              ...formData,
              status: e.target.value as
                | "Active"
                | "Inactive",
            })
          }
        >
          <MenuItem value="Active">
            Active
          </MenuItem>
          <MenuItem value="Inactive">
            Inactive
          </MenuItem>
        </Select>
      </DialogContent>

      <DialogActions sx={{ gap: 2, px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            px: 4,
            width: "20%",
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
            width: "20%",
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

export default EditDistributorForm;
