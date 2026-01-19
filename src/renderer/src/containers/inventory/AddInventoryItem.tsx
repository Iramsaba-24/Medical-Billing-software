import { Box, Button, Paper, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import TextInputField from "@/components/controlled/TextInputField";
import NumericField from "@/components/controlled/NumericField";
import DropdownField from "@/components/controlled/DropdownField";
import DateTimeField from "@/components/controlled/DateTimeField";
import { useNavigate } from "react-router-dom";

type FormValues = {
  itemName: string;
  itemId: string;
  category: string;
  unit: string;
  stockQty: string;
  medicineGroup: string;
  pricePerUnit: string;
  expiryDate: string;
  supplier: string;
};

export default function AddInventoryItem() {
  const navigate = useNavigate();

  const methods = useForm<FormValues>({
    defaultValues: {
      category: "medicines",
      unit: "tablets",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Inventory Item Data:", data);
    // API call here
  };

  return (
    <FormProvider {...methods}>
      <Box width="100%" px={3} mt={4}>
        <Paper
          sx={{
            p: 3,
            borderRadius: 2,
            width: "100%",
          }}
        >
          <Typography fontWeight={600} mb={3}>
            Add Inventory Item
          </Typography>

          <Box
            component="form"
            onSubmit={methods.handleSubmit(onSubmit)}
            display="grid"
            gridTemplateColumns="repeat(2, 1fr)"
            gap={2.5}
          >
            <TextInputField name="itemName" label="Item Name" required />

            <TextInputField name="itemId" label="Item ID" required />

            <DropdownField
              name="category"
              label="Category"
              required
              options={[
                { label: "Medicines", value: "medicines" },
                { label: "Consumables", value: "consumables" },
              ]}
            />

            <DropdownField
              name="unit"
              label="Unit"
              required
              options={[
                { label: "Tablets", value: "tablets" },
                { label: "Bottle", value: "bottle" },
                { label: "Strip", value: "strip" },
              ]}
            />

            <NumericField
              name="stockQty"
              label="Stock Quantity"
              required
              min={0}
              max={100000}
            />

            <DropdownField
              name="medicineGroup"
              label="Medicine Group"
              required
              options={[
                { label: "Generic Medicines", value: "generic" },
                { label: "Diabetes", value: "diabetes" },
                { label: "Other", value: "other" },
              ]}
            />

            <NumericField
              name="pricePerUnit"
              label="Price per Unit (₹)"
              required
              decimal
              decimalDigits={2}
              min={0}
              max={100000}
            />

            <DateTimeField
              name="expiryDate"
              label="Expiry Date"
              required
              viewMode="date"
            />

            <Box gridColumn="1 / -1">
              <TextInputField name="supplier" label="Supplier" />
            </Box>

            <Box
              gridColumn="1 / -1"
              display="flex"
              justifyContent="flex-end"
              gap={2}
              mt={2}
            >
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
                sx={{
                  minWidth: 100,
                  backgroundColor: "#fff",
                  color: "#238878",
                  border: "2px solid #238878",
                  borderRadius: "10px",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  textTransform: "none",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    backgroundColor: "#238878",
                    color: "#fff",
                    border: "2px solid #238878",
                    boxShadow: "0 6px 18px rgba(35, 136, 120, 0.35)",
                    transform: "translateY(-1px)",
                  },
                  "&:active": {
                    transform: "scale(0.98)",
                  },
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                sx={{
                  minWidth: 100,
                  backgroundColor: "#238878",
                  color: "#fff",
                  border: "2px solid #238878",
                  borderRadius: "10px",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  textTransform: "none",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    backgroundColor: "#fff",
                    color: "#238878",
                    border: "2px solid #238878",
                    boxShadow: "0 6px 18px rgba(35, 136, 120, 0.35)",
                    transform: "translateY(-1px)",
                  },
                  "&:active": {
                    transform: "scale(0.98)",
                  },
                }}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </FormProvider>
  );
}
