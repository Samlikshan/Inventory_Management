import React, { useEffect, useState } from "react";
import { Plus, Search, Filter } from "lucide-react";

import InvoiceTable from "./InvoiceTable";
import InvoiceModal from "./InvoiceModal";
import { cancelInvoice, getInvoices } from "../../api/invoices";
import ConfirmModal from "../UI/ConfirmationModal";
import { toast } from "sonner";

const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [pendingCancelId, setPendingCancelId] = useState<string | null>(null);

  const loadInvoices = async () => {
    try {
      const response = await getInvoices();
      setInvoices(response.invoices);
    } catch (error: any) {
      toast.error(error?.message || "Failed to load invoices");
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const requestCancelInvoice = (id: string) => {
    console.log("triggering");
    setPendingCancelId(id);
    setCancelConfirmOpen(true);
  };

  const handleConfirmCancel = async () => {
    console.log("a;lsdkfj ");
    if (!pendingCancelId) return;

    try {
      setInvoices((prev) =>
        prev.map((inv) =>
          inv._id === pendingCancelId ? { ...inv, status: "canceled" } : inv
        )
      );

      await cancelInvoice(pendingCancelId);

      toast.success("Invoice canceled successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to cancel invoice");

      loadInvoices();
    } finally {
      setCancelConfirmOpen(false);
      setPendingCancelId(null);
    }
  };

  const filteredInvoices = invoices
    ?.filter(
      (invoice) =>
        invoice.customer.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        invoice.customer.contact
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        invoice.invoiceId.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((invoice) => !statusFilter || invoice.status === statusFilter);

  const addInvoice = (data) => {
    setInvoices((prev) => [...prev, data]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Create Invoice</span>
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
                placeholder="Search by customer, email, or invoice ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoice Table */}
      <InvoiceTable
        invoices={filteredInvoices}
        onCancelInvoice={requestCancelInvoice}
      />

      {/* Invoice Modal */}
      {isModalOpen && (
        <InvoiceModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={(data) => addInvoice(data)}
        />
      )}

      {/* Confirm Modal */}

      {cancelConfirmOpen && (
        <ConfirmModal
          title="Cancel this invoice?"
          description="This action cannot be undone."
          onCancel={() => setCancelConfirmOpen(false)}
          onConfirm={handleConfirmCancel}
        />
      )}
    </div>
  );
};

export default Invoices;
