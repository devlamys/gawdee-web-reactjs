/* Developed by Grafizen International PVT. LTD. */
export interface InvoiceItem {
  id: string;
  name: string;
  sku: string;
  qty: number;
  price: number;
}

export interface Invoice {
  id: string;
  orderId: string;
  date: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: string;
  paymentStatus: 'Completed' | 'Pending' | 'Failed' | 'Refunded';
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}