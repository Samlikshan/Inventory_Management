import { z } from "zod";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_UNITS,
} from "../constants/product.constants";

export const createProductSchema = z.object({
  name: z
    .string({
      required_error: "Product name is required",
      invalid_type_error: "Product name must be a string",
    })
    .min(1, "Product name is required"),

  category: z.enum(PRODUCT_CATEGORIES, {
    required_error: "Please select a category",
    invalid_type_error: "Please select a valid category from the list.",
  }),

  unit: z.enum(PRODUCT_UNITS, {
    required_error: "Please select a unit",
    invalid_type_error: "Please select a valid unit from the list.",
  }),

  initialStock: z
    .number({
      required_error: "Initial stock is required",
      invalid_type_error: "Initial stock must be a number",
    })
    .nonnegative("Initial stock must be zero or more"),

  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .nonnegative("Price must be zero or more"),
});
