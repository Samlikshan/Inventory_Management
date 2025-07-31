import { Request, Response } from "express";
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

export const createInvoice = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();

  try {
    const parseResult = createInvoiceSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.flatten() });
    }

    const { customer, products } = parseResult.data;

    await session.startTransaction();

    const productIds = products.map((p) => p.productId);

    const productDocs = await Product.find({
      productId: { $in: productIds },
      isDeleted: { $ne: true },
    }).session(session);

    const productMap = new Map(productDocs.map((pd) => [pd.productId, pd]));

    for (const p of products) {
      if (!productMap.has(p.productId)) {
        await session.abortTransaction();
        return res
          .status(404)
          .json({ error: `Product not found: ${p.productId}` });
      }
    }

    for (const p of products) {
      const prod = productMap.get(p.productId)!;
      if (p.quantity > prod.currentStock) {
        await session.abortTransaction();
        return res.status(400).json({
          error: `Insufficient stock for product ${prod.name} (ID: ${prod.productId})`,
        });
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
      status: "paid",
    });

    const savedInvoice = await invoice.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json(savedInvoice);
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    console.error("Invoice creation error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message || err });
  }
};

export const cancelInvoice = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  try {
    const invoiceId = req.params.id;

    if (!invoiceId) {
      return res.status(400).json({ error: "Invoice id is required" });
    }

    await session.startTransaction();

    const invoice = await Invoice.findOne({
      invoiceId,
      status: { $ne: "canceled" },
    }).session(session);
    if (!invoice) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ error: "Invoice not found or already canceled" });
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
        await session.abortTransaction();
        return res.status(404).json({
          error: `Product not found for productId: ${item.productId}`,
        });
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

    return res
      .status(200)
      .json({ message: `Invoice ${invoiceId} canceled successfully` });
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    console.error("Invoice cancellation error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message || err });
  }
};
