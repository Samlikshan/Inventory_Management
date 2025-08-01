import React, { useEffect, useState } from "react";
import { X, Minus } from "lucide-react";
import { toast } from "sonner";
import { fetchProducts } from "../../api/product";
import { createInvoice } from "../../api/invoices";
import { generateInvoicePDF } from "../../util/generatePdf";

interface Product {
  _id: string;
  productId: string;
  name: string;
  price: number;
  currentStock: number;
}

interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  _id: string;
}

interface InvoiceModalProps {
  onClose: () => void;
  onSuccess: (newInvoice: any) => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ onClose, onSuccess }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [customerData, setCustomerData] = useState({
    customerName: "",
    customerContact: "",
  });
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [newItem, setNewItem] = useState({ productId: "", quantity: 1 });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const taxRate = 0.1;
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetchProducts();
        setProducts(response.products);
      } catch (error: any) {
        toast.error("Failed to load products.");
      }
    };
    getProducts();
  }, []);

  const handleAddItem = () => {
    const product = products.find((p) => p._id === newItem.productId);
    if (!product) {
      toast.error("Please select a valid product.");
      return;
    }

    const existingIndex = items.findIndex(
      (i) => i.productId === product.productId
    );

    if (existingIndex >= 0) {
      const updatedItems = [...items];
      const updatedQty =
        updatedItems[existingIndex].quantity + newItem.quantity;

      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: updatedQty,
        total: updatedQty * product.price,
      };
      setItems(updatedItems);
    } else {
      setItems((prev) => [
        ...prev,
        {
          _id: product._id,
          productId: product.productId,
          productName: product.name,
          quantity: newItem.quantity,
          unitPrice: product.price,
          total: product.price * newItem.quantity,
        },
      ]);
    }

    setNewItem({ productId: "", quantity: 1 });
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      customer: {
        name: customerData.customerName.trim(),
        contact: customerData.customerContact.trim(),
      },
      products: items.map((i) => ({
        productRef: i._id,
        productId: i.productId,
        quantity: i.quantity,
        price: i.unitPrice,
      })),
      total,
      status: "paid",
    };

    setErrors({});

    try {
      const res = await createInvoice(payload);
      generateInvoicePDF(res);
      toast.success("Invoice created successfully.");
      onSuccess(res);
      onClose();
    } catch (err: any) {
      if (err?.type === "validation" && err.errors) {
        const newErrors: { [key: string]: string } = {};

        if (err.errors.customer?.length) {
          newErrors["customerName"] = err.errors.customer[0];
        }

        if (err.errors.products?.length) {
          newErrors["products"] = err.errors.products[0];
        }

        setErrors(newErrors);
      } else {
        toast.error(
          err?.message || "Something went wrong while creating the invoice."
        );
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Create New Invoice
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label>Customer Name</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded-lg"
              value={customerData.customerName}
              onChange={(e) =>
                setCustomerData((prev) => ({
                  ...prev,
                  customerName: e.target.value,
                }))
              }
            />
            {errors.customerName && (
              <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
            )}
          </div>
          <div className="mb-6">
            <label>Customer Contact</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded-lg"
              value={customerData.customerContact}
              onChange={(e) =>
                setCustomerData((prev) => ({
                  ...prev,
                  customerContact: e.target.value,
                }))
              }
            />
          </div>
          <div className="mb-6">
            <label>Product</label>
            <select
              value={newItem.productId}
              onChange={(e) =>
                setNewItem((prev) => ({ ...prev, productId: e.target.value }))
              }
              className="w-full border px-3 py-2 rounded-lg"
            >
              <option value="">Select Product</option>
              {products?.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} (${p.price}) - Stock: {p.currentStock}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={newItem.quantity}
              min="1"
              onChange={(e) =>
                setNewItem((prev) => ({
                  ...prev,
                  quantity: Math.max(1, parseInt(e.target.value) || 1),
                }))
              }
              className="w-full mt-2 border px-3 py-2 rounded-lg"
            />
            <button
              type="button"
              onClick={handleAddItem}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add Item
            </button>
            {errors.products && (
              <p className="text-red-500 text-sm mt-2">{errors.products}</p>
            )}
          </div>

          {items.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold">Invoice Items</h3>
              <ul className="space-y-2">
                {items.map((item, i) => (
                  <li key={i} className="flex justify-between">
                    <span>
                      {item.productName} x {item.quantity}
                    </span>
                    <div>
                      ${item.total.toFixed(2)}
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(i)}
                        className="ml-3 text-red-500"
                      >
                        <Minus className="h-4 w-4 inline" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 border-t pt-2">
                <p>Subtotal: ${subtotal.toFixed(2)}</p>
                <p>Tax: ${tax.toFixed(2)}</p>
                <p className="font-bold">Total: ${total.toFixed(2)}</p>
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg"
            >
              Create Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceModal;
