import { StockLog } from "../models/StockLog";

export const generateStockInId = async (): Promise<string> => {
  const count = await StockLog.countDocuments();
  const nextNumber = count + 1;
  const padded = String(nextNumber).padStart(3, "0");
  return `STKIN-${padded}`;
};

export const generateStockOutId = async (): Promise<string> => {
  const count = await StockLog.countDocuments();
  const nextNumber = count + 1;
  const padded = String(nextNumber).padStart(3, "0");
  return `STKOUT-${padded}`;
};
