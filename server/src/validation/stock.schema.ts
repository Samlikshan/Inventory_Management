import { z } from "zod";

export const stockInSchema = z.object({
  type: z.enum(["IN", "OUT"], {
    required_error: "Type is required",
    invalid_type_error: "Type must be 'IN' or 'OUT'",
  }),

  productId: z
    .string({
      required_error: "Product ID is required",
      invalid_type_error: "Product ID must be a string",
    })
    .min(1, "Product ID is required"),

  quantity: z
    .number({
      required_error: "Quantity is required",
      invalid_type_error: "Quantity must be a number",
    })
    .positive("Quantity must be a positive number"),

  remarks: z.string().optional(),

  source: z
    .string({
      required_error: "Source is required",
      invalid_type_error: "Source must be a string",
    })
    .min(1, "Source is required"),

  createdBy: z.string().optional(),
});

export type StockIn = z.infer<typeof stockInSchema>;

export const stockOutSchema = z.object({
  productId: z
    .string({
      required_error: "Please select a product",
      invalid_type_error: "Product ID must be a string",
    })
    .min(1, "Product ID is required"),

  quantity: z
    .number({
      required_error: "Quantity is required",
      invalid_type_error: "Quantity must be a number",
    })
    .positive("Quantity must be a positive number"),

  remarks: z.string().optional(),

  reason: z
    .string({
      required_error: "Reason is required",
      invalid_type_error: "Reason must be a string",
    })
    .min(1, "Source is required"),

  createdBy: z.string().optional(),
});

export type StockOut = z.infer<typeof stockOutSchema>;
