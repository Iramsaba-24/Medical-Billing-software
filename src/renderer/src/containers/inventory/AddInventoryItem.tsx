
import { Box, Button, Paper, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";

import { useNavigate,useLocation } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";
import { useEffect, useState } from "react";
import { addMedicine, getMedicines, MedicineResponse,updateMedicine  } from "@/service/medicineService";
import { DistributorResponse, getDistributors } from "@/service/distributorService";
import { getMedicineGroups } from "@/service/medicineGroupService";
import InventoryFormFields from "@/containers/inventory/InventoryFormFields";
export type InventoryFormData = {
  medicineId?: number;
  medicineName: string;
  batchNumber?: string;
  hsnCode?: string;

  numberOfStrips: number;
  tabletsPerStrip: number;
  looseTablets: number;

  purchasePricePerStrip: number;
  mrpPerStrip: number;
  gstPercent: number;

  purchaseDate?: string;
  invoiceNumber?: string;
  expiryDate: string;

  companyName?: string;
  strength: string;
  type: string;

  distributorId: number;
  groupId: string;

  manufacturingDate?: string;

  minimumQuantity: number;
  maximumQuantity: number;
};

export type InventoryItem = {
  medicineName: string;
  medicineId: number;
  totalStockTablets: number;
  medicineGroup: string;
  mrpPerStrip: number;
  expiryDate: string;
  companyName: string;
  hsnCode?: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
};


export default function AddInventoryItem() {
  //edit
const location = useLocation();

// const editData = location.state as InventoryFormData | undefined;
const editData = location.state as MedicineResponse | undefined;
const methods = useForm<InventoryFormData>({
  mode: "onChange",
  defaultValues: {
    medicineName: "",
    batchNumber: "",
    hsnCode: "",
    numberOfStrips: 1,
    tabletsPerStrip: 1,
    looseTablets: 0,
    purchasePricePerStrip: 0,
    mrpPerStrip: 0,
    gstPercent: 5,
    expiryDate: "",
    strength: "",
    type: "",
    distributorId: 0,
    groupId: "",
    minimumQuantity: 0,
    maximumQuantity: 0,
  },
});
//edit

  const isEdit = !!editData?.medicineId;
  const navigate = useNavigate();
useEffect(() => {
  if (editData) {
    methods.reset({
      medicineId: editData.medicineId,
      medicineName: editData.medicineName || "",
      batchNumber: editData.batchNumber || "",
      hsnCode: editData.hsnCode || "",

      strength: editData.strength || "",
      type: editData.type || "",

      groupId: String(editData.groupId),
      distributorId: editData.distributorId,

      
      numberOfStrips: editData.numberOfStrips ?? 0,
      tabletsPerStrip: editData.tabletsPerStrip ?? 1,
      looseTablets: editData.looseTablets ?? 0,

      purchasePricePerStrip: editData.purchasePricePerStrip || 0,
      mrpPerStrip: editData.mrpPerStrip || 0,
      gstPercent: editData.gstPercent || 0,

      expiryDate: editData.expiryDate
        ? new Date(editData.expiryDate).toISOString().split("T")[0]
        : "",
      manufacturingDate: editData.manufacturingDate
        ? new Date(editData.manufacturingDate).toISOString().split("T")[0]
        : "",
      purchaseDate: editData.purchaseDate
        ? new Date(editData.purchaseDate).toISOString().split("T")[0]
        : "",

      companyName: editData.companyName || "",
      invoiceNumber: editData.invoiceNumber || "",

      minimumQuantity: editData.minimumQuantity || 0,
      maximumQuantity: editData.maximumQuantity || 0,
    });
  }
}, [editData, methods]);

const [groupOptions, setGroupOptions] = useState<{ label: string; value: string }[]>([]);
const [supplierOptions, setSupplierOptions] = useState<{ label: string; value: string }[]>([]);

  const [, setNextMedicineId] = useState<number>(1);
  const [distributorData, setDistributorData] = useState<DistributorResponse[]>([]);
const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);

useEffect(() => {
  const fetchNextId = async () => {
    try {
      const medicines = await getMedicines();

      const mappedData = medicines.map((m: MedicineResponse) => ({
        itemName: m.medicineName,
        medicineId: m.medicineId,
        quantity: m.totalStockTablets,
        medicineGroup: m.groupName || "",
        pricePerUnit: m.purchasePricePerTablet || 0,
        expiryDate: m.expiryDate,
        supplier: m.distributorId,
        hsnCode: m.hsnCode,
        status: m.status,
      }));

      setInventoryItems(mappedData);
      console.log(mappedData); 
      console.log(inventoryItems);
      const existingIds = medicines
        .map((m: { medicineId: number }) => m.medicineId)
        .sort((a: number, b: number) => a - b);

      const nextId =
        existingIds.length > 0
          ? existingIds[existingIds.length - 1] + 1
          : 1;

      setNextMedicineId(nextId);

    } catch (error) {
      console.error("Error fetching next medicine ID:", error);
    }
  };
  

  fetchNextId();
}, []);

  // Load Medicine Groups
useEffect(() => {
  const fetchGroups = async () => {
    try {
      const data = await getMedicineGroups();

      const options = data.map((g: { groupId: number; groupName: string }) => ({
        label: g.groupName,
        value: g.groupId.toString() 
      }));

      setGroupOptions(options);
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
      const data = await getDistributors();

      setDistributorData(data);

      const options = data.map((d) => ({
        label: d.ownerName, //  owner name in dropdown
        value: d.distributorId.toString() , 
      }));

      setSupplierOptions(options);
    } catch (error) {
      console.error("Error fetching distributors:", error);
    }
  };

  fetchDistributors();
}, []);
//compny name
const selectedDistributorId = methods.watch("distributorId");

useEffect(() => {
  const selected = distributorData.find(
    (d) => d.distributorId === Number(selectedDistributorId)
  );

  if (selected) {
    methods.setValue("companyName", selected.companyName); 
  }
}, [selectedDistributorId, distributorData, methods]);
const onSubmit = async (data: InventoryFormData) => {
  try {
    const finalData = {
      ...data,
      distributorId: Number(data.distributorId),
      groupId: Number(data.groupId),
      companyName: data.companyName || "NA",
    };

    if (isEdit && editData?.medicineId) {
      await updateMedicine(editData.medicineId, finalData);
    } else {
      await addMedicine(finalData);
    }

    navigate(URL_PATH.Inventory);
  } catch (error) {
    console.error(error);
  }
};
  // calc total stock tablets
const numberOfStrips = Number(methods.watch("numberOfStrips")) || 0;
const tabletsPerStrip = Number(methods.watch("tabletsPerStrip")) || 0;
const looseTablets = Number(methods.watch("looseTablets")) || 0;
const totalStock =
  numberOfStrips * tabletsPerStrip + looseTablets;
  //calc of price
const purchasePricePerStrip = Number(methods.watch("purchasePricePerStrip")) || 0;

const purchasePricePerTablet =
  tabletsPerStrip > 0
    ? purchasePricePerStrip / tabletsPerStrip
    : 0;
//cal mrp per tablet
const mrpPerStrip = Number(methods.watch("mrpPerStrip")) || 0;

const mrpPerTablet =
  tabletsPerStrip > 0
    ? mrpPerStrip / tabletsPerStrip
    : 0;

const gstPercent = Number(methods.watch("gstPercent")) || 0;

// Base Amount (total price without GST)
const totalPrice = totalStock * purchasePricePerTablet;

// GST Amount
const gstAmount = totalPrice * (gstPercent / 100);

// Final Amount (with GST)
const finalPrice = totalPrice + gstAmount;    
  return (
<FormProvider {...methods}>
  <Box width="100%" px={{ xs: 1, md: 2 }} mt={4} mb={8}>
    <Paper sx={{ p: { xs: 1, md: 2 }, borderRadius: 2 }}>
      <Typography fontSize={20} fontWeight={600} mb={4}>
        {isEdit ? "Edit Medicine" : "Add New Medicine"}
      </Typography>

      <Box
        component="form"
        noValidate
        onSubmit={methods.handleSubmit(onSubmit)}
        display="grid"
        gridTemplateColumns={{
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
        }}
        gap={1.5}
        sx={{ px: { xs: 0, md: 4 } }}
      >
        <InventoryFormFields
          groupOptions={groupOptions}
          supplierOptions={supplierOptions}
          totalStock={totalStock}
          purchasePricePerTablet={purchasePricePerTablet}
          mrpPerTablet={mrpPerTablet}
          finalPrice={finalPrice}
        />

        {/* Buttons SAME */}
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