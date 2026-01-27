import { useState } from "react";
import { Button, Box, Typography, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";

import CustomerForm from "@/containers/CustomerPage/CustomerForm";
import CustomerTable from "@/containers/CustomerPage/CustomerTable";
import { Customer, CustomerFormData, getAmount } from "@/containers/CustomerPage/CustomerTypes";
import { showToast } from "@/components/uncontrolled/ToastMessage";

export default function CustomerMaster() {
  const [rows, setRows] = useState<Customer[]>([
    {
      id: "CUS-001",
      name: "John Doe",
      mobile: "9876543210",
      age: 35,
      email:'sk@gmail.com',
      referenceFrom: "Dr. Shyam Raut",
      address: "123 MG Road, Pune",
      date: dayjs().subtract(2, "day").toISOString(),
      items: [{ medicine: "Paracetamol", quantity: 5 }],
      total: 10,
    },
    {
      id: "CUS-002",
      name: "Jane Smith",
      mobile: "9123456789",
      age: 28,
      email:'om@gmail.com',
      referenceFrom: "Dr. Aman Sheikh",
      address: "45 Park Street, Mumbai",
      date: dayjs().subtract(1, "day").toISOString(),
      items: [{ medicine: "Crocin", quantity: 4 }],
      total: 12,
    },
  ]);

  const [editRow, setEditRow] = useState<Customer | null>(null);
  const [open, setOpen] = useState(false);

  const handleSave = (data: CustomerFormData, editId?: string) => {
    const total = data.items.reduce(
      (s, i) => s + getAmount(i.medicine, i.quantity),
      0
    );

    const payload = {
      ...data,
      date: dayjs().toISOString(),
      total,
    };

    if (editId) {
      setRows((p) =>
        p.map((r) => (r.id === editId ? { ...r, ...payload } : r))
      );
      showToast("success", "Customer details updated successfully!");
    } else {
      setRows((p) => [...p, { id: uuid(), ...payload }]);
      showToast("success", "Customer details saved successfully!");
    }
    setOpen(false);
    setEditRow(null);
  };

  return (
    <>
      {/* Header */}
      <Paper
     
        sx={{
          borderRadius: 2,
          p: { xs: 0, sm: 2 },
         
          // minHeight: "100vh",
        }}
        elevation={12}
      >
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent={{ xs: "center", sm: "space-between" }}
          mb={2}
        >
          <Typography
            sx={{ fontSize: { xs: 22, sm: 25, md: 30 } }}
            fontWeight={600}
            alignSelf="center"
          >
            Customers Details
          </Typography>

          <Button
            variant="contained"
            sx={{ bgcolor: "#0ca678", width: 180, alignSelf: "center", my: 1 }}
            startIcon={<AddIcon />}
            onClick={() => {
              setEditRow(null);
              setOpen(true);
            }}
          >
            Add Customer
          </Button>
        </Box>

        {/* Table */}
        <CustomerTable
          rows={rows}
          setRows={setRows}
          onEdit={(row) => {
            setEditRow(row);
            setOpen(true);
          }}
        />
      </Paper>

      {/* Form */}
      <CustomerForm
        open={open}
        editRow={editRow}
        customers={rows}
        onClose={() => {
          setOpen(false);
          setEditRow(null);
        }}
        onSave={handleSave}
      />
    </>
  );
}
