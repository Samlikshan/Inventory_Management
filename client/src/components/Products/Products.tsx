import React, { useState, useEffect } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { toast } from "sonner";
import ProductTable from "../../components/Products/ProductTable";
import ProductModal from "../../components/Products/ProductModal";
import {
  createProduct as apiAddProduct,
  fetchProducts,
  type Product,
} from "../../api/product";

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState<keyof Product>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data.products);
    } catch (error: any) {
      toast.error(error.message || "Failed to load products");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);
  const handleSaveProduct = async (
    productData: Omit<Product, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const createdProduct = await apiAddProduct(productData);
      console.log(createdProduct, "a;lsdkfal;dj");
      setProducts((prev) => [createdProduct, ...prev]);
      toast.success(`${productData.name} has been added to inventory.`);
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (error: any) {
      if (error?.type === "validation" && error?.errors) {
        console.log(error, "abcd");
        throw error;
      }

      toast.error(error.message || "Failed to save product");
      setIsModalOpen(false);
      setEditingProduct(null);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    console.log("delete", productId);
  };

  const handleSort = (field: keyof Product) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const categories = [...new Set(products.map((p) => p.category))];

  const filteredProducts = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) => !categoryFilter || product.category === categoryFilter)
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <ProductTable
        products={filteredProducts}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
        onSort={handleSort}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />

      {/* Product Modal */}
      {isModalOpen && (
        <ProductModal
          product={editingProduct}
          onSave={handleSaveProduct}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default Products;
