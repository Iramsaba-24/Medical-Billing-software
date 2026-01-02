import { useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from "@mui/material";

import ReusableTable, {
  TableColumn
} from "../components/uncontrolled/ReusableTable";


type Product = {
  name: string;
  qty: number;
  rate: number;
  discount: number;
  gst: number;
  amount: number;
};

type Customer = {
  customerNo: string;
  name: string;
  contact: string;
  email: string;
};


const emptyProduct: Product = {
  name: "",
  qty: 1,
  rate: 0,
  discount: 0,
  gst: 0,
  amount: 0
};


const SalesBilling = () => {
  const [invoiceNo] = useState(
    `INV-${Date.now().toString().slice(-6)}`
  );
  const [invoiceDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [products, setProducts] = useState<Product[]>([]);
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [dialogProducts, setDialogProducts] = useState<Product[]>([
    { ...emptyProduct }
  ]);
  const [editIndex, setEditIndex] = useState<number | null>(null);


  const [customers, setCustomers] = useState<Customer[]>([]);
  const [openCustomerDialog, setOpenCustomerDialog] = useState(false);

  const [tempCustomer, setTempCustomer] = useState({
    name: "",
    contact: "",
    email: ""
  });


  const productColumns: TableColumn<Product>[] = [
    { key: "name", label: "Product Name" },
    { key: "qty", label: "Qty" },
    { key: "rate", label: "Rate" },
    { key: "discount", label: "Discount" },
    { key: "gst", label: "GST %" },
    { key: "actionsbuttons", label: "Actions" }
  ];

  const customerColumns: TableColumn<Customer>[] = [
    { key: "customerNo", label: "Customer No" },
    { key: "name", label: "Customer Name" },
    { key: "contact", label: "Contact" },
    { key: "email", label: "Email" },
    { key: "actionsbuttons", label: "Actions" }
  ];

  const handleSendEmail = (customer: Customer) => {
    alert(`Email will be sent to ${customer.email}\nInvoice: ${invoiceNo}`);
  };

  const handleSendSMS = (customer: Customer) => {
    alert(`SMS will be sent to ${customer.contact}\nAmount: ${grandTotal}`);
  };

  const handleEditProduct = (row: Product, index: number) => {
    setDialogProducts([row]);
    setEditIndex(index);     
    setOpenProductDialog(true);
  };

  const handleDeleteProduct = (_row: Product, index: number) => {
    if (!window.confirm("Delete this product?")) return;
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleProductChange = (
    index: number,
    field: keyof Product,
    value: string | number
  ) => {
    const updated = [...dialogProducts];

    updated[index] = {
      ...updated[index],
      [field]: field === "name" ? value : Number(value)
    };

    const { qty, rate, discount, gst } = updated[index];

    const base = qty * rate;
    const afterDiscount = base - discount;
    const gstAmount = (afterDiscount * (gst || 0)) / 100;

    updated[index].amount = afterDiscount + gstAmount;

    setDialogProducts(updated);
  };

  const addProductRow = () => {
    setDialogProducts([...dialogProducts, { ...emptyProduct }]);
  };

  const deleteProductRow = (index: number) => {
    if (dialogProducts.length === 1) return;
    setDialogProducts(dialogProducts.filter((_, i) => i !== index));
  };
  const saveProducts = () => {
    const invalid = dialogProducts.some(
      (p) => !p.name.trim() || p.qty <= 0 || p.rate <= 0
    );

    if (invalid) {
      alert("Please enter valid product details");
      return;
    }

    if (editIndex !== null) {
      const updated = [...products];
      updated[editIndex] = dialogProducts[0];
      setProducts(updated);
      setEditIndex(null);
    } else {
      setProducts((prev) => [...prev, ...dialogProducts]);
    }

    setDialogProducts([{ ...emptyProduct }]);
    setOpenProductDialog(false);
  };


  const saveCustomer = () => {
    if (!tempCustomer.name.trim()) {
      alert("Customer name is required");
      return;
    }

    const index = customers.length + 1;

    setCustomers([
      {
        customerNo: `CUST-${String(index).padStart(3, "0")}`,
        name: tempCustomer.name,
        contact: tempCustomer.contact,
        email: tempCustomer.email
      }
    ]);

    setTempCustomer({ name: "", contact: "", email: "" });
    setOpenCustomerDialog(false);
  };


  const subTotal = products.reduce((s, p) => s + p.qty * p.rate, 0);
  const totalDiscount = products.reduce((s, p) => s + p.discount, 0);
  const totalGST = products.reduce(
    (s, p) => s + ((p.qty * p.rate - p.discount) * (p.gst || 0)) / 100,
    0
  );
  const grandTotal = subTotal - totalDiscount + totalGST;


  return (
    <Box p={3} bgcolor="#02022b" mt={2}>
      <Typography color="white" fontWeight="bold">
        Date: {invoiceDate}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" mb={2} color="white" justifyContent="space-between" display={"flex"}>
        Customer Details

        <Button variant="outlined" onClick={() => setOpenCustomerDialog(true)}>
          + Customer
        </Button>
      </Typography>

      <ReusableTable<Customer>
        data={customers}
        columns={customerColumns}
        showSearch={false}
        showExport={false}
        actions={{
          onSend: (row) => handleSendEmail(row),
          onCall: (row) => handleSendSMS(row)   
        }}
      />

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" mb={2} color="white" justifyContent="space-between" display={"flex"}>
        Product Details

        <Button variant="outlined" onClick={() => setOpenProductDialog(true)} >
          + Product
        </Button>
      </Typography>

      <ReusableTable<Product>
        data={products}
        columns={productColumns}
        showSearch={false}
        showExport={false}
        actions={{
          onEdit: (row, index) => handleEditProduct(row, index),  
          onDelete: (row, index) => handleDeleteProduct(row, index) 
        }}
      />

      <Box mt={3} ml="auto" bgcolor="#0b0b3d" p={2}>
        <Typography color="white">
          Sub Total: <b>{subTotal.toFixed(2)}</b>
        </Typography>
        <Typography color="white">
          Discount: <b>{totalDiscount.toFixed(2)}</b>
        </Typography>
        <Typography color="white">
          GST: <b>{totalGST.toFixed(2)}</b>
        </Typography>
        <Divider />
        <Typography color="white" fontWeight="bold">
          Grand Total: {grandTotal.toFixed(2)}
        </Typography>
      </Box>


      <Dialog
        open={openProductDialog}
        onClose={() => setOpenProductDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Add Products</DialogTitle>

        <DialogContent>
          <Paper variant="outlined">
            <Box component="table" width="100%">
              <Box component="tbody">
                {dialogProducts.map((row, i) => (
                  <Box component="tr" key={i}>
                    <Box component="td" p={1}>
                      <TextField
                        size="small"
                        label="Product Name"
                        value={row.name}
                        onChange={(e) =>
                          handleProductChange(i, "name", e.target.value)
                        }
                      />
                    </Box>
                    <Box component="td" p={1}>
                      <TextField
                        type="number"
                        label="Quantity"
                        size="small"
                        value={row.qty}
                        onChange={(e) =>
                          handleProductChange(i, "qty", e.target.value)
                        }
                      />
                    </Box>
                    <Box component="td" p={1}>
                      <TextField
                        type="number"
                        label="Rate"
                        size="small"
                        value={row.rate}
                        onChange={(e) =>
                          handleProductChange(i, "rate", e.target.value)
                        }
                      />
                    </Box>
                    <Box component="td" p={1}>
                      <TextField
                        type="number"
                        label="Discount"
                        size="small"
                        value={row.discount}
                        onChange={(e) =>
                          handleProductChange(i, "discount", e.target.value)
                        }
                      />
                    </Box>
                    <Box component="td" p={1}>
                      <TextField
                        type="number"
                        label="GST %"
                        size="small"
                        value={row.gst}
                        onChange={(e) =>
                          handleProductChange(i, "gst", e.target.value)
                        }
                      />
                    </Box>
                    <Box component="td" p={1}>
                      <TextField
                        label="Amount"
                        size="small"
                        value={row.amount.toFixed(2)}
                        disabled
                      />
                    </Box>

                    <Box component="td" p={1} textAlign="center">
                      <Button
                        color="error"
                        size="small"
                        onClick={() => deleteProductRow(i)}
                        disabled={dialogProducts.length === 1}
                      >
                        ✕
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Paper>

          <Button sx={{ mt: 2, ml: "91%" }} onClick={addProductRow}>
            + Add Row
          </Button>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenProductDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={saveProducts}>
            Add Products
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog
        open={openCustomerDialog}
        onClose={() => setOpenCustomerDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Customer</DialogTitle>
        <DialogContent>
          <Paper variant="outlined">
            <Box p={3} display="grid" gap={2}>
              <TextField
                label="Customer No"
                size="small"
                disabled
                value={`CUST-${String(customers.length + 1).padStart(3, "0")}`}
              />
              <TextField
                label="Customer Name"
                size="small"
                value={tempCustomer.name}
                onChange={(e) =>
                  setTempCustomer({ ...tempCustomer, name: e.target.value })
                }
              />
              <TextField
                label="Contact Number"
                size="small"
                value={tempCustomer.contact}
                onChange={(e) =>
                  setTempCustomer({ ...tempCustomer, contact: e.target.value })
                }
              />
              <TextField
                label="Email"
                size="small"
                value={tempCustomer.email}
                onChange={(e) =>
                  setTempCustomer({ ...tempCustomer, email: e.target.value })
                }
              />
            </Box>
          </Paper>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenCustomerDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={saveCustomer}>
            Save Customer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SalesBilling;
