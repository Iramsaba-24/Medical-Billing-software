import { Box, Button, Paper, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import TextInputField from "@/components/controlled/TextInputField";
import NumericField from "@/components/controlled/NumericField";
import DropdownField from "@/components/controlled/DropdownField";
import DateTimeField from "@/components/controlled/DateTimeField";
import { useNavigate } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";
import { useEffect, useState } from "react";

export type InventoryFormData = {
  itemName: string;
  itemId: string;
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
  medicineGroup: string;
  stockQty: number;
  pricePerUnit: number;
  expiryDate: string;
  supplier: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
};

export default function AddInventoryItem() {
  const methods = useForm<InventoryFormData>({});
  const navigate = useNavigate();

  const [groupOptions, setGroupOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const [supplierOptions, setSupplierOptions] = useState<
    { label: string; value: string }[]
  >([]);

  // Load Medicine Groups
  useEffect(() => {
    const storedGroups = JSON.parse(
      localStorage.getItem("medicineGroups") || "[]"
    );

    const options = storedGroups.map(
      (group: { id: number; groupName: string }) => ({
        label: group.groupName,
        value: group.groupName,
      })
    );

    setGroupOptions(options);
  }, []);

  // Load Active Distributors as Suppliers
  useEffect(() => {
    const storedDistributors = JSON.parse(
      localStorage.getItem("distributors") || "[]"
    );

    const options = storedDistributors
      .filter((d: { status: string }) => d.status === "Active")
      .map((distributor: { id: string; companyName: string }) => ({
        label: distributor.companyName,
        value: distributor.companyName,
      }));

    setSupplierOptions(options);
  }, []);

  const onSubmit = (data: InventoryFormData) => {
    const existing: InventoryItem[] = JSON.parse(
      localStorage.getItem("inventory") || "[]"
    );

    const status: InventoryItem["status"] =
      data.stockQty === 0
        ? "Out of Stock"
        : data.stockQty < 20
        ? "Low Stock"
        : "In Stock";

    const newItem: InventoryItem = {
      itemName: data.itemName,
      itemId: data.itemId,
      medicineGroup: data.medicineGroup,
      stockQty: data.stockQty,
      pricePerUnit: data.pricePerUnit,
      expiryDate: data.expiryDate,
      supplier: data.supplier,
      status,
    };

    localStorage.setItem(
      "inventory",
      JSON.stringify([...existing, newItem])
    );

    navigate(URL_PATH.InventoryList);
  };

  return (
    <FormProvider {...methods}>
      <Box width="100%" px={{ xs: 1, md: 3 }} mt={4} mb={8}>
        <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
          <Typography fontSize={20} fontWeight={600} mb={4}>
            Add New Item
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
            <TextInputField
              name="itemName"
              label="Item Name"
              required
            />

            <TextInputField
              name="itemId"
              label="Item ID"
              required
            />

            <DropdownField
              name="unit"
              label="Unit"
              placeholder=" Unit"
              required
              options={[
                { label: "Tablets", value: "tablets" },
                { label: "Bottle", value: "bottle" },
                { label: "Strip", value: "strip" },
                { label: "Capsules", value: "capsules" },
                { label: "Rolls", value: "rolls" },
                { label: "Boxes", value: "boxes" },
                { label: "Pairs", value: "pairs" },
              ]}
            />

            <NumericField
              name="stockQty"
              label="Stock Quantity"
              required
            />

            <DropdownField
              name="medicineGroup"
              label="Medicine Group"
              placeholder="Medicine Group"
              required
              options={groupOptions}
            />

            <TextInputField
              name="pricePerUnit"
              label="Price per Unit (₹)"
              required
            />

            <DateTimeField
              name="expiryDate"
              label="Expiry Date"
              viewMode="date"
              required
            />

            <DropdownField
              name="supplier"
              label="Supplier"
              placeholder=" Supplier"
              required
              options={supplierOptions}
            />

            <Box
              gridColumn="1 / -1"
              display="flex"
              justifyContent="flex-end"
              gap={2}
            >
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
                sx={{
                  px: 4,
                  textTransform: "none",
                  border: "2px solid #1b7f6b",
                  color: "#1b7f6b",
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                sx={{
                  px: 4,
                  textTransform: "none",
                  backgroundColor: "#1b7f6b",
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
