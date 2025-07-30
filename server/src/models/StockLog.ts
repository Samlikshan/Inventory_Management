import mongoose from "mongoose";

const stockLogSchema = new mongoose.Schema({
  stockInId: { type: String, required: true, unique: true },
  type: { type: String, enum: ["IN", "OUT"], required: true },
  productId: { type: String, required: true },
  quantity: { type: Number, required: true },
  remarks: { type: String },
  source: { type: String, required: true },
  createdBy: { type: String, default: "system" },
  createdAt: { type: Date, default: Date.now },
});

export const StockLog = mongoose.model("StockLog", stockLogSchema);
