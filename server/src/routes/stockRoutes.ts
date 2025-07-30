import { Router } from "express";
import { handleStockIn } from "../controllers/stockController";

const router = Router();

router.post("/in", handleStockIn);
export default router;
