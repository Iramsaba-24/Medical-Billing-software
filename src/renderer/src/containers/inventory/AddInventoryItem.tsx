import { Box, Button, Paper, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import TextInputField from "@/components/controlled/TextInputField";
import NumericField from "@/components/controlled/NumericField";
import DropdownField from "@/components/controlled/DropdownField";
import DateTimeField from "@/components/controlled/DateTimeField";
import { useNavigate } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";

export type InventoryFormData = {
  itemName: string;
  itemId: string;
  category: string;
  unit: string;
  stockQty: number;
  medicineGroup: string;
  pricePerUnit: number;
  expiryDate: string;
  supplier: string;
};

export type InventoryItem = {
  itemName: string;
  itemId: string;
  category: string;
  stockQty: number;
  pricePerUnit: number;
  expiryDate: string;
  supplier: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
};

export default function AddInventoryItem() {
  const navigate = useNavigate();

  const methods = useForm<InventoryFormData>({
    defaultValues: {
      category: "medicines",
      unit: "tablets",
    },
  });

  //  submit
  const onSubmit = (data: InventoryFormData) => {
    const existing: InventoryItem[] =
      JSON.parse(localStorage.getItem("inventory") || "[]");

    const status: InventoryItem["status"] =
      data.stockQty === 0
        ? "Out of Stock"
        : data.stockQty < 20
        ? "Low Stock"
        : "In Stock";

    const newItem: InventoryItem = {
      itemName: data.itemName,
      itemId: data.itemId,
      category: data.category,
      stockQty: data.stockQty,
      pricePerUnit: data.pricePerUnit,
      expiryDate: data.expiryDate,
      supplier: data.supplier,
      status,
    };

    localStorage.setItem("inventory",
      JSON.stringify([...existing, newItem])
    );

    navigate(URL_PATH.InventoryList, { replace: true });
  };

  return (
  <FormProvider {...methods} >
    <form onSubmit={methods.handleSubmit(onSubmit)}  noValidate>
  <Box width="100%" px={{ xs: 1, md: 3 }} mt={4} mb={8}>
    <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
      <Typography fontSize={20} fontWeight={600} mb={4}>
        Add Inventory Item
      </Typography>

      <Box
        component="form"
        onSubmit={methods.handleSubmit(onSubmit)}
        display="grid"
        gridTemplateColumns={{
          xs: "1fr",
          md: "repeat(3, 1fr)",
        }}
        gap={2.5}
        sx={{ px: { xs: 0, md: 4 } }}
      >
        <TextInputField name="itemName" label="Item Name" required inputType="all" rows={1}/>
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

        <NumericField name="stockQty" label="Stock Quantity" required />

        <DropdownField
          name="medicineGroup"
          label="Medicine Group"
          required
          options={[
            { label: "Generic", value: "generic" },
            { label: "Diabetes", value: "diabetes" },
            { label: "Other", value: "other" },
          ]}
        />

        <NumericField
          name="pricePerUnit"
          label="Price per Unit (₹)"
          decimal
          decimalDigits={2}
          required
        />

        <DateTimeField
          name="expiryDate"
          label="Expiry Date"
          viewMode="year"
          required
        />

        <DropdownField
          name="supplier"
          label="Supplier"
          required
          options={[
            { label: "PharmaCare Ltd.", value: "pharmaCare" },
            { label: "MedEquip Inc.", value: "medEquip" },
            { label: "Other", value: "other" },
          ]}
        />

        <Box
          gridColumn="1 / -1"
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          justifyContent={{ md: "flex-end" }}
          gap={2}
        >
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            sx={{
              px: 4,
              width: { xs: "100%", md: "14%" },
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
            type="submit"
            variant="contained"
            sx={{
              px: 4,
              width: { xs: "100%", md: "14%" },
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
        </Box>
      </Box>
    </Paper>
  </Box>
  </form>
</FormProvider>
);
}
