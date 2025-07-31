import mongoose, { Schema } from "mongoose";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_UNITS,
} from "../constants/product.constants";

import { IProduct } from "../types/product.types";

const ProductSchema: Schema = new Schema(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: PRODUCT_CATEGORIES,
      required: true,
    },
    unit: {
      type: String,
      enum: PRODUCT_UNITS,
      required: true,
    },
    initialStock: {
      type: Number,
      required: true,
    },
    currentStock: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", ProductSchema);
