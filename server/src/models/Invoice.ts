import mongoose, { Schema, Document } from "mongoose";
import { IInvoice, IInvoiceProduct } from "../types/invoice.types";

const InvoiceProductSchema = new Schema<IInvoiceProduct>(
  {
    productRef: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    productId: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const InvoiceSchema = new Schema<IInvoice>(
  {
    invoiceId: { type: String, required: true, unique: true },
    customer: {
      name: { type: String, required: true },
      contact: { type: String, required: false },
    },
    products: {
      type: [InvoiceProductSchema],
      required: true,
      validate: {
        validator: (arr: IInvoiceProduct[]) => arr.length > 0,
        message: "Invoice must have at least one product",
      },
    },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "paid", "canceled", "refunded"],
      default: "pending",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IInvoice>("Invoice", InvoiceSchema);
