import mongoose from "mongoose";
import Product from "../models/Product";
import { StockLog } from "../models/StockLog";
import { generateStockInId } from "../utils/generateStockId";

export const stockInService = async ({
  productId,
  quantity,
  source,
  remarks,
}: {
  productId: string;
  quantity: number;
  source: string;
  remarks?: string;
}) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const product = await Product.findOne({ productId }).session(session);
    if (!product) throw new Error("Product not found");

    if (quantity <= 0) throw new Error("Quantity must be greater than 0");

    product.currentStock += quantity;
    await product.save({ session });

    const stockId = await generateStockInId();

    await StockLog.create(
      [
        {
          stockId,
          type: "IN",
          productId,
          quantity,
          source,
          remarks,
          createdBy: "system",
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      message: "Stock-in successful",
      stockId,
      product: {
        productId: product.productId,
        stock: product.currentStock,
      },
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
