 import { useState, useEffect } from "react";
import AddCustomerForm from "@/containers/Customer/AddCustomerForm";
import CustomerListPage from "@/containers/Customer/CustomerListPage";
import CustomerViewDetails from "@/containers/Customer/CustomerViewDetails";

// Structure for Purchase History 
export interface PurchaseHistory {
  [key: string]: string | number | boolean | undefined; 
  id: string;
  date: string;
  medicines: string;
  totalQty: number;
  totalPrice: number;
  doctor: string;
}

// Structure for Customer Data 
export interface CustomerData {
  [key: string]: string | number | boolean | PurchaseHistory[] | undefined;
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
}

const CustomerMaster = () => {
  //  controls which screen to show (list, add form, or details)
  const [view, setView] = useState<"list" | "add" | "view">("list");
  
  //  stores all customers in an array
  const [customerList, setCustomerList] = useState<CustomerData[]>(() => {
    // Load saved data from browser storage on start
    const savedData = localStorage.getItem("medical_customers");
    return savedData ? (JSON.parse(savedData) as CustomerData[]) : [];
  });

  //  holds the data of the customer currently being viewed or edited
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null);

  // Auto-save data to localStorage whenever the customer list changes
  useEffect(() => {
    localStorage.setItem("medical_customers", JSON.stringify(customerList));
  }, [customerList]);

  //  Runs when you submit the Add/Edit form
  const handleSave = (formData: CustomerData, total: number, meds: string, qty: number) => {
    setCustomerList((prev) => {
      // Check if customer already exists by mobile number
      const existingIndex = prev.findIndex((c) => c.mobile === formData.mobile);
      
      // Create a new bill entry
      const newInvoice: PurchaseHistory = {
        id: `INV-${Date.now()}`,
        date: formData.date,
        medicines: meds,
        totalQty: qty,
        totalPrice: total,
        doctor: formData.doctor
      };

      if (existingIndex > -1) {
        //  add new bill to their history
        const updatedList = [...prev];
        const existingCust = updatedList[existingIndex];
        updatedList[existingIndex] = {
          ...existingCust,
          ...formData,
          medicines: meds,
          totalQty: qty,
          totalPrice: total,
          history: [newInvoice, ...(existingCust.history || [])] 
        };
        return updatedList;
      } else {
        // Create brand new customer
        const newCustomer: CustomerData = { 
          ...formData, 
          id: `CUST-${Date.now()}`, 
          medicines: meds,
          totalQty: qty,
          totalPrice: total,
          history: [newInvoice] 
        };
        return [...prev, newCustomer];
      }
    });
    
    setSelectedCustomer(null);
    setView("list");
  };

  // Loads a specific bill's data back into the form for editing
  const handleEditInvoice = (invoice: PurchaseHistory) => {
    if (!selectedCustomer) return;
    
    const editData: CustomerData = {
      ...selectedCustomer,
      doctor: invoice.doctor,
      date: invoice.date,
      totalPrice: invoice.totalPrice,
      totalQty: invoice.totalQty,
      medicines: invoice.medicines,
    };
    
    setSelectedCustomer(editData);
    setView("add"); // Open the form screen
  };

  //  Removes a customer entirely from the list
  const handleDeleteCustomer = (cust: CustomerData) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      setCustomerList((prev) => prev.filter((item) => item.mobile !== cust.mobile));
    }
  };

  //  Removes a single bill from a customer's history
  const handleDeleteInvoice = (invoice: PurchaseHistory) => {
    if (!selectedCustomer) return;
    
    if (window.confirm("Delete this bill from customer's history?")) {
      setCustomerList((prev) => {
        return prev.map((cust) => {
          if (cust.mobile === selectedCustomer.mobile) {
            const updatedHistory = cust.history?.filter((inv) => inv.id !== invoice.id) || [];
            // Refresh the current view screen data
            setSelectedCustomer({ ...cust, history: updatedHistory });
            return { ...cust, history: updatedHistory };
          }
          return cust;
        });
      });
    }
  };

  return (
    <>
      {/*  Shows the table of all customers */}
      {view === "list" && (
        <CustomerListPage 
          data={customerList} 
          onAdd={() => { setSelectedCustomer(null); setView("add"); }} 
          onView={(cust) => { setSelectedCustomer(cust); setView("view"); }} 
          onEdit={(cust) => { setSelectedCustomer(cust); setView("add"); }}
          onDelete={handleDeleteCustomer}
        />
      )}

      {/*  Shows the form to enter details */}
      {view === "add" && (
        <AddCustomerForm  onBack={() => setView("list")}  onSave={handleSave}  initialData={selectedCustomer}  />
      )}

      {/* Shows specific customer info and their bill history */}
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