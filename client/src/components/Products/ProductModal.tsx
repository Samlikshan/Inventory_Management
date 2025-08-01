import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Product } from "./ProductTable";

const PRODUCT_CATEGORIES = [
  "Electronics",
  "Clothing",
  "Books",
  "Home",
  "Beauty",
  "Toys",
];

interface ProductModalProps {
  product: Product | null;
  onSave: (
    product: Omit<Product, "id" | "createdAt" | "minStock" | "currentStock"> & {
      initialStock: number;
    }
  ) => Promise<void>;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    category: PRODUCT_CATEGORIES[0],
    unit: "pcs",
    initialStock: 0,
    price: 0,
  });

  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        unit: product.unit,
        initialStock: product.initialStock, // ✅ this line is updated
        price: product.price,
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    try {
      await onSave(formData);
    } catch (error: any) {
      if (error?.type === "validation" && error?.errors) {
        setErrors(error.errors);
        return;
      } else {
        alert(error.message || "Something went wrong.");
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter product name"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {PRODUCT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-sm text-red-600 mt-1">{errors.category[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit *
            </label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="pcs">Pieces</option>
              <option value="kg">Kilograms</option>
              <option value="lbs">Pounds</option>
              <option value="ltr">Liters</option>
              <option value="box">Box</option>
              <option value="pack">Pack</option>
            </select>
            {errors.unit && (
              <p className="text-sm text-red-600 mt-1">{errors.unit[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Initial Stock *
            </label>
            <input
              type="number"
              name="initialStock"
              value={formData.initialStock}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.initialStock && (
              <p className="text-sm text-red-600 mt-1">
                {errors.initialStock[0]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
            />
            {errors.price && (
              <p className="text-sm text-red-600 mt-1">{errors.price[0]}</p>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {product ? "Update" : "Add"} Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
