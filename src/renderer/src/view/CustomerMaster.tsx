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
import {
  getAllRetailInvoices,
  getRetailInvoiceItemsByInvoiceId,
  RetailInvoiceResponse,
} from "@/service/retailInvoiceService";
import { getMedicines, MedicineResponse } from "@/service/medicineService";

import {
  Invoice,
  InvoiceStatus,
  MedicineItem,
} from "@/types/invoice";

export interface PurchaseHistory {
  id: string;
  medicines: string;
  totalQty: number;
  totalPrice: number;
  doctor: string;
  date: string;
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

type InvoiceWithItems = Invoice & {
  retailInvoiceId?: number;
  customerName?: string;
  totalAmount?: number;
  medicines?: MedicineItem[];
};

const CustomerMaster = () => {
  const [view, setView] = useState<"list" | "add" | "view">("list");

  const [customerList, setCustomerList] = useState<CustomerData[]>([]);

  const [invoices, setInvoices] = useState<InvoiceWithItems[]>([]);

  const [medicines, setMedicines] = useState<MedicineResponse[]>([]);

  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerData | null>(null);

  const fetchMedicines = async (): Promise<void> => {
    try {
      const data = await getMedicines();

      setMedicines(data);
    } catch (error) {
      console.error("Failed to fetch medicines", error);
    }
  };

  const fetchInvoices = async (): Promise<void> => {
    try {
      const invoiceData: RetailInvoiceResponse[] =
        await getAllRetailInvoices();

      const invoicesWithItems: InvoiceWithItems[] = await Promise.all(
        invoiceData.map(
          async (
            inv: RetailInvoiceResponse
          ): Promise<InvoiceWithItems> => {
            try {
              const items: MedicineItem[] =
                await getRetailInvoiceItemsByInvoiceId(
                  inv.retailInvoiceId ?? 0
                );

              return {
                srNo: 0,

                invoice: String(inv.retailInvoiceId ?? ""),

                retailInvoiceId: inv.retailInvoiceId,

                customerName: inv.customerName,

                patient: inv.customerName ?? "",

                invoiceDate: inv.invoiceDate,

                paymentStatus: inv.paymentStatus,

                status: inv.paymentStatus as InvoiceStatus,

                totalAmount: inv.totalAmount,

                price: inv.totalAmount ?? 0,

                medicines: items,
              };
            } catch (error) {
              console.error(
                `Failed to fetch items for invoice ${inv.retailInvoiceId}`,
                error
              );

              return {
                srNo: 0,

                invoice: String(inv.retailInvoiceId ?? ""),

                retailInvoiceId: inv.retailInvoiceId,

                customerName: inv.customerName,

                patient: inv.customerName ?? "",

                invoiceDate: inv.invoiceDate,

                paymentStatus: inv.paymentStatus,

                status: inv.paymentStatus as InvoiceStatus,

                totalAmount: inv.totalAmount,

                price: inv.totalAmount ?? 0,

                medicines: [],
              };
            }
          }
        )
      );

      setInvoices(invoicesWithItems);
    } catch (error) {
      console.error("Failed to fetch invoices", error);
    }
  };

  const fetchCustomers = async (): Promise<void> => {
    try {
      const data = await getAllCustomers();

      setCustomerList(data);
    } catch (error) {
      console.error("Failed to fetch customers", error);
    }
  };

  useEffect(() => {
    fetchCustomers();

    fetchInvoices();

    fetchMedicines();
  }, []);

  const handleSave = async (): Promise<void> => {
    await fetchCustomers();

    setView("list");
  };


  const handleEditInvoice = (invoice: PurchaseHistory): void => {
    if (!selectedCustomer) return;

    const editData: CustomerData = {
      ...selectedCustomer,

      doctor: invoice.doctor,

      date: invoice.date,
    };

    setSelectedCustomer(editData);

    setView("add");
  };

  const handleDeleteCustomer = async (
    cust: CustomerData
  ): Promise<void> => {
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

  const customerDataWithHistory: CustomerData[] = customerList.map(
    (customer, index) => {
      const customerInvoices = invoices.filter(
        (inv) =>
          String(inv.customerName ?? "").toLowerCase().trim() ===
          String(customer.name ?? "").toLowerCase().trim()
      );

      return {
        ...customer,

        srNo: index + 1,

        history: customerInvoices.map((inv) => ({
          id: String(inv.retailInvoiceId ?? inv.invoice ?? ""),

          medicines:
            inv.medicines
              ?.map((med) => {
                const found = medicines.find(
                  (m) =>
                    String(m.medicineId) ===
                    String(med.medicineId)
                );

                return (
                  found?.medicineName ??
                  `${med.companyName ?? ""} ${
                    med.strength ?? ""
                  }`.trim()
                );
              })
              .join(", ") ?? "",

          totalQty:
            inv.medicines?.reduce(
              (
                sum: number,
                med: MedicineItem
              ): number =>
                sum +
                Number(med.quantity ?? med.qty ?? 0),
              0
            ) ?? 0,

          totalPrice: inv.totalAmount ?? inv.price ?? 0,

          doctor: customer.doctor ?? "",

          date: inv.invoiceDate
            ? new Date(inv.invoiceDate).toLocaleDateString(
                "en-IN"
              )
            : "",
        })),
      };
    }
  );

  const handleDeleteInvoice = async (
    invoice: PurchaseHistory
  ): Promise<void> => {
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

            const updatedCust = {
              ...cust,

              history: updatedHistory,
            };

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
          data={customerDataWithHistory}
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