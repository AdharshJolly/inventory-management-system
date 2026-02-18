import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  MapPin,
  History,
  ArrowLeftRight,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Products", path: "/products", icon: Package },
    { name: "Suppliers", path: "/suppliers", icon: Users },
    { name: "Locations", path: "/locations", icon: MapPin },
    { name: "Inventory", path: "/inventory", icon: Package },
    { name: "Transactions", path: "/transactions", icon: ArrowLeftRight },
    { name: "History", path: "/history", icon: History },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen w-64 pt-20 transition-transform duration-300 ease-in-out border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } sm:translate-x-0 sm:block max-sm:shadow-xl`}
    >
      <div className="flex sm:hidden justify-end px-4 mb-2">
        <button
          onClick={onClose}
          className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>
      <div className="h-full overflow-y-auto px-3 pb-4">
        <ul className="space-y-2 font-medium">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 640) onClose();
                  }}
                  className={`flex items-center rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      : "text-gray-900 dark:text-gray-200"
                  }`}
                >
                  <Icon
                    size={20}
                    className={
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                    }
                  />
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
