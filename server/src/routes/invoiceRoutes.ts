import { Router } from "express";
import {
  cancelInvoice,
  createInvoice,
  getInvoices,
} from "../controllers/invoiceController";

const router = Router();
router.get("/", getInvoices);
router.post("/", createInvoice);
router.delete("/:id", cancelInvoice);
export default router;
