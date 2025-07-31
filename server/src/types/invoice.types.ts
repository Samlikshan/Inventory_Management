import mongoose, { Schema, Document, Types } from "mongoose";

export interface IInvoiceProduct {
  productRef: Types.ObjectId;
  productId: string;
  quantity: number;
  price: number;
}

export interface IInvoice extends Document {
  invoiceId: string;
  customer: {
    name: string;
    contact?: string;
  };
  products: IInvoiceProduct[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
}
