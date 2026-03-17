import MobileField from "@/components/controlled/MobileField";
import TextInputField from "@/components/controlled/TextInputField";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";

type Doctor = {
  id: string;
  doctorName: string;
  degree: string;
  phone: string;
  email: string;
  registrationNo: string;
  address: string;
  status: "Active" | "Inactive";
};

type Props = {
  doctor: Doctor | null;
  onClose: () => void;
  onSave: (doctor: Doctor) => void;
};

const DoctorEdit = ({ doctor, onClose, onSave }: Props) => {
  const methods = useForm<Doctor>({
    mode: "onChange",
    defaultValues: doctor || undefined,
  });
  const handleSave = (data: Doctor) => {
    onSave(data);
  };
  useEffect(() => {
    if (doctor) {
      methods.reset(doctor);
    }
  }, [doctor, methods]);
  return (
    <FormProvider {...methods}>
      <Dialog open={Boolean(doctor)} onClose={onClose} maxWidth="sm" fullWidth>
        <form onSubmit={methods.handleSubmit(handleSave)}>
          <DialogTitle >Edit Doctor</DialogTitle>

          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextInputField sx={{mt:1}}
              name="doctorName"
              label="Doctor Name"
              inputType="alphabet"
              required
              minLength={3}
              maxLength={30}
              rules={{ required: "Doctor Name is required" }}
            />

            <TextInputField
              name="degree"
              label="Degree"
              inputType="alphabet"
              required
              rules={{ required: "Degree is required" }}
            />

            <MobileField name="phone" label="Phone" countryCode required />

            <TextInputField
              name="address"
              label="Address"
              inputType="all"
              required
              rules={{ required: "Address is required" }}
            />
          </DialogContent>

          {/* save & cancel button */}
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
              // onClick={() => onSave(formData)}
              type="submit"
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
        </form>
      </Dialog>
    </FormProvider>
  );
};

export default DoctorEdit;
