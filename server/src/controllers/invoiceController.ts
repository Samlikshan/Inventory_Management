import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Product from "../models/Product";
import Invoice from "../models/Invoice";
import { StockLog } from "../models/StockLog";

import {
  generateStockInId,
  generateStockOutId,
} from "../utils/generateStockId";
import { createInvoiceSchema } from "../validation/invoice.shema";
import { generateInvoiceId } from "../utils/generateInvoiceId";
import { ZodError } from "zod";

export const createInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.body);
  const session = await mongoose.startSession();
  await session.startTransaction();

  try {
    const parseResult = createInvoiceSchema.safeParse(req.body);
    console.log();
    if (!parseResult.success) {
      throw parseResult.error;
    }
    const { customer, products } = parseResult.data;
    // const { customer, products } = parseResult;

    const productIds = products.map((p) => p.productId);
    const productDocs = await Product.find({
      productId: { $in: productIds },
      isDeleted: { $ne: true },
    }).session(session);

    const productMap = new Map(productDocs.map((pd) => [pd.productId, pd]));

    for (const p of products) {
      const product = productMap.get(p.productId);
      if (!product) {
        throw { status: 404, message: `Product not found: ${p.productId}` };
      }

      if (p.quantity > product.currentStock) {
        throw {
          status: 400,
          message: `Insufficient stock for product ${product.name} (ID: ${product.productId})`,
        };
      }
    }

    const invoiceProducts = products.map((p) => {
      const prodDoc = productMap.get(p.productId)!;
      return {
        productId: p.productId,
        productRef: prodDoc._id,
        quantity: p.quantity,
        price: prodDoc.price,
      };
    });

    for (const p of products) {
      const prod = productMap.get(p.productId)!;
      prod.currentStock -= p.quantity;
      await prod.save({ session });

      const stockId = await generateStockOutId();
      await StockLog.create(
        [
          {
            stockId,
            type: "OUT",
            productId: p.productId,
            quantity: p.quantity,
            reason: "Sale via invoice",
            createdBy: "system",
          },
        ],
        { session }
      );
    }

    const total = products.reduce((acc, p) => acc + p.price * p.quantity, 0);
    const invoiceId = await generateInvoiceId();

    const invoice = new Invoice({
      invoiceId,
      customer,
      products: invoiceProducts,
      total,
      status: "pending",
    });

    const savedInvoice = await invoice.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json(savedInvoice);
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

export const cancelInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession();
  await session.startTransaction();

  try {
    const invoiceId = req.params.id;
    if (!invoiceId) throw { status: 400, message: "Invoice ID is required" };

    const invoice = await Invoice.findOne({
      _id: invoiceId,
      status: { $ne: "canceled" },
    }).session(session);

    if (!invoice) {
      throw {
        status: 404,
        message: "Invoice not found or already canceled",
      };
    }

    const productIds = invoice.products.map((p) => p.productId);
    const productDocs = await Product.find({
      productId: { $in: productIds },
      isDeleted: { $ne: true },
    }).session(session);

    const productMap = new Map(productDocs.map((pd) => [pd.productId, pd]));

    for (const item of invoice.products) {
      const prod = productMap.get(item.productId);
      if (!prod) {
        throw {
          status: 404,
          message: `Product not found for productId: ${item.productId}`,
        };
      }

      prod.currentStock += item.quantity;
      await prod.save({ session });

      const stockInId = await generateStockInId();
      await StockLog.create(
        [
          {
            stockId: stockInId,
            type: "IN",
            productId: item.productId,
            quantity: item.quantity,
            source: "Invoice cancellation",
            remarks: `Restored stock from canceled invoice ${invoiceId}`,
            createdBy: "system",
          },
        ],
        { session }
      );
    }

    invoice.status = "canceled";
    await invoice.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: `Invoice ${invoiceId} canceled successfully`,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

export const getInvoices = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res
      .status(200)
      .json({ message: "Invoices fetched successfully", invoices });
  } catch (error) {
    next(error);
  }
};
