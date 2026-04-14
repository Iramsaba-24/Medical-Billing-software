import { useState, useEffect } from "react";
import AddCustomerForm from "@/containers/Customer/AddCustomerForm";
import CustomerListPage from "@/containers/Customer/CustomerListPage";
import CustomerViewDetails from "@/containers/Customer/CustomerViewDetails";
import {
  showToast,
  showConfirmation,
} from "@/components/uncontrolled/ToastMessage";
import { getAllCustomers } from "@/service/customerService";
import { deleteCustomer } from "@/service/customerService";

export interface PurchaseHistory {
  id: string;
  date: string;
  doctor: string;
  [key: string]: string | number | undefined;
}

export interface CustomerData {
  srNo: number;
  id?: string;
  customerId: number;
  name: string;
  age: string;
  phone: string;
  email?: string;
  address: string;
  doctor: string;
  doctorAddress?: string;
  date: string;
  medicines?: string;
  totalPrice?: number;
  totalQty?: number;
  history?: PurchaseHistory[];
  [key: string]: string | number | boolean | PurchaseHistory[] | undefined;
}

const CustomerMaster = () => {
  const [view, setView] = useState<"list" | "add" | "view">("list");

  const [customerList, setCustomerList] = useState<CustomerData[]>([]);

  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(
    null
  );
  const fetchCustomers = async () => {
    try {
      const data = await getAllCustomers();
      console.log("API DATA ", data);
      setCustomerList(data);
    } catch (error) {
      console.error("Failed to fetch customers", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSave = async () => {
    await fetchCustomers();
    setView("list");
  };
  const handleEditInvoice = (invoice: PurchaseHistory) => {
    if (!selectedCustomer) return;
    const editData: CustomerData = {
      ...selectedCustomer,
      doctor: invoice.doctor,
      date: invoice.date,
    };
    setSelectedCustomer(editData);
    setView("add");
  };

  const handleDeleteCustomer = async (cust: CustomerData) => {
    const confirmed = await showConfirmation(
      `Are you sure you want to delete ${cust.name}?`,
      "Confirm Delete"
    );

    if (confirmed && cust.customerId) {
      await deleteCustomer(cust.customerId);
      await fetchCustomers();
      showToast("success", "Customer deleted successfully!");
    }
  };

  const handleDeleteInvoice = async (invoice: PurchaseHistory) => {
    if (!selectedCustomer) return;

    const confirmed = await showConfirmation(
      "Are you sure you want to delete this invoice from history?",
      "Confirm Delete Invoice"
    );

    if (confirmed) {
      setCustomerList((prev) => {
        const updatedList = prev.map((cust) => {
          if (
            cust.name.toLowerCase().trim() ===
            selectedCustomer.name.toLowerCase().trim()
          ) {
            const updatedHistory = (cust.history || []).filter(
              (inv) => inv.id !== invoice.id
            );
            const updatedCust = { ...cust, history: updatedHistory };
            setSelectedCustomer(updatedCust);
            return updatedCust;
          }
          return cust;
        });
        return updatedList;
      });
      showToast("success", "Invoice deleted from history!");
    }
  };

  return (
    <>
      {view === "list" && (
        <CustomerListPage
          data={customerList}
          onView={(cust) => {
            setSelectedCustomer(cust);
            setView("view");
          }}
          onEdit={(cust) => {
            setSelectedCustomer(cust);
            setView("add");
          }}
          onDelete={handleDeleteCustomer}
        />
      )}

      {view === "add" && (
        <AddCustomerForm
          onBack={() => setView("list")}
          onSave={handleSave}
          initialData={selectedCustomer}
        />
      )}

      {view === "view" && selectedCustomer && (
        <CustomerViewDetails
          customer={selectedCustomer}
          onBack={() => setView("list")}
          onDeleteInvoice={handleDeleteInvoice}
          onEditInvoice={handleEditInvoice}
        />
      )}
    </>
  );
};

export default CustomerMaster;
