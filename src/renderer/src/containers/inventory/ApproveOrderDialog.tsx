import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { URL_PATH } from "@/constants/UrlPath";
import DropdownField from "@/components/controlled/DropdownField";

type NewMedicine = {
  id: number;
  medicineName: string;
  strength: string;
  qty: number;
};

type NewOrderHistory = {
  id: number;
  distributorName: string;
  distributorId: number;
  newMedicines: NewMedicine[];
};

type FormValues = {
  paid: string;
  unpaid: string;
  paymentMode: string;
  medicineAmounts: Record<string, string>;
};

const PAYMENT_MODE_OPTIONS = [
  { label: "Cash", value: "Cash" },
  { label: "UPI", value: "UPI" },
];

type Props = {
  open: boolean;
  order: NewOrderHistory | null;
  onClose: () => void;
};

function ApproveOrderDialog({ open, order, onClose }: Props) {
  const navigate = useNavigate();

  const methods = useForm<FormValues>({
    defaultValues: { paid: "", unpaid: "", paymentMode: "", medicineAmounts: {} },
  });

  const { register, handleSubmit, watch, reset, control } = methods;

  const watchedPaid = watch("paid");
  const watchedUnpaid = watch("unpaid");
  const watchedAmounts = watch("medicineAmounts");

  useEffect(() => {
    if (open) {
      reset({ paid: "", unpaid: "", paymentMode: "", medicineAmounts: {} });
    }
  }, [open, reset]);

  const paidVal = parseFloat(watchedPaid) || 0;
  const unpaidVal = parseFloat(watchedUnpaid) || 0;
  const paidUnpaidTotal = paidVal + unpaidVal;

  const medTotal = order?.newMedicines.reduce((sum, med) => {
    return sum + (parseFloat(watchedAmounts?.[String(med.id)] ?? "") || 0);
  }, 0) ?? 0;

  const amountMismatch =
    medTotal > 0 && paidUnpaidTotal > 0 && Math.abs(medTotal - paidUnpaidTotal) > 0.01;

  const onSubmit = (data: FormValues) => {
    if (amountMismatch || !order) return;

    navigate(URL_PATH.AddInventoryItem, {
      state: {
        approveMode: true,
        orderId: order.id,
        distributorName: order.distributorName,
        medicines: order.newMedicines.map((m) => ({
          medicineName: m.medicineName,
          strength: m.strength || "",
          qty: m.qty,
          amount: data.medicineAmounts?.[String(m.id)] || "0",
        })),
        payment: {
          paid: data.paid,
          unpaid: data.unpaid,
          paymentMode: data.paymentMode,
        },
      },
    });

    onClose();
  };

  return (
    <FormProvider {...methods}>
<Dialog
  open={open}
  onClose={onClose}
  maxWidth="md"
  fullWidth
  PaperProps={{
    sx: {
      mx: { xs: 1, sm: 2 },
      width: { xs: "95%", sm: "100%" },
      borderRadius: 2,
    },
  }}
>
        <DialogTitle>New Medicine Details</DialogTitle>

        <DialogContent>
          {order && (
            <Box
              component="form"
              id="approve-form"
              onSubmit={handleSubmit(onSubmit)}
             px={{ xs: 0, sm: 1 }}
py={0}
              display="flex"
              flexDirection="column"
              gap={2}
            >
              <Box>
                <Typography fontWeight={600} fontSize={16} color="text.primary">
                  Supplier
                </Typography>
                <Typography fontSize={14} fontWeight={500} mb={1}>
                  {order.distributorName}
                </Typography>
              </Box>

          <Box
  display="grid"
  gridTemplateColumns={{
    xs: "1fr",
    sm: "1fr 1fr 1fr",
  }}
  gap={1.5}
>
                <TextField
                  label="Paid Amount"
                  size="small"
                  type="number"
                  inputProps={{ min: 0, step: "0.01" }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                  {...register("paid")}
                />
                <TextField
                  label="Unpaid Amount"
                  size="small"
                  type="number"
                  inputProps={{ min: 0, step: "0.01" }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                  {...register("unpaid")}
                />
                <DropdownField
                  name="paymentMode"
                  label="Payment Mode"
                  options={PAYMENT_MODE_OPTIONS}
                  size="small"
                />
              </Box>

              <Typography fontWeight={600} fontSize={13}>
                Medicine Details
              </Typography>


<Box sx={{ overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Medicine Name</TableCell>
<TableCell
  sx={{
    fontWeight: 700,
    whiteSpace: "nowrap",
  }}
>
  Strength/Type
</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Qty</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Amount (₹)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.newMedicines.map((med) => (
                    <TableRow key={med.id}>
                      <TableCell>
                        <Typography fontSize={13}>{med.medicineName}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontSize={13}>{med.strength || "-"}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontSize={13}>{med.qty}</Typography>
                      </TableCell>
                      <TableCell>
                        <Controller
                          name={`medicineAmounts.${String(med.id)}`}
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              size="small"
                              type="number"
                              inputProps={{ min: 0, step: "0.01" }}
                              sx={{
  width: { xs: 90, sm: 110 },
}}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">₹</InputAdornment>
                                ),
                              }}
                            />
                          )}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table></Box>

              {amountMismatch && (
                <Typography fontSize={12} color="error">
                  Medicine total ₹{medTotal.toFixed(2)} must match Paid + Unpaid ₹{paidUnpaidTotal.toFixed(2)}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>

      <DialogActions
  sx={{
    flexDirection: { xs: "column", sm: "row" },
    gap: 1,
    p: 2,
  }}
>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              px: 4,
             width: { xs: "100%", sm: "14%" },
              textTransform: "none",
              border: "2px solid #1b7f6b",
              color: "#1b7f6b",
              "&:hover": { backgroundColor: "#1b7f6b", color: "#fff" },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="approve-form"
            variant="contained"
            disabled={amountMismatch}
            sx={{
              px: 4,
             width: { xs: "100%", sm: "14%" },
              textTransform: "none",
              backgroundColor: "#1b7f6b",
              "&:hover": { backgroundColor: "#fff", color: "#1b7f6b", border: "2px solid #1b7f6b" },
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
}

export default ApproveOrderDialog;