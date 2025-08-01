import React, { useEffect, useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { toast } from "sonner"; // ✅ Replaced useNotification with toast

import {
  fetchProducts,
  fetchStockInTransactions,
  type Product,
  type StockTransaction,
} from "../../api/product";

import StockInTable from "./StockInTable";
import StockInModal from "./StockInModal";

const StockIn: React.FC = () => {
  const [stockTransactions, setStockTransactions] = useState<
    StockTransaction[]
  >([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [productFilter, setProductFilter] = useState("");

  const loadProducts = async () => {
    try {
      const productsData = await fetchProducts();
      setProducts(productsData.products);
    } catch (error: any) {
      toast.error(error.message || "Failed to load products", {
        description: "Error loading products",
      });
    }
  };

  const loadStockTransactions = async () => {
    try {
      const transactions = await fetchStockInTransactions();
      setStockTransactions(transactions);
    } catch (error: any) {
      toast.error(error.message || "Failed to load stock transactions", {
        description: "Error loading stock transactions",
      });
    }
  };

  useEffect(() => {
    loadProducts();
    loadStockTransactions();
  }, []);

  const filteredTransactions = stockTransactions.filter((tx) => {
    const term = searchTerm.toLowerCase();
    return (
      (tx.source?.toLowerCase().includes(term) ?? false) &&
      (productFilter === "" || tx.productId === productFilter)
    );
  });

  const handleAdded = () => {
    loadStockTransactions();
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Stock In</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Stock In</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search by product or source..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-600"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400" />
            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-600"
              aria-label="Filter by product"
            >
              <option value="">All Products</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <StockInTable transactions={filteredTransactions} />

      {isModalOpen && (
        <StockInModal
          products={products}
          onAdded={handleAdded}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default StockIn;
