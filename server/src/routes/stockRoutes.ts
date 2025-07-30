import { Router } from "express";
import { handleStockIn, handleStockOut } from "../controllers/stockController";

const router = Router();

router.post("/in", handleStockIn);
router.post('/out',handleStockOut)
export default router;
