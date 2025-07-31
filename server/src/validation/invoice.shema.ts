import { z } from "zod";

export const createInvoiceSchema = z.object({
  customer: z.object({
    name: z.string().min(1, "Customer name is required"),
    contact: z.string().optional(),
  }),
  products: z
    .array(
      z.object({
        productId: z.string().min(1, "Product ID is required"),
        quantity: z
          .number()
          .int()
          .positive("Quantity must be a positive integer"),
        price: z.number().nonnegative("Price must be zero or more"),
      })
    )
    .min(1, "At least one product is required"),
});
