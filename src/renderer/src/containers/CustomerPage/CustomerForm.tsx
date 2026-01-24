import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  IconButton,
  Paper,
  Divider,
  Box,
} from "@mui/material";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import TextInputField from "@/components/controlled/TextInputField";
import DropdownField from "@/components/controlled/DropdownField";
import NumberInputField from "@/components/controlled/NumericField";
import MobileField from "@/components/controlled/MobileField";
import EmailField from "@/components/controlled/EmailField";

import {
  Customer,
  CustomerFormData,
  EMPTY_FORM,
  medicineRates,
  getPrice,
  getAmount,
} from "./CustomerTypes";

type Props = {
  open: boolean;
  editRow: Customer | null;
  customers: Customer[];
  onClose: () => void;
  onSave: (data: CustomerFormData, editId?: string) => void;
};

export default function CustomerForm({
  open,
  editRow,
  customers,
  onClose,
  onSave,
}: Props) {
  const methods = useForm<CustomerFormData>({
    defaultValues: EMPTY_FORM,
  });

  const { handleSubmit, reset, watch, control, setValue } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const mobile = watch("mobile");
  const items = watch("items");

  const [isExistingCustomer, setIsExistingCustomer] = useState(false);

  /* Auto data fill when mobile number matches with existing data with mobile */
  useEffect(() => {
    if (!open || editRow) return;

    if (!mobile || mobile.length !== 10) {
      setIsExistingCustomer(false);

      reset({
        ...EMPTY_FORM,
        mobile,
      });
      return;
    }

    const found = customers.find((c) => c.mobile === mobile);

    if (found) {
      setIsExistingCustomer(true);

      setValue("name", found.name);
      setValue("age", found.age);
      setValue("referenceFrom", found.referenceFrom);
      setValue("email", found.email);
      setValue("address", found.address);
    } else {
      setIsExistingCustomer(false);

      reset({
        ...EMPTY_FORM,
        mobile,
      });
    }
  }, [mobile, customers, open, editRow, reset, setValue]);

  /* Edit Mode*/
  useEffect(() => {
    if (!open) return;

    if (editRow) {
      setIsExistingCustomer(false);
      reset({
        name: editRow.name,
        mobile: editRow.mobile,
        age: editRow.age,
        referenceFrom: editRow.referenceFrom,
        address: editRow.address,
        email: editRow.email,
        items: editRow.items,
      });
    } else {
      reset(EMPTY_FORM);
      setIsExistingCustomer(false);
    }
  }, [open, editRow, reset]);

  const total = items.reduce(
    (sum, i) => sum + getAmount(i.medicine, i.quantity),
    0
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2 }}>
      <DialogTitle fontWeight={700}>
        {editRow ? "Edit Customer Bill" : "New Customer Bill"}
      </DialogTitle>
        <IconButton
            onClick={onClose}
            size="small"
            aria-label="close"
            sx={{
              color: "grey.600",
            }}
          >
            <CloseIcon />
          </IconButton>
          </Box>

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit((data) => {
            onSave(data, editRow?.id);
            reset(EMPTY_FORM);
            setIsExistingCustomer(false);
          })}
          noValidate
        >
          <DialogContent>
            {/* Customer Section*/}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight={700}>
                Customer Info
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextInputField
                    name="name"
                    label="Name"
                    inputType="textarea"
                    rows={1}
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <MobileField name="mobile" label="Mobile" required />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <NumberInputField name="age" label="Age" min={1} required />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <DropdownField
                    name="referenceFrom"
                    label="Doctor"
                    options={[
                      { label: "Dr. Shyam Raut", value: "Dr. Shyam Raut" },
                      { label: "Dr. Aman Sheikh", value: "Dr. Aman Sheikh" },
                    ]}
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <EmailField
                    name="email"
                    label="Email"
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextInputField
                    name="address"
                    label="Address"
                    inputType="all"
                    required
                  />
                </Grid>
              </Grid>

              {isExistingCustomer && (
                <Typography mt={2} color="info.main" fontWeight={600}>
                  Existing customer found — details auto-filled.
                </Typography>
              )}
            </Paper>

            {/* Medicines Section */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700}>
                Medicines
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {fields.map((field, index) => {
                const med = items[index]?.medicine;
                const qty = items[index]?.quantity || 0;

                return (
                  <Paper key={field.id} sx={{ p: 2, mb: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid size={4}>
                        <DropdownField
                          name={`items.${index}.medicine`}
                          label="Medicine"
                          options={Object.keys(medicineRates).map((m) => ({
                            label: m,
                            value: m,
                          }))}
                          required
                        />
                      </Grid>

                      <Grid size={2}>
                        <NumberInputField
                          name={`items.${index}.quantity`}
                          label="Qty"
                          min={1}
                          required
                        />
                      </Grid>

                      <Grid size={2}>₹{getPrice(med)}</Grid>
                      <Grid size={2}>₹{getAmount(med, qty)}</Grid>

                      <Grid size={2}>
                        <IconButton
                          onClick={() => append({ medicine: "", quantity: 1 })}
                        >
                          <AddCircleOutlineIcon />
                        </IconButton>

                        {fields.length > 1 && (
                          <IconButton
                            color="error"
                            onClick={() => remove(index)}
                          >
                            <RemoveCircleOutlineIcon />
                          </IconButton>
                        )}
                      </Grid>
                    </Grid>
                  </Paper>
                );
              })}

              <Typography fontWeight={700} textAlign="right">
                Total: ₹{total.toFixed(2)}
              </Typography>
            </Paper>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() => {
                reset(EMPTY_FORM);
                setIsExistingCustomer(false);
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
}
