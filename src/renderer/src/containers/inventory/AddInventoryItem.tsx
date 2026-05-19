
import { Box, Button, Paper, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate,useLocation } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";
import { useEffect, useState} from "react";
import { addMedicine,  getMedicineById,  MedicineResponse, updateMedicine } from "@/service/medicineService";
import { DistributorResponse, getDistributors } from "@/service/distributorService";
import { getMedicineGroups } from "@/service/medicineGroupService";
import InventoryFormFields from "@/containers/inventory/InventoryFormFields";
import axios from "axios";
import { API_ENDPOINTS } from "@/constants/ApiEndpoints";
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
 
  distributorId: number|string;
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
 
const location = useLocation();
 
type ApproveMedicine = {
  medicineName: string;
  strength: string;
  qty: number;
  amount: string;
};
 
// type ApproveOrderState = {
//   approveMode: true;
//   orderId: number;
//   distributorName: string;
//   medicines?: ApproveMedicine[];
// };



type ApproveOrderState = {
  approveMode: true;
  orderId: number;
  distributorName: string;

  medicines?: ApproveMedicine[];

  payment?: {
    paid: string;
    unpaid: string;
    paymentMode: string;
  };
};
 
const locationState = location.state as MedicineResponse | ApproveOrderState | undefined;
const editData = locationState && !("approveMode" in locationState)
  ? locationState
  : undefined;
const approveData =
  locationState && "approveMode" in locationState
    ? (locationState as ApproveOrderState)
    : undefined;
 
    const [currentMedicineIndex, setCurrentMedicineIndex] = useState(0);
 
const currentMedicine =
  approveData?.medicines?.[currentMedicineIndex];
 
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
    groupId: "",
    purchaseDate: new Date().toISOString().split("T")[0],
  },
});
 
 
  const isEdit = !!editData?.medicineId;
  const navigate = useNavigate();
    const [, setDistributorData] = useState<DistributorResponse[]>([]);
const [groupOptions, setGroupOptions] = useState<{ label: string; value: string }[]>([]);
const [supplierOptions, setSupplierOptions] = useState<{ label: string; value: string }[]>([]);
 
 
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
      console.log("=== DISTRIBUTOR DATA ===", JSON.stringify(data));
      const options = data.map((d) => ({
      label: d.companyName,
        value: d.distributorId.toString(),
      }));
      setSupplierOptions(options);
    } catch (error) {
      console.error("Error fetching distributors:", error);
    }
  };
 
  fetchDistributors();
}, []);
 
 
 
const onSubmit = async (data: InventoryFormData) => {
  try {
    const finalData = {
  ...data,
  distributorId: Number(data.distributorId),
  groupId: Number(data.groupId),
  companyName: data.companyName || "NA",
};

console.log("FINAL DATA", finalData);

    // EDIT MODE
    if (isEdit && editData?.medicineId) {
      await updateMedicine(editData.medicineId, finalData);

      window.dispatchEvent(new Event("inventoryUpdated"));

      navigate(URL_PATH.Inventory);
      return;
    }


    console.log("FINAL DATA", finalData);
    // SAVE MEDICINE
    await addMedicine(finalData);

    const totalMedicines =
      approveData?.medicines?.length || 0;

    // NEXT MEDICINE FORM
    if (
      approveData?.medicines &&
      currentMedicineIndex < totalMedicines - 1
    ) {
      setCurrentMedicineIndex((prev) => prev + 1);
      return;
    }

    // LAST MEDICINE → APPROVE ORDER
    // if (approveData?.orderId) {
    //   const token = localStorage.getItem("token");

    //   await axios.put(
    //     `${API_ENDPOINTS.REORDER}/${approveData.orderId}/approve`,
    //     {},
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     }
    //   );
    // }




    if (approveData?.orderId) {
  try {
    const token = localStorage.getItem("token");

    await axios.put(
      `${API_ENDPOINTS.REORDER}/${approveData.orderId}/approve`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Approve API Error", error);
  }
}

window.dispatchEvent(new Event("inventoryUpdated"));

navigate(URL_PATH.Inventory);

    // REFRESH INVENTORY
    window.dispatchEvent(new Event("inventoryUpdated"));

    // REDIRECT
    navigate(URL_PATH.Inventory);

  // } catch (error) {
  //   console.error(error);
  // }
  } catch (error) {
  if (axios.isAxiosError(error)) {
    console.log("BACKEND ERROR =>", error.response?.data);
  }

  console.error(error);
}
};
// Approve mode
const { reset } = methods;
 
// useEffect(() => {
//   if (!currentMedicine || supplierOptions.length === 0) return;
 
//   const matchedDistributor = supplierOptions.find(
//     (opt) =>
//       opt.label.toLowerCase() ===
//       approveData?.distributorName?.toLowerCase()
//   );
 
//   const amount = Number(currentMedicine.amount || 0);
//   const qty = Number(currentMedicine.qty || 0);
 
//   const calculatedPurchasePrice =
//     qty > 0 ? amount / qty : 0;
 
//   reset({
//     medicineName: currentMedicine.medicineName || "",
//     strength: currentMedicine.strength || "",
 
//     numberOfStrips: qty,
//     tabletsPerStrip: 1,
//     looseTablets: 0,
 
//     purchasePricePerStrip: Number(
//       calculatedPurchasePrice.toFixed(2)
//     ),
 
//     mrpPerStrip: 0,
//     gstPercent: 5,
 
//     purchaseDate: new Date().toISOString().split("T")[0],
 
//     expiryDate: "",
//     type: "",
//     groupId: "",
 
//     distributorId: matchedDistributor?.value || "",
//   });
 
// }, [currentMedicine, supplierOptions, reset, approveData]);



useEffect(() => {
  if (!approveData?.medicines?.length) return;

  const medicine =
    approveData.medicines[currentMedicineIndex];

  if (!medicine || supplierOptions.length === 0) return;

  const matchedDistributor = supplierOptions.find(
    (opt) =>
      opt.label.toLowerCase() ===
      approveData.distributorName?.toLowerCase()
  );

  const amount = Number(medicine.amount || 0);
  const qty = Number(medicine.qty || 0);

  const calculatedPurchasePrice =
    qty > 0 ? amount / qty : 0;

  reset({
    medicineName: medicine.medicineName || "",
    strength: medicine.strength || "",

    numberOfStrips: qty,
    tabletsPerStrip: 1,
    looseTablets: 0,

    purchasePricePerStrip: Number(
      calculatedPurchasePrice.toFixed(2)
    ),

    mrpPerStrip: 0,
    gstPercent: 5,

    purchaseDate:
      new Date().toISOString().split("T")[0],

    expiryDate: "",
    manufacturingDate: "",

    type: "",
    groupId: "",

    batchNumber: "",
    hsnCode: "",
    companyName: "",
    invoiceNumber: "",

    minimumQuantity: 0,
    maximumQuantity: 0,

    distributorId:
      matchedDistributor?.value || "",
  });

}, [
  currentMedicineIndex,
  approveData,
  supplierOptions,
  reset,
]);
 
 
//fetch medicine for edit
useEffect(() => {
  const fetchMedicine = async () => {
    if (editData?.medicineId) {
      const fullData = await getMedicineById(editData.medicineId);
 
      reset({
        medicineId: fullData.medicineId,
        medicineName: fullData.medicineName || "",
        batchNumber: fullData.batchNumber || "",
        hsnCode: fullData.hsnCode || "",
        strength: fullData.strength || "",
        type: fullData.type || "",
        groupId: String(fullData.groupId),
        distributorId: String(fullData.distributorId) as unknown as number,
 
        numberOfStrips: fullData.numberOfStrips ?? 0,
        tabletsPerStrip: fullData.tabletsPerStrip ?? 1,
        looseTablets: fullData.looseTablets ?? 0,
 
        purchasePricePerStrip: fullData.purchasePricePerStrip || 0,
        mrpPerStrip: fullData.mrpPerStrip || 0,
        gstPercent: fullData.gstPercent || 0,
 
        expiryDate: fullData.expiryDate
          ? new Date(fullData.expiryDate).toISOString().split("T")[0]
          : "",
 
        manufacturingDate: fullData.manufacturingDate
          ? new Date(fullData.manufacturingDate).toISOString().split("T")[0]
          : "",
 
        purchaseDate: fullData.purchaseDate
          ? new Date(fullData.purchaseDate).toISOString().split("T")[0]
          : "",
 
        companyName: fullData.companyName || "",
        invoiceNumber: fullData.invoiceNumber || "",
        minimumQuantity: fullData.minimumQuantity || 0,
        maximumQuantity: fullData.maximumQuantity || 0,
      });
    }
  };
 
  fetchMedicine();
}, [editData?.medicineId,reset]);
 
  // calc total stock tablets
const numberOfStrips = Number(methods.watch("numberOfStrips")) || 0;
const tabletsPerStrip = Number(methods.watch("tabletsPerStrip")) || 0;
const looseTablets = Number(methods.watch("looseTablets")) || 0;
const totalStock = numberOfStrips * tabletsPerStrip + looseTablets;
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
        {isEdit
  ? "Edit Medicine"
  : approveData?.medicines?.length
  ? "Approve & Add Medicine"
  : "Add New Medicine"}
       {/* {isEdit ? "Edit Medicine" : approveData ? "Approve & Add Medicine" : "Add New Medicine"} */}
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
//  orderedQty={approveData?.medicines?.[0]?.qty}
orderedQty={currentMedicine?.qty}
 
/>
 
     
        {/* <Box
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
        </Box> */}
 
 
        <Box
  gridColumn="1 / -1"
  display="flex"
  justifyContent={{ xs: "center", md: "flex-end" }}
  gap={2}
  flexWrap="wrap"
>
  <Button
    variant="outlined"
    onClick={() => navigate(-1)}
    sx={{
      px: 4,
      textTransform: "none",
      border: "2px solid #1b7f6b",
      color: "#1b7f6b",
       transition: "0.3s",
 
 
         "&:hover": {
        backgroundColor: "#1b7f6b",
        color: "#fff",
        border: "2px solid #1b7f6b",
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
      textTransform: "none",
      backgroundColor: "#1b7f6b",
      color: "#fff",
 
       transition: "0.3s",
 
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
</FormProvider>
  );
}
 
 