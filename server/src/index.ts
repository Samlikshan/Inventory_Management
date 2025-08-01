import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { connectDB } from "./config/db";
dotenv.config();

import productRoutes from "./routes/productRoutes";
import stockRoutes from "./routes/stockRoutes";
import invoiceRoutes from "./routes/invoiceRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use("/api/products", productRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/invoice", invoiceRoutes);

app.use(errorHandler);
app.use(
  cors({
    origin: process.env.CLIENT_URL!,
  })
);

connectDB();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
