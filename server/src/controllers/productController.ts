import { Request, Response, NextFunction } from "express";
import Product from "../models/Product";
import { createProductSchema } from "../validation/product.schema";
import { generateProductId } from "../utils/generateProductId";
import { ZodError } from "zod";

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await Product.find({ isDeleted: { $ne: true } });

    res.status(200).json({
      message: "Products fetched successfully",
      products,
    });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.body);
    const parseResult = createProductSchema.safeParse(req.body);

    if (!parseResult.success) {
      // let ZodError bubble to the errorHandler
      throw parseResult.error;
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
    next(err);
  }
};
