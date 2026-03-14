import { useState, useEffect } from "react";
import AddCustomerForm from "@/containers/Customer/AddCustomerForm";
import CustomerListPage from "@/containers/Customer/CustomerListPage";
import CustomerViewDetails from "@/containers/Customer/CustomerViewDetails";
import { showToast, showConfirmation } from "@/components/uncontrolled/ToastMessage"
 
// Structure for a single purchase invoice record
export interface PurchaseHistory {
  id: string;
  date: string;
  doctor: string;
  [key: string]: string | number  | undefined;
}

// Main Customer data structure including their history
export interface CustomerData {
  id?: string;
  name: string;
  age: string;
  mobile: string;
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
  // State to manage which screen to  'list', 'add', or 'view'
  const [view, setView] = useState<"list" | "add" | "view">("list");
 
  // Load customer list from LocalStorage when the app starts
  const [customerList, setCustomerList] = useState<CustomerData[]>(() => {
    const savedData = localStorage.getItem("medical_customers");
    return savedData ? JSON.parse(savedData) : [];
  });
 
  // State to hold the data of the customer currently being edited or viewed
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null);
 
  // Automatically save the customer list to LocalStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("medical_customers", JSON.stringify(customerList));
  }, [customerList]);
 
  // Function to save or update customer and invoice data 
  const handleSave = (formData: CustomerData ) => {
    setCustomerList((prev) => { 
      // Check if the customer already exists by comparing names
      const existingIndex = prev.findIndex(
        (c) => c.name.toLowerCase().trim() === formData.name.toLowerCase().trim()
      );
     
      // Create a new invoice object for this transaction
      const newInvoice: PurchaseHistory = {
        id: `INV-${Date.now()}`,
        date: formData.date,
        doctor: formData.doctor,
      };
 
      if (existingIndex > -1) {
        // If customer exists, update their details and add new invoice to their history
        const updatedList = [...prev];
        const existingCust = updatedList[existingIndex];
        updatedList[existingIndex] = {
          ...existingCust,
          ...formData,
          history: [newInvoice, ...(existingCust.history || [])]
        };
        showToast("success", "Invoice updated successfully!");
        return updatedList;
      } else {
        //  create a new record and set their first invoice
        const newCustomer: CustomerData = {
          ...formData,
          id: `CUST-${Date.now()}`,
          history: [newInvoice]
        };
        showToast("success", "New Customer and Invoice saved!");
        return [...prev, newCustomer];
      }
    });
   
    // Reset and go back to the list view after saving
    setSelectedCustomer(null);
    setView("list");
  };
 
  // Function to load existing invoice data into the form for editing
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
 
  // Function to delete a customer entirely
  const handleDeleteCustomer = async (cust: CustomerData) => {
    const confirmed = await showConfirmation(
      `Are you sure you want to delete ${cust.name}?`,
      "Confirm Delete"
    );
 
    if (confirmed) {
      setCustomerList((prev) => prev.filter((item) => item.name !== cust.name));
      showToast("success", "Customer deleted successfully!");
    }
  };
 
  // Function to delete only one specific invoice from a customer's history
  const handleDeleteInvoice = async (invoice: PurchaseHistory) => {
    if (!selectedCustomer) return;
 
    const confirmed = await showConfirmation(
      "Are you sure you want to delete this invoice from history?",
      "Confirm Delete Invoice"
    );
 
    if (confirmed) {
      setCustomerList((prev) => {
        const updatedList = prev.map((cust) => {
          // Find the customer and filter out the specific invoice ID
          if (cust.name.toLowerCase().trim() === selectedCustomer.name.toLowerCase().trim()) {
            const updatedHistory = (cust.history || []).filter((inv) => inv.id !== invoice.id);
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
      {/* Conditionally render screens based on the 'view' state */}
      {view === "list" && (
        <CustomerListPage
          data={customerList}
 
          onView={(cust) => { setSelectedCustomer(cust); setView("view"); }}
          onEdit={(cust) => { setSelectedCustomer(cust); setView("add"); }}
          onDelete={handleDeleteCustomer}
        />
      )}
     
      {view === "add" && (
        <AddCustomerForm onBack={() => setView("list")} onSave={handleSave} initialData={selectedCustomer} />
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
 