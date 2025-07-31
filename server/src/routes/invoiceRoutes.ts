import { Router } from "express";
import { cancelInvoice, createInvoice } from "../controllers/invoiceController";

const router = Router();

router.post("/", createInvoice);
router.delete("/:id", cancelInvoice);
export default router;
