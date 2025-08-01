import React from "react";
import {
  LayoutDashboard,
  Package,
  TrendingUp,
  TrendingDown,
  FileText,
  Menu,
  X,
} from "lucide-react";
import clsx from "clsx";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "stock-in", label: "Stock In", icon: TrendingUp },
  { id: "stock-out", label: "Stock Out", icon: TrendingDown },
  { id: "invoices", label: "Invoices", icon: FileText },
];

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
}) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={clsx(
          "fixed left-0 top-0 h-full bg-white shadow-lg z-30 transition-all duration-300",
          isOpen ? "w-64" : "w-16"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div
            className={clsx(
              "flex items-center space-x-3",
              !isOpen && "justify-center"
            )}
          >
            <Package className="h-8 w-8 text-blue-600" />
            {isOpen && (
              <h1 className="text-xl font-bold text-gray-800">Inventory</h1>
            )}
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <nav className="mt-8" role="navigation" aria-label="Main Navigation">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={clsx(
                  "w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800",
                  !isOpen && "justify-center px-0"
                )}
                title={!isOpen ? item.label : undefined}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {isOpen && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
