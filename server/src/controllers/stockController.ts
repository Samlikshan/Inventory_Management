import { Request, Response } from "express";
import { stockInService } from "../services/stockService";
import { StockIn, stockInSchema } from "../validation/stock.schema";
import { ZodError } from "zod";
import { formatZodError } from "../utils/formatZodError";

export const handleStockIn = async (req: Request, res: Response) => {
  try {
    const validatedData: StockIn = stockInSchema.parse(req.body);

    const result = await stockInService(validatedData);
    res.status(200).json(result);
  } catch (error: any) {
    if (error instanceof ZodError) {
      const formatted = formatZodError(error);
      return res.status(422).json({ errors: formatted });
    }
    res.status(400).json({ error: error.message });
  }
};
