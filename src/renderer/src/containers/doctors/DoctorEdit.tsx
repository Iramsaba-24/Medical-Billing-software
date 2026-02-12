import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";

type Doctor = {
  id: string;
  doctorName: string;
  degree: string;
  phone: string;
  address: string;
  status: "Active" | "Inactive";
};

type Props = {
  doctor: Doctor | null;
  onClose: () => void;
  onSave: (doctor: Doctor) => void;
};

const DoctorEdit = ({doctor, onClose, onSave}: Props) => {
  const [formData, setFormData] = useState<Doctor | null>(null);

  // update the doctor
  useEffect(() => {
    setFormData(doctor);
  }, [doctor]);
  if (!formData) return null;

  return (
    <Dialog open={Boolean(doctor)} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Doctor</DialogTitle>

      <DialogContent sx={{display: "flex", flexDirection: "column", gap: 2}}>
        <TextField
          label="Doctor Name"
          value={formData.doctorName}
          onChange={(e) =>
            setFormData({ ...formData, doctorName: e.target.value })
          }
        />

        <TextField
          label="Degree"
          value={formData.degree}
          onChange={(e) =>
            setFormData({ ...formData, degree: e.target.value })
          }
        />

        <TextField
          label="Phone"
          value={formData.phone}
          onChange={(e) =>
            setFormData({ ...formData, phone: e.target.value })
          }
        />

        <TextField
          label="Address"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
        />
      </DialogContent>

          {/* save & cancel button */}
      <DialogActions sx={{ gap: 2, px: 3, pb: 2 }}>
        <Button 
        onClick={onClose}
         sx={{
              px: 4,
              width:"18%",
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
          onClick={() => onSave(formData)}
          sx={{
              px: 4,
              width:"18%",                  
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

export default DoctorEdit;
