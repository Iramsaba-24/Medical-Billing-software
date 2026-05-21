
import TextInputField from "@/components/controlled/TextInputField";
import DropdownField from "@/components/controlled/DropdownField";
import DateTimeField from "@/components/controlled/DateTimeField";
import { InventoryFormData } from "./AddInventoryItem";
import { useFormContext } from "react-hook-form";
import {  Typography } from "@mui/material";

type Props = {
  groupOptions: { label: string; value: string }[];
  supplierOptions: { label: string; value: string }[];
  totalStock: number;
  purchasePricePerTablet: number;
  mrpPerTablet: number;
  finalPrice: number;
  orderedQty?: number; 
};

export default function InventoryFormFields({
  groupOptions,
  supplierOptions,
  totalStock,
  orderedQty,
}: Props) {
  const methods = useFormContext<InventoryFormData>();

  // warning logic
  const showWarning = orderedQty !== undefined;
 
  const isOver = totalStock > (orderedQty ?? 0);
  const isUnder = totalStock < (orderedQty ?? 0);

  return (
    <>
      <TextInputField
        inputType="all"
        rows={1}
        name="medicineName"
        label="Medicine Name"
        maxLength={30}
        required
      />

      <TextInputField
        name="strength"
        label="Strength(e.g.500mg)"
        required
        maxLength={30}
      />

      <TextInputField
        name="companyName"
        label="Medicine Company Name"
        required
        minLength={3}
        maxLength={30}
      />

      <DropdownField
        name="groupId"
        label="Medicine Group"
        options={groupOptions}
        required
        freeSolo={false}
        editable
      />

      <TextInputField inputType="all" rows={1} name="batchNumber" label="Batch Number" required minLength={1} maxLength={30} />

      <TextInputField
        inputType="numbers"
        name="hsnCode"
        label="HSN Number"
        minLength={4}
        maxLength={10}
        required
      />

      <DropdownField
        name="type"
        label="Type"
        required
        options={[
          { label: "Tablets", value: "tablets" },
          { label: "Bottle", value: "bottle" },
          { label: "Strip", value: "strip" },
          { label: "Capsules", value: "capsules" },
          { label: "Boxes", value: "boxes" },
        ]}
      />

      <TextInputField
        inputType="numbers"
        name="minimumQuantity"
        label="Minimum Stock Level"
        required
      />

      <TextInputField
        inputType="numbers"
        name="maximumQuantity"
        label="Maximum Stock Limit"
        required
        rules={{
          validate: (value: number) => {
            const min = Number(methods.getValues("minimumQuantity"));
            return (
              value >= min ||
              "Maximum quantity must be greater than or equal to minimum quantity"
            );
          },
        }}
      />

      <TextInputField
        inputType="numbers"
        name="numberOfStrips"
        label="Number of Medicine Pack"
        required
        rules={{
          min: { value: 0, message: "Number of strips must be greater than 0" },
        }}
      />

      <TextInputField
        inputType="numbers"
        name="tabletsPerStrip"
        label="Tablets In One Pack"
        required
        rules={{
          min: {
            value: 1,
            message: "Tablets per strip must be greater than 0",
          },
        }}
      />

      <TextInputField inputType="numbers" name="invoiceNumber" label="Invoice Number" />

      {/* <TextInputField inputType="numbers" name="looseTablets" label="Extra Medicine (Loose)" 
      rules={{
        min: { value: 0, message: "Loose tablets cannot be negative" },
      }}/> */}

      {/* Ordered Qty Warning */}
      {showWarning && (
  <Typography
    gridColumn="1 / -1"
    fontSize={13}
    fontWeight={600}
    color={isOver ? "error.main" : isUnder ? "warning.main" : "success.main"}
  >
    {isOver
      ? `Total stock (${totalStock}) is more than ordered qty (${orderedQty})`
      : isUnder
      ? `Total stock (${totalStock}) is less than ordered qty (${orderedQty})`
      : `Total stock matches ordered qty (${orderedQty})`}
  </Typography>
)}
      <TextInputField
        inputType="numbers"
        name="purchasePricePerStrip"
        label="Purchase Price Per Strip"
        required
      />
      <TextInputField
        inputType="numbers"
        name="mrpPerStrip"
        label="MRP Per Strip"
        required
        rules={{
          validate: (value: number) => {
            const purchase = Number(methods.getValues("purchasePricePerStrip"));
            return (
              value > purchase || "MRP must be greater than Purchase Price"
            );
          },
        }}
      />

      {/* <TextInputField inputType="numbers" name="mrpPerTablet" label="MRP Per Tablet" value={mrpPerTablet}
        disabled
      /> */}

      <TextInputField
        inputType="numbers"
        name="gstPercent"
        label="GST Percentage"
      />

      {/* <TextInputField name="finalPrice" label="Final Amount (With GST)" value={finalPrice} disabled/> */}

      <DropdownField
        name="distributorId"
        label="Distributor"
        options={supplierOptions}
        required
      />

      <DateTimeField
        name="expiryDate"
        label="Expiry Date"
        viewMode="date"
        required
        dateRestriction="current-future-only"
      />

      <DateTimeField name="purchaseDate" label="Purchase Date" required />

      <DateTimeField
        name="manufacturingDate"
        label="Manufacturing Date"
        dateRestriction="past-current-only"
        required
      />   
    </>
  );
}

