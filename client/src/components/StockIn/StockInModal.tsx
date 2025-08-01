import React, { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { type Product } from "../../api/product";
import { addStockIn } from "../../api/product";

interface StockInModalProps {
  products: Product[];
  onAdded: () => void;
  onClose: () => void;
}

const StockInModal: React.FC<StockInModalProps> = ({
  products,
  onAdded,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    productId: "",
    quantity: 1,
    source: "",
    remarks: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      await addStockIn({
        type: "IN",
        productId: formData.productId,
        quantity: formData.quantity,
        source: formData.source,
        remarks: formData.remarks,
      });

      toast.success("Added successfully.", {
        description: "Stock Added",
      });

      onAdded();
      onClose();
    } catch (error: any) {
      console.error("Error:", error);

      if (error?.type === "validation" && error?.errors) {
        if (typeof error.errors === "object" && !Array.isArray(error.errors)) {
          setErrors(error.errors);
        } else {
          toast.error("Invalid error format from server.");
        }
      } else {
        console.log(error);

        toast.error(error?.message || "Something went asdfadswrong");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Add Stock In</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Product select */}
          <div>
            <label
              htmlFor="productId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Product
            </label>
            <select
              id="productId"
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-600 focus:border-green-600"
            >
              <option value="">Select a product</option>
              {products.map((p) => (
                <option key={p.id} value={p.productId}>
                  {p.name}
                </option>
              ))}
            </select>
            {errors.productId && (
              <p className="text-sm text-red-600 mt-1">{errors.productId}</p>
            )}
          </div>

          {/* Quantity input */}
          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Quantity
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min={1}
              value={formData.quantity}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-600 focus:border-green-600"
            />
            {errors.quantity && (
              <p className="text-sm text-red-600 mt-1">{errors.quantity}</p>
            )}
          </div>

          {/* Source input */}
          <div>
            <label
              htmlFor="source"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Source
            </label>
            <input
              id="source"
              name="source"
              type="text"
              value={formData.source}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-600 focus:border-green-600"
            />
            {errors.source && (
              <p className="text-sm text-red-600 mt-1">{errors.source}</p>
            )}
          </div>

          {/* Remarks textarea */}
          <div>
            <label
              htmlFor="remarks"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Remarks
            </label>
            <textarea
              id="remarks"
              name="remarks"
              rows={3}
              value={formData.remarks}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-600 focus:border-green-600"
            />
            {errors.remarks && (
              <p className="text-sm text-red-600 mt-1">{errors.remarks}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 rounded-md py-2 text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-green-600 rounded-md py-2 text-white hover:bg-green-700 transition-colors"
            >
              Add Stock In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockInModal;
