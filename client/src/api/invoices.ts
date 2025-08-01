import { axiosInstance } from "./axiosInstance";
import type { Product } from "./product";

export interface Invoices {
  invoiceId: string;
  products: Product[];
  total: number;
  status: "pending" | "paid" | "canceled";
  _id: string;
  customer: {
    name: string;
    contact: string;
  };
  createdAt: string;
}

export const getInvoices = async (): Promise<{
  messages: string;
  invoices: Invoices;
}> => {
  const response = await axiosInstance.get<{
    messages: string;
    invoices: Invoices;
  }>("/invoice");
  return response.data;
};

export const createInvoice = async (invoiceData: {
  customer: { name: string; contact: string };
  products: Product[];w
  total: number;
  status: string;
}): Promise<Invoices> => {
  const response = await axiosInstance.post<Invoices>("/invoice", invoiceData);
  return response.data;
};

export const cancelInvoice = async (invoiceId: string) => {
  const response = await axiosInstance.delete(`/invoice/${invoiceId}`);
  return response.data;
};
