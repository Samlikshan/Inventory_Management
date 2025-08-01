import React, { useState, useEffect } from "react";
import { Minus, Search, Filter } from "lucide-react";
import { toast } from "sonner";

import {
  fetchProducts,
  fetchStockOutTransactions,
  type Product,
  type StockTransaction,
} from "../../api/product";

import StockOutTable from "./StockOutTable";
import StockOutModal from "./StockOutModal";

const StockOut: React.FC = () => {
  const [stockTransactions, setStockTransactions] = useState<
    StockTransaction[]
  >([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [productFilter, setProductFilter] = useState("");

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data.products);
    } catch (error: any) {
      toast.error(error.message || "Failed to load products");
    }
  };

  const loadStockOutTransactions = async () => {
    try {
      const data = await fetchStockOutTransactions();
      setStockTransactions(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load stock out transactions");
    }
  };

  useEffect(() => {
    loadProducts();
    loadStockOutTransactions();
  }, []);

  const handleAdded = () => {
    loadStockOutTransactions();
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Stock Out</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Minus className="h-5 w-5" />
          <span>Add Stock Out</span>
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search by product or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-600"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400" />
            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-600"
              aria-label="Filter by product"
            >
              <option value="">All Products</option>
              {products?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <StockOutTable transactions={stockTransactions} />

      {isModalOpen && (
        <StockOutModal
          products={products}
          onAdded={handleAdded}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default StockOut;
