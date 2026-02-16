import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography } from "@mui/material";
import DateTimeField from "@/components/controlled/DateTimeField";
import { useState, useEffect } from "react";
import { showSnackbar } from "@/components/uncontrolled/ToastMessage";
import { FormProvider, useForm } from "react-hook-form";

type ReorderDialogProps = {
  open: boolean; 
  itemName: string; 
  onClose: () => void; 
  onSubmit: (qty: number, expiryDate: string) => void; 
};

const ReorderDialog = ({
  open,
  itemName,
  onClose,
  onSubmit,
}: ReorderDialogProps) => {
  const [qty, setQty] = useState<number>(0);

  const [expiryDate, setExpiryDate] = useState<string>("");

  const methods = useForm({
    defaultValues: {
      date: "",
    },
  });

  useEffect(() => {
    if (open) {
      setExpiryDate("");
    }
  }, [open]);

  const handleSubmit = () => {
    if (!qty || !expiryDate) return;

    onSubmit(qty, expiryDate);
    showSnackbar("success", "Reorder successful");
    onClose();
    
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Reorder Item</DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <Typography fontWeight={600}>{itemName}</Typography>

          <TextField
            label="Quantity"
            type="number"
            fullWidth
            onChange={(e) => setQty(Number(e.target.value))}
          />
          <FormProvider {...methods}>
          <DateTimeField
           name="date"
           label="Date"
           viewMode="date"
           onChange={(date) => setExpiryDate(date ? String(date) : "")}                  
          />
          </FormProvider>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          sx={{
            px: 2.5,
            minWidth: 100,
            backgroundColor: "#fff",
            color: "#238878",
            border: "2px solid #238878",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#238878",
              color: "#fff",
            },
          }}
          onClick={onClose}
        >
          Cancel
        </Button>

        {/* Save button */}
        <Button
          variant="contained"
          sx={{
            px: 2.5,
            minWidth: 100,
            backgroundColor: "#238878",
            color: "#fff",
            border: "2px solid #238878",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#fff",
              color: "#238878",
            },
          }}
          onClick={handleSubmit}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReorderDialog;
