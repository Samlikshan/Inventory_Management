import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDB } from "./config/db";
dotenv.config();

import productRoutes from "./routes/productRoutes";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/products", productRoutes);

connectDB();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
