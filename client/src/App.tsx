import { useState } from "react";
import clsx from "clsx";

import Sidebar from "./components/Layout/Sidebar";
// import Dashboard from "./components/Dashboard/Dashboard";
import Products from "./components/Products/Products";
import StockIn from "./components/StockIn/StockIn";
import StockOut from "./components/StockOut/StockOut";
import Invoices from "./components/Invoices/Invoices";

import { Toaster } from "sonner";

// Map tab keys to components
const TAB_COMPONENTS = {
  // dashboard: Dashboard,
  products: Products,
  "stock-in": StockIn,
  "stock-out": StockOut,
  invoices: Invoices,
  // settings: Settings,
};

function App() {
  const [activeTab, setActiveTab] = useState("product");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Get the component for the active tab or fallback to Dashboard
  const ActiveComponent = TAB_COMPONENTS[activeTab] || Products;

  // Utility to toggle sidebar margin for main content area
  const mainContainerClass = clsx(
    "flex-1 flex flex-col overflow-hidden transition-all duration-300 bg-gray-50",
    sidebarOpen ? "ml-64" : "ml-16"
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Toaster richColors position="top-right" />
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <div className={mainContainerClass}>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <ActiveComponent />
        </main>
      </div>
    </div>
  );
}

export default App;
