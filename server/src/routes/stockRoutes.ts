import { Router } from "express";
import {
  getStockInTransactions,
  getStockOutTransactions,
  handleStockIn,
  handleStockOut,
} from "../controllers/stockController";

const router = Router();

router.get("/in", getStockInTransactions);
router.post("/in", handleStockIn);
router.get("/out", getStockOutTransactions);
router.post("/out", handleStockOut);
export default router;
