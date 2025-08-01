import React, { useState } from "react";
import { X } from "lucide-react";
import { type Product } from "../../api/product";
import { addStockOut } from "../../api/product";
import { toast } from "sonner";

interface StockOutModalProps {
  products: Product[];
  onAdded: () => void;
  onClose: () => void;
}

const StockOutModal: React.FC<StockOutModalProps> = ({
  products,
  onAdded,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    productId: "",
    quantity: 1,
    reason: "Sale",
    remarks: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addStockOut({
        productId: formData.productId,
        quantity: formData.quantity,
        reason: formData.reason,
        remarks: formData.remarks,
      });

      toast.success(`${formData.quantity} units removed successfully.`);
      onAdded();
      onClose();
    } catch (error: any) {
      console.error("Stock out error:", error);

      if (error.type === "validation" && error.errors) {
        const messages = Object.values(error.errors)
          .flat()
          .filter(Boolean)
          .join("\n");
        toast.error(messages || "Validation failed");
        return;
      }

      toast.error(error.message || "Failed to remove stock.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Remove Stock</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Product */}
          <div>
            <label
              htmlFor="productId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Product *
            </label>
            <select
              id="productId"
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-600"
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product.id} value={product.productId}>
                  {product.name} (Available: {product.currentStock}{" "}
                  {product.unit})
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Quantity *
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-600"
            />
          </div>

          {/* Reason */}
          <div>
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Reason *
            </label>
            <select
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-600"
            >
              <option value="Sale">Sale</option>
              <option value="Damage">Damage</option>
              <option value="Loss">Loss</option>
              <option value="Return">Return</option>
              <option value="Manual Adjustment">Manual Adjustment</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Remarks */}
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
              placeholder="Optional"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-600"
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 py-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-red-600 py-2 rounded-md text-white hover:bg-red-700"
            >
              Remove Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockOutModal;
