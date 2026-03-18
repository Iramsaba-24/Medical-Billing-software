
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import TextInputField from "@/components/controlled/TextInputField";
import DropdownField from "@/components/controlled/DropdownField";

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

  const methods = useForm<Distributor>({
    defaultValues: {
      id: "",
      companyName: "",
      mobile: "",
      email: "",
      date: "",
      registrationNumber: "",
      address: "",
      status: "Active",
    },
  });

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    if (editingRow) {
      reset(editingRow); // table madhla data same fill hoil
    }
  }, [editingRow, reset]);

  if (!editingRow) return null;

  const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ];

  return (
    <Dialog open={Boolean(editingRow)} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Distributor</DialogTitle>

      <FormProvider {...methods}>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

          <TextInputField
            name="companyName"
            label="Company Name"
            required
            maxLength={30}
          />

          <TextInputField
            name="registrationNumber"
            label="Registration No"
            type="number"
            maxLength={15}
          />

          <TextInputField
            name="mobile"
            label="Mobile Number"
            maxLength={10}
          />

          <TextInputField
            name="email"
            label="Email"
          />

          <TextInputField
            name="date"
            label="Date"
          />

          <TextInputField
            name="address"
            label="Address"
            inputType="textarea"
            rows={2}
          />

          {/* Status Dropdown */}
          <DropdownField
            name="status"
            label="Status"
            options={statusOptions}
            required
          />

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
            onClick={handleSubmit((data) => {
              onSave(data);
              onClose();
            })}
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

      </FormProvider>
    </Dialog>
  );
};

export default EditDistributorForm;