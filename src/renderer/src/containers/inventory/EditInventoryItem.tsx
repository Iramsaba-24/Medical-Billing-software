import { Box, Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import TextInputField from "@/components/controlled/TextInputField";
import NumericField from "@/components/controlled/NumericField";
import DropdownField from "@/components/controlled/DropdownField";
import DateTimeField from "@/components/controlled/DateTimeField";
import { showSnackbar } from "@/components/uncontrolled/ToastMessage";

export type OptionType = {
    label: string;
    value: string;
};

export type MedicineGroup = {
    groupId: number;
    groupName: string;
};

export type Distributor = {
    distributorId: number;
    companyName: string;
    status: string;
};

export type InventoryItem = {
    itemName: string;
    medicineId: number;
    quantity: number;
    medicineGroup: string;
    pricePerUnit: number;
    expiryDate: string;
    supplier: string;
    gst: "12%"
};

type Props = {
    open: boolean;
    onClose: () => void;
    item: InventoryItem | null;
    tableData: InventoryItem[];
    setTableData: (data: InventoryItem[]) => void;
};

export default function EditInventoryItem({open,onClose,item,tableData,setTableData,}: Props) {
    const methods = useForm<InventoryItem>();
    const [groupOptions, setGroupOptions] = useState<OptionType[]>([]);
    const [supplierOptions, setSupplierOptions] = useState<OptionType[]>([]);

    // set default values
    useEffect(() => {
        if (item) {
            methods.reset(item);
        }
    }, [item, methods]);

    // groups
    useEffect(() => {
        const groups: MedicineGroup[] = JSON.parse(
            localStorage.getItem("medicineGroups") || "[]"
        );

        const options: OptionType[] = groups.map((g) => ({
            label: g.groupName,
            value: g.groupName,
        }));

        setGroupOptions(options);
    }, []);

    // suppliers
    useEffect(() => {
        const distributors: Distributor[] = JSON.parse(
            localStorage.getItem("distributors") || "[]"
        );

        const options: OptionType[] = distributors
            .filter((d) => d.status === "Active")
            .map((d) => ({
                label: d.companyName,
                value: d.companyName,
            }));

        setSupplierOptions(options);
    }, []);

    const onSubmit = (data: InventoryItem) => {
        const updated = tableData.map((i) =>
            i.medicineId === data.medicineId
                ? { ...data, gst: i.gst } // ✅ important
                : i
        );

        setTableData(updated);
        localStorage.setItem("inventory", JSON.stringify(updated));

        window.dispatchEvent(new Event("inventoryUpdated"));

        showSnackbar("success", "Item updated successfully");
        onClose();
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
                            xs: "1fr",            // mobile - single column
                            sm: "repeat(2, 1fr)",// tablet -2 columns
                            md: "repeat(3, 1fr)" // desktop - 3 columns
                        }}
                        gap={{
                            xs: 2,
                            sm: 2.5,
                            md: 3
                        }}
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

                        <NumericField
                            name="pricePerUnit"
                            label="Price per Unit (₹)"
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
                            options={supplierOptions}
                            required
                            freeSolo={false}
                            editable
                        />

                        <Box
                            gridColumn="1 / -1"
                            display="flex"
                            justifyContent={{
                                xs: "center",   // mobile center
                                sm: "flex-end"  // tablet+ right
                            }}
                            flexDirection={{
                                xs: "column",   // mobile stack
                                sm: "row"       // row from sm+
                            }}
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