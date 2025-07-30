import Product from "../models/Product";
import categoryPrefixes from "../constants/productId.constants";

export const generateProductId = async (category: string): Promise<string> => {
  const prefix = categoryPrefixes[category] || "GEN";
  const count = await Product.countDocuments({
    productId: { $regex: `^${prefix}-` },
  });

  const nextNumber = String(count + 1).padStart(3, "0");
  return `${prefix}-${nextNumber}`;
};
