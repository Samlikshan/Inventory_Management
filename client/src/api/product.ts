import { axiosInstance } from "./axiosInstance";

interface ProductInput {
  name: string;
  category: string;
  unit: string;
  initialStock: number;
  price: number;
}

export interface Product {
  productId: string;
  id: string;
  name: string;
  category: string;
  unit: string;
  initialStock: number;
  currentStock: number;
  minStock: number;
  price: number;
  createdAt: string;
}

export interface StockTransaction {
  id: string;
  stockId: string;
  productId: string;
  name: string;
  quantity: number;
  source?: string;
  remarks?: string;
  createdAt: string;
}

// Fetch products with sorting
export const fetchProducts = async (): Promise<{
  message: string;
  products: Product[];
}> => {
  const response = await axiosInstance.get<{
    message: string;
    products: Product[];
  }>("/products");
  return response.data;
};

// Create new product
export const createProduct = async (
  productData: ProductInput
): Promise<Product> => {
  const response = await axiosInstance.post<Product>("/products", productData);
  return response.data;
};

export const fetchStockInTransactions = async (): Promise<
  StockTransaction[]
> => {
  const response = await axiosInstance.get<StockTransaction[]>("/stock/in");
  return response.data;
};
export const fetchStockOutTransactions = async (): Promise<
  StockTransaction[]
> => {
  const response = await axiosInstance.get<StockTransaction[]>("/stock/out");
  return response.data;
};

export const addStockIn = async (stockData: {
  productId: string;
  type: "IN";
  quantity: number;
  remarks: string;
  source: string;
}) => {
  const response = await axiosInstance.post<StockTransaction[]>(
    "/stock/in",
    stockData
  );
  return response.data;
};

export const addStockOut = async (stockData: {
  productId: string;
  quantity: number;
  remarks: string;
  reason: string;
}) => {
  const response = await axiosInstance.post<StockTransaction[]>(
    "/stock/out",
    stockData
  );
  return response.data;
};
