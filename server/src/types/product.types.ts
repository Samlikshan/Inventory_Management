import { Document } from "mongoose";

export interface IProduct extends Document {
  productId: string;
  name: string;
  category: string;
  unit: string;
  initialStock: number;
  currentStock: number;
  price: number;
  isDeleted: boolean;
}
