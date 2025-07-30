import { Request, Response } from "express";
import Product from "../models/Product";
import { createProductSchema } from "../validation/product.schema";
import { generateProductId } from "../utils/generateProductId";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const parseResult = createProductSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.flatten() });
    }

    const { name, category, unit, initialStock, price } = req.body;
    const productId = await generateProductId(category);

    const product = new Product({
      productId,
      name,
      category,
      unit,
      initialStock,
      currentStock: initialStock,
      price,
    });

    const saved = await product.save();
    return res.status(201).json(saved);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
};
