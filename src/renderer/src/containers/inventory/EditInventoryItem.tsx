// import { Box, Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
// import { FormProvider, useForm } from "react-hook-form";
// import { useEffect, useState } from "react";
// import TextInputField from "@/components/controlled/TextInputField";
// import NumericField from "@/components/controlled/NumericField";
// import DropdownField from "@/components/controlled/DropdownField";
// import DateTimeField from "@/components/controlled/DateTimeField";
// import { showSnackbar } from "@/components/uncontrolled/ToastMessage";

// export type OptionType = {
//     label: string;
//     value: string;
// };

// export type MedicineGroup = {
//     groupId: number;
//     groupName: string;
// };

// export type Distributor = {
//     distributorId: number;
//     companyName: string;
//     status: string;
// };

// export type InventoryItem = {
//     itemName: string;
//     medicineId: number;
//     quantity: number;
//     medicineGroup: string;
//     pricePerUnit: number;
//     expiryDate: string;
//     supplier: string;
//     gst: "12%"
// };

// type Props = {
//     open: boolean;
//     onClose: () => void;
//     item: InventoryItem | null;
//     tableData: InventoryItem[];
//     setTableData: (data: InventoryItem[]) => void;
// };

// export default function EditInventoryItem({open,onClose,item,tableData,setTableData,}: Props) {
//     const methods = useForm<InventoryItem>();
//     const [groupOptions, setGroupOptions] = useState<OptionType[]>([]);
//     const [supplierOptions, setSupplierOptions] = useState<OptionType[]>([]);

//     // set default values
//     useEffect(() => {
//         if (item) {
//             methods.reset(item);
//         }
//     }, [item, methods]);

//     // groups
//     useEffect(() => {
//         const groups: MedicineGroup[] = JSON.parse(
//             localStorage.getItem("medicineGroups") || "[]"
//         );

//         const options: OptionType[] = groups.map((g) => ({
//             label: g.groupName,
//             value: g.groupName,
//         }));

//         setGroupOptions(options);
//     }, []);

//     // suppliers
//     useEffect(() => {
//         const distributors: Distributor[] = JSON.parse(
//             localStorage.getItem("distributors") || "[]"
//         );

//         const options: OptionType[] = distributors
//             .filter((d) => d.status === "Active")
//             .map((d) => ({
//                 label: d.companyName,
//                 value: d.companyName,
//             }));

//         setSupplierOptions(options);
//     }, []);

//     const onSubmit = (data: InventoryItem) => {
//         const updated = tableData.map((i) =>
//             i.medicineId === data.medicineId
//                 ? { ...data, gst: i.gst } // ✅ important
//                 : i
//         );

//         setTableData(updated);
//         localStorage.setItem("inventory", JSON.stringify(updated));

//         window.dispatchEvent(new Event("inventoryUpdated"));

//         showSnackbar("success", "Item updated successfully");
//         onClose();
//     };
//     return (
//         <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//             <DialogTitle>Edit Item</DialogTitle>
//             <FormProvider {...methods}>
//                 <DialogContent>
//                     <Box
//                         component="form"
//                         onSubmit={methods.handleSubmit(onSubmit)}
//                         display="grid"
//                         gridTemplateColumns={{
//                             xs: "1fr",            // mobile - single column
//                             sm: "repeat(2, 1fr)",// tablet -2 columns
//                             md: "repeat(3, 1fr)" // desktop - 3 columns
//                         }}
//                         gap={{
//                             xs: 2,
//                             sm: 2.5,
//                             md: 3
//                         }}
//                         mt={1}
//                     >
//                         <TextInputField name="itemName" label="Item Name" required />
//                         <NumericField name="medicineId" label="Item ID" required />
//                         <NumericField name="quantity" label="Stock Quantity" required />
//                         <DropdownField
//                             name="medicineGroup"
//                             label="Medicine Group"
//                             options={groupOptions}
//                             required
//                             freeSolo={false}
//                             editable
//                         />

//                         <NumericField
//                             name="pricePerUnit"
//                             label="Price per Unit (₹)"
//                             required
//                         />

//                         <DateTimeField
//                             name="expiryDate"
//                             label="Expiry Date"
//                             viewMode="date"
//                             required
//                             useCurrentDate={false}
//                             dateRestriction="current-future-only"
//                         />

//                         <DropdownField
//                             name="supplier"
//                             label="Supplier"
//                             options={supplierOptions}
//                             required
//                             freeSolo={false}
//                             editable
//                         />

//                         <Box
//                             gridColumn="1 / -1"
//                             display="flex"
//                             justifyContent={{
//                                 xs: "center",   // mobile center
//                                 sm: "flex-end"  // tablet+ right
//                             }}
//                             flexDirection={{
//                                 xs: "column",   // mobile stack
//                                 sm: "row"       // row from sm+
//                             }}
//                             gap={2}
//                         >
//                             <Button
//                                 variant="outlined"
//                                 onClick={onClose}
//                                 sx={{
//                                     width: { xs: "100%", sm: "auto" },
//                                     px: 4,
//                                     textTransform: "none",
//                                     border: "2px solid #1b7f6b",
//                                     color: "#1b7f6b",
//                                 }}
//                             >
//                                 Cancel
//                             </Button>

//                             <Button
//                                 type="submit"
//                                 variant="contained"
//                                 sx={{
//                                     width: { xs: "100%", sm: "auto" },
//                                     px: 4,
//                                     textTransform: "none",
//                                     backgroundColor: "#1b7f6b",
//                                 }}
//                             >
//                                 Save
//                             </Button>
//                         </Box>
//                     </Box>
//                 </DialogContent>
//             </FormProvider>
//         </Dialog>
//     );
// }

import { Box, Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import TextInputField from "@/components/controlled/TextInputField";
import NumericField from "@/components/controlled/NumericField";
import DropdownField from "@/components/controlled/DropdownField";
import DateTimeField from "@/components/controlled/DateTimeField";
import { showSnackbar } from "@/components/uncontrolled/ToastMessage";
import axios from "axios";
import { API_ENDPOINTS } from "@/constants/ApiEndpoints";
import { updateMedicine } from "@/service/medicineService";

export type OptionType = {
  label: string;
  value: string;
};

export type InventoryItem = {
  itemName: string;
  medicineId: number;
  quantity: number;
  medicineGroup: string;
  groupId: number;
  pricePerUnit: number;
  expiryDate: string;
  supplier: string;
  distributorId: number;
  gst: string;
  unit: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  item: InventoryItem | null;
};

export default function EditInventoryItem({ open, onClose, item }: Props) {
  const methods = useForm<InventoryItem>();

  const [groupOptions, setGroupOptions] = useState<OptionType[]>([]);
  const [supplierOptions, setSupplierOptions] = useState<OptionType[]>([]);

  // useRef — re-render न होता maps store करायला
  const groupIdMapRef = useRef<Record<string, number>>({});
  const supplierIdMapRef = useRef<Record<string, number>>({});
  const groupNameMapRef = useRef<Record<number, string>>({});
  const supplierNameMapRef = useRef<Record<number, string>>({});

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: token ? `Bearer ${token}` : "" } };
  };

  // Load Medicine Groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.MEDICINE_GROUP, getAuthHeader());

        const idMap: Record<string, number> = {};
        const nameMap: Record<number, string> = {};

        const options: OptionType[] = res.data.data.map((g: { groupId: number; groupName: string }) => {
          idMap[g.groupName] = g.groupId;
          nameMap[g.groupId] = g.groupName;
          return { label: g.groupName, value: g.groupName };
        });

        groupIdMapRef.current = idMap;
        groupNameMapRef.current = nameMap;
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
        const res = await axios.get(API_ENDPOINTS.DISTRIBUTOR, getAuthHeader());

        const sMap: Record<string, number> = {};
        const nameMap: Record<number, string> = {};

        const options: OptionType[] = res.data.map((d: { distributorId: number; companyName: string }) => {
          sMap[d.companyName] = d.distributorId;
          nameMap[d.distributorId] = d.companyName;
          return { label: d.companyName, value: d.companyName };
        });

        supplierIdMapRef.current = sMap;
        supplierNameMapRef.current = nameMap;
        setSupplierOptions(options);
      } catch (error) {
        console.error("Error fetching distributors:", error);
      }
    };

    fetchDistributors();
  }, []);

  // Pre-fill — options load झाल्यावर
  useEffect(() => {
  if (item && groupOptions.length > 0 && supplierOptions.length > 0) {
    methods.reset({
      ...item,
      medicineGroup: groupNameMapRef.current[item.groupId] || item.medicineGroup,
      supplier: supplierNameMapRef.current[item.distributorId] || item.supplier,
      unit: item.unit || "",  // ← हे add करा
    });
  }
}, [item, groupOptions, supplierOptions, methods]);

  const onSubmit = async (data: InventoryItem) => {
    try {
      const resolvedGroupId = groupIdMapRef.current[data.medicineGroup] ?? item?.groupId ?? 0;
      const resolvedDistributorId = supplierIdMapRef.current[data.supplier] ?? item?.distributorId ?? 0;

      await updateMedicine(data.medicineId, {
        itemName: data.itemName,
        unit: data.unit,
        quantity: data.quantity,
        pricePerUnit: data.pricePerUnit,
        expiryDate: data.expiryDate,
        medicineGroup: resolvedGroupId.toString(),
        supplier: resolvedDistributorId.toString(),
      });

      showSnackbar("success", "Item updated successfully");
      onClose();
    } catch (error) {
      console.error("Update failed:", error);
      showSnackbar("error", "Update failed");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Item</DialogTitle>
      <FormProvider {...methods}>
        <DialogContent>
          <Box
            component="form"
            onSubmit={methods.handleSubmit(onSubmit)}
            display="grid"
            gridTemplateColumns={{
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            }}
            gap={{ xs: 2, sm: 2.5, md: 3 }}
            mt={1}
          >
            <TextInputField name="itemName" label="Item Name" required />
            <NumericField name="medicineId" label="Item ID" required />
            <NumericField name="quantity" label="Stock Quantity" required />

            <DropdownField
              name="medicineGroup"
              label="Medicine Group"
              options={groupOptions}
              required
              freeSolo={false}
              editable
            />

            <NumericField name="pricePerUnit" label="Price per Unit (₹)" required />

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
              options={supplierOptions}
              required
              freeSolo={false}
              editable
            />

            <DropdownField
              name="unit"
              label="Unit"
              options={[
                { label: "Tablets", value: "tablets" },
                { label: "Bottle", value: "bottle" },
                { label: "Strip", value: "strip" },
                { label: "Capsules", value: "capsules" },
                { label: "Rolls", value: "rolls" },
                { label: "Boxes", value: "boxes" },
                { label: "Pairs", value: "pairs" },
              ]}
              required
              freeSolo={false}
              editable
            />

            <Box
              gridColumn="1 / -1"
              display="flex"
              justifyContent={{ xs: "center", sm: "flex-end" }}
              flexDirection={{ xs: "column", sm: "row" }}
              gap={2}
            >
              <Button
                variant="outlined"
                onClick={onClose}
                sx={{
                  width: { xs: "100%", sm: "auto" },
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
                  width: { xs: "100%", sm: "auto" },
                  px: 4,
                  textTransform: "none",
                  backgroundColor: "#1b7f6b",
                }}
              >
                Save
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}