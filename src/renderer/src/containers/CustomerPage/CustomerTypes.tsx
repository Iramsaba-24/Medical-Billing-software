
/* Medicines Section types*/
export type CustomerItem = {
  medicine: string;
  quantity: number;
};

/* Customer types */
export type Customer = {
  id: string;
  name: string;
  mobile: string;
  age: number;
  email: string;
  referenceFrom: string;
  address: string;
  date: string;
  items: CustomerItem[];
  total: number;
};

/* Customer Form submit data types */
export type CustomerFormData = Omit<Customer, "id" | "total" | "date">;

/* Filter types */
export type FilterForm = {
  search: string;
  filterDate: string;
};

/* Medicine Rates*/
export const medicineRates: Record<string, number> = {
  Paracetamol: 2,
  Crocin: 3,
  Azithromycin: 10,
  Dolo: 5,
};

/* Helper functions */
export const getPrice = (medicine?: string) =>
  medicine ? medicineRates[medicine] || 0 : 0;

export const getAmount = (medicine?: string, qty = 0) =>
  getPrice(medicine) * qty;

/* Empty Form / Default Values */
export const EMPTY_FORM: CustomerFormData = {
  name: "",
  mobile: "",
  age: 0,
  email:'',
  referenceFrom: "",
  address: "",
  items: [{ medicine: "", quantity: 1 }],
};
