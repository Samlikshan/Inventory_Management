import React, { useState } from "react";
import {
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
  AlertTriangle,
} from "lucide-react";

export interface Product {
  _id: string;
  productId: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  price: number;
  minStock: number;
}

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
}

const PRODUCT_CATEGORIES = [
  "Electronics",
  "Clothing",
  "Books",
  "Home",
  "Beauty",
  "Toys",
];

const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit }) => {
  const [sortBy, setSortBy] = useState<keyof Product>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleSort = (field: keyof Product) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field: keyof Product) => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => toggleSort("name")}
              >
                <div className="flex items-center space-x-1">
                  <span>Product Id</span>
                  {getSortIcon("name")}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => toggleSort("name")}
              >
                <div className="flex items-center space-x-1">
                  <span>Product Name</span>
                  {getSortIcon("name")}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => toggleSort("category")}
              >
                <div className="flex items-center space-x-1">
                  <span>Category</span>
                  {getSortIcon("category")}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => toggleSort("currentStock")}
              >
                <div className="flex items-center space-x-1">
                  <span>Current Stock</span>
                  {getSortIcon("currentStock")}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => toggleSort("price")}
              >
                <div className="flex items-center space-x-1">
                  <span>Price</span>
                  {getSortIcon("price")}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
            {products.map((product: Product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {product.productId}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {product.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={product.category}
                    disabled
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-gray-300 cursor-not-allowed"
                    title={product.category}
                  >
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 mr-2">
                      {product.currentStock}
                    </span>
                    {product.currentStock <= 10 && (
                      <AlertTriangle
                        className="h-4 w-4 text-red-500"
                        title="Low stock"
                      />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.currentStock >= 10
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.currentStock >= 10 ? "In Stock" : "Low Stock"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                      title="Edit product"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => console.log("delete", product.productId)}
                      className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                      title="Delete product"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
