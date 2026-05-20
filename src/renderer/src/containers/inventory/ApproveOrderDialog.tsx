import { Box,Typography,Table,TableBody,TableCell,TableHead,TableRow,Dialog,DialogActions,DialogContent,DialogTitle,Button,InputAdornment,} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { useEffect } from "react";
import DropdownField from "@/components/controlled/DropdownField";
import {approveAndDeleteExistingMedicine,approveAndDeleteNewMedicine} from "@/service/reorderService";
import TextInputField from "@/components/controlled/TextInputField";
type NewMedicine = {
  id: number;
  medicineName: string;
  strength: string;
  qty: number;
};

type NewOrderHistory = {
  id: number;
  companyName: string;
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

type ApprovedMedicine = {
  medicineName: string;
  strength: string;
  qty: number;
  paidAmount: number;
  unPaidAmount: number;
};

type Props = {
  open: boolean;
  order: NewOrderHistory | null;
  onClose: () => void;
  onSuccess?: (order: NewOrderHistory, medicines: ApprovedMedicine[]) => void;
  orderType?: "existing" | "new";
};

function ApproveOrderDialog({
  open,
  order,
  onClose,
  onSuccess,
  orderType = "existing",
}: Props) {
  // const navigate = useNavigate();
  const methods = useForm<FormValues>({
    defaultValues: {
      paid: "",
      unpaid: "",
      paymentMode: "",
      medicineAmounts: {},
    },
  });

  const { handleSubmit, watch, reset } = methods;
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

  const medTotal =
    order?.newMedicines.reduce((sum, med) => {
      return sum + (parseFloat(watchedAmounts?.[String(med.id)] ?? "") || 0);
    }, 0) ?? 0;

  const amountMismatch =
    medTotal > 0 &&
    paidUnpaidTotal > 0 &&
    Math.abs(medTotal - paidUnpaidTotal) > 0.01;

  const onSubmit = async (data: FormValues) => {
    if (amountMismatch || !order) return;

    try {
      const medicines = order.newMedicines.map((m) => ({
        medicineName: m.medicineName,
        strength: m.strength || "",
        companyName: order.companyName,
        qty: m.qty,
        paidAmount: parseFloat(data.paid) || 0,
        unPaidAmount: parseFloat(data.unpaid) || 0,
        paymentType: data.paymentMode || "",
      }));

      // Call the appropriate service based on orderType
      if (orderType === "new") {
        await approveAndDeleteNewMedicine(order.id, medicines);
      } else {
        await approveAndDeleteExistingMedicine(order.id, medicines);
      }

      onSuccess?.(order, medicines);
      onClose();
    } catch (error) {
      console.error("Approve failed:", error);
    }
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
              noValidate
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
                  {order.companyName}
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
                <TextInputField
                  name="paid"
                  label="Paid Amount"
                  size="small"
                  type="number"
                  required={true}
                  inputProps={{ min: 0, step: "0.01" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                />
                <TextInputField
                  name="unpaid"
                  label="Unpaid Amount"
                  size="small"
                  type="number"
                  inputProps={{ min: 0, step: "0.01" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                />
                <DropdownField
                  name="paymentMode"
                  label="Payment Mode"
                  options={PAYMENT_MODE_OPTIONS}
                  size="small"
                  required={true}
                />
              </Box>

              <Typography fontWeight={600} fontSize={13}>
                Medicine Details
              </Typography>

              <Box sx={{ overflowX: "auto" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>
                        Medicine Name
                      </TableCell>
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
                          <Typography fontSize={13}>
                            {med.medicineName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography fontSize={13}>
                            {med.strength || "-"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography fontSize={13}>{med.qty}</Typography>
                        </TableCell>
                        <TableCell>
                          <TextInputField
                            name={`medicineAmounts.${String(med.id)}`}
                            label=""
                            size="small"
                            type="number"
                            required={true}
                            inputProps={{ min: 0, step: "0.01" }}
                            sx={{
                              width: { xs: 90, sm: 110 },
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  ₹
                                </InputAdornment>
                              ),
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>

              {amountMismatch && (
                <Typography fontSize={12} color="error">
                  Medicine total ₹{medTotal.toFixed(2)} must match Paid + Unpaid
                  ₹{paidUnpaidTotal.toFixed(2)}
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
              "&:hover": {
                backgroundColor: "#fff",
                color: "#1b7f6b",
                border: "2px solid #1b7f6b",
              },
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
