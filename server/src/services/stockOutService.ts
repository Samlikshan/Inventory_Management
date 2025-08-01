import mongoose from "mongoose";
import Product from "../models/Product";
import { StockLog } from "../models/StockLog";
import { generateStockOutId } from "../utils/generateStockId";

export const stockOutService = async ({
  productId,
  quantity,
  reason,
  remarks,
}: {
  productId: string;
  quantity: number;
  reason: string;
  remarks?: string;
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const product = await Product.findOne({ productId }).session(session);

    if (!product) {
      throw { status: 400, message: "Product not found" };
    }

    if (product.currentStock < quantity) {
      throw { status: 400, message: "Insufficient stock" };
    }

    product.currentStock -= quantity;
    await product.save({ session });

    const stockId = await generateStockOutId();

    await StockLog.create(
      [
        {
          stockId,
          productId,
          quantity,
          type: "OUT",
          reason,
          remarks,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    return {
      message: "Stock-out successful",
      stockId,
      product: {
        productId: product.productId,
        stock: product.currentStock,
      },
    };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
