import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
} from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import TextInputField from '@/components/controlled/TextInputField';
import NumericField from '@/components/controlled/NumericField';

export interface SalesData {
  id: number;
  name: string;
  medicine: string;
  quantity: number;
  totalPrice: number;
  date: string;
  time: string;
  [key: string]: string | number;
}

interface FormData {
  id: number;
  name: string;
  medicine: string;
  quantity: string;
  totalPrice: string;
  date: string;
  time: string;
}

interface EditSalesFormProps {
  open: boolean;
  editingRow: SalesData | null;
  onClose: () => void;
  onSave: (data: SalesData) => void;
}

const EditSalesForm: React.FC<EditSalesFormProps> = ({
  open,
  editingRow,
  onClose,
  onSave,
}) => {
  const methods = useForm<FormData>({
    defaultValues: {
      id: 0,
      name: '',
      medicine: '',
      quantity: '',
      totalPrice: '',
      date: '',
      time: '',
    },
  });

  React.useEffect(() => {
    if (editingRow && open) {
      methods.reset({
        ...editingRow,
        quantity: String(editingRow.quantity),
        totalPrice: String(editingRow.totalPrice),
      } as any);
    }
  }, [editingRow, open, methods]);

  const handleSubmit = (data: FormData) => {
    const updatedData: SalesData = {
      ...data,
      id: Number(data.id),
      quantity: Number(data.quantity),
      totalPrice: Number(data.totalPrice),
    };
    console.log('Submitting data:', updatedData);
    onSave(updatedData);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>
        Edit Sales Record
      </DialogTitle>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <DialogContent>
            <input type="hidden" {...methods.register('id')} />

            <Box display="flex" flexDirection="column" gap={2.5}>
              <TextInputField
                name="name"
                label="Name"
                required
                inputType="alphabet"
              />

              <TextInputField
                name="medicine"
                label="Medicine"
                required
                inputType="alphabet"
              />

              <Box display="flex" gap={2}>
                <NumericField
                  name="quantity"
                  label="Quantity"
                  required
                  min={1}
                  max={9999}
                />

                <NumericField
                  name="totalPrice"
                  label="Total Price"
                  required
                  decimal
                  decimalDigits={2}
                  min={0}
                  max={999999}
                />
              </Box>

              <Box display="flex" gap={2}>
                <TextField
                  {...methods.register('date')}
                  label="Date"
                  required
                  fullWidth
                />

                <TextField
                  {...methods.register('time')}
                  label="Time"
                  required
                  fullWidth
                />
              </Box>
            </Box>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button
              onClick={onClose}
              variant="outlined"
              sx={{ borderRadius: 2, px: 3 }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              sx={{ borderRadius: 2, px: 3 }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default EditSalesForm;