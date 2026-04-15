

import { Box, Button, Paper, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import TextInputField from "@/components/controlled/TextInputField";
import NumericField from "@/components/controlled/NumericField";
import DropdownField from "@/components/controlled/DropdownField";
import DateTimeField from "@/components/controlled/DateTimeField";
import { useNavigate } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";
import { useEffect, useState } from "react";
import { addMedicine, getMedicines } from "@/service/medicineService";
import axios from "axios";
import { API_ENDPOINTS } from "@/constants/ApiEndpoints";

export type InventoryFormData = {
  itemName: string;
  batchNumber: number;
  medicineId: number;
  unit: string;
  quantity: number;
  hsnCode?: string;
  medicineGroup: string;
  pricePerUnit: number;
  expiryDate: string;
  supplier: string;
};

export type InventoryItem = {
  itemName: string;
  batchNumber: number;
  medicineId: number;
  quantity: number;
  medicineGroup: string;
  pricePerUnit: number;
  expiryDate: string;
  supplier: number;
  hsnCode?: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
};

export default function AddInventoryItem() {
  const methods = useForm<InventoryFormData>({
    mode: "onChange",
  });

  const navigate = useNavigate();

  const [groupOptions, setGroupOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [supplierOptions, setSupplierOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [groupIdMap, setGroupIdMap] = useState<Record<string, number>>({});
  const [supplierIdMap, setSupplierIdMap] = useState<Record<string, number>>(
    {},
  );
  const [, setNextMedicineId] = useState<number>(1);

  useEffect(() => {
    const fetchNextId = async () => {
      try {
        const medicines = await getMedicines();
        const existingIds = medicines
          .map((m: { medicineId: number }) => m.medicineId)
          .sort((a: number, b: number) => a - b);

        const nextId =
          existingIds.length > 0 ? existingIds[existingIds.length - 1] + 1 : 1;

        setNextMedicineId(nextId);
        methods.setValue("medicineId", nextId);
      } catch (error) {
        console.error("Error fetching next medicine ID:", error);
      }
    };

    fetchNextId();
  }, [methods, setNextMedicineId]);

  // Load Medicine Groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(API_ENDPOINTS.MEDICINE_GROUP, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        const idMap: Record<string, number> = {};

        const options = res.data.data.map(
          (g: { groupId: number; groupName: string }) => {
            idMap[g.groupName] = g.groupId; // name  id map
            return { label: g.groupName, value: g.groupName };
          },
        );

        setGroupOptions(options);
        setGroupIdMap(idMap); //  save
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

  // Load Distributors
  useEffect(() => {
    const fetchDistributors = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_ENDPOINTS.DISTRIBUTOR}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        const sMap: Record<string, number> = {};

        const options = res.data.map(
          (d: { distributorId: number; companyName: string }) => {
            sMap[d.companyName] = d.distributorId; // name  id map
            return { label: d.companyName, value: d.companyName };
          },
        );

        setSupplierOptions(options);
        setSupplierIdMap(sMap); //  save
      } catch (error) {
        console.error("Error fetching distributors:", error);
      }
    };

    fetchDistributors();
  }, []);

  const onSubmit = async (data: InventoryFormData) => {
    try {
      // name id convert
      const finalData = {
        ...data,
        medicineGroup: groupIdMap[data.medicineGroup]?.toString() ?? "",
        supplier: supplierIdMap[data.supplier]?.toString() ?? "",
      };

      await addMedicine(finalData);
      navigate(URL_PATH.Inventory);
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error message:", error.message);
      }

      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response?: { data?: unknown } };
        console.log("BACKEND ERROR:", err.response?.data);
      }
    }
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
            noValidate
            onSubmit={methods.handleSubmit(onSubmit)}
            display="grid"
            gridTemplateColumns={{ xs: "1fr", md: "repeat(3, 1fr)" }}
            gap={2.5}
            sx={{ px: { xs: 0, md: 4 } }}
          >
            <TextInputField
              inputType="all"
              rows={1}
              name="itemName"
              label="Medicine Name"
              maxLength={30}
              required
            />

            {/* <NumericField
              name="medicineId"
              label="Item ID"
              required
              disabled
            /> */}

            <NumericField name="batchNumber" label="Batch Number" required />

            <DropdownField
              name="unit"
              label="Unit"
              placeholder="Unit"
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
              freeSolo={false}
              editable={true}
            />

            <NumericField name="quantity" label="Stock Quantity" required />

            <DropdownField
              name="medicineGroup"
              label="Medicine Group"
              placeholder="Medicine Group"
              required
              options={groupOptions}
              freeSolo={false}
              editable={true}
            />

            <NumericField
              name="pricePerUnit"
              label="Price per Unit (₹)"
              required
            />

            <TextInputField
              inputType="numbers"
              rows={1}
              name="hsnCode"
              label="HSN Number"
              minLength={4}
              maxLength={10}
              required
            />

            <DateTimeField
              name="expiryDate"
              label="Expiry Date"
              viewMode="date"
              required
              useCurrentDate={false}
              dateRestriction="current-future-only"
            />

            <DropdownField
              name="supplier"
              label="Supplier"
              placeholder="Supplier"
              required
              options={supplierOptions}
              freeSolo={false}
              editable={true}
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
