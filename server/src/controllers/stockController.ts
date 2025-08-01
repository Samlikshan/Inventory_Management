import { Request, Response, NextFunction } from "express";
import { stockInService } from "../services/stockInService";
import {
  StockIn,
  stockInSchema,
  StockOut,
  stockOutSchema,
} from "../validation/stock.schema";
import { stockOutService } from "../services/stockOutService";
import { StockLog } from "../models/StockLog";
import { ZodError } from "zod";

export const handleStockIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData: StockIn = stockInSchema.parse(req.body);
    console.log(req.body);
    const result = await stockInService(validatedData);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const handleStockOut = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData: StockOut = stockOutSchema.parse(req.body);
    const result = await stockOutService(validatedData);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getStockInTransactions = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stockIns = await StockLog.find({ type: "IN" }).sort({
      createdAt: -1,
    });
    res.status(200).json(stockIns);
  } catch (error) {
    next(error);
  }
};

export const getStockOutTransactions = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stockOuts = await StockLog.find({ type: "OUT" }).sort({
      createdAt: -1,
    });
    res.status(200).json(stockOuts);
  } catch (error) {
    next(error);
  }
};
