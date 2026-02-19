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
  Boxes,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const mainMenuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Products", path: "/products", icon: Package },
    { name: "Inventory", path: "/inventory", icon: Boxes },
  ];

  const operationItems = [
    { name: "Transactions", path: "/transactions", icon: ArrowLeftRight },
    { name: "History", path: "/history", icon: History },
  ];

  const managementItems = [
    { name: "Suppliers", path: "/suppliers", icon: Users },
    { name: "Locations", path: "/locations", icon: MapPin },
  ];

  const renderMenuSection = (title: string, items: typeof mainMenuItems) => (
    <div className="space-y-1">
      <p className="px-3 pt-4 pb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500">
        {title}
      </p>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => {
              if (window.innerWidth < 640) onClose();
            }}
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "bg-gradient-to-r from-indigo-500/10 to-blue-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm shadow-indigo-500/5"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            <div
              className={`p-1 rounded-lg transition-all ${
                isActive
                  ? "bg-indigo-500/10 dark:bg-indigo-500/20"
                  : "group-hover:bg-gray-200/60 dark:group-hover:bg-gray-600/30"
              }`}
            >
              <Icon
                size={18}
                className={
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                }
              />
            </div>
            <span>{item.name}</span>
            {isActive && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />
            )}
          </Link>
        );
      })}
    </div>
  );

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen w-64 pt-[60px] transition-transform duration-300 ease-in-out border-r border-gray-200/60 dark:border-gray-700/60 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } sm:translate-x-0 sm:block max-sm:shadow-2xl`}
    >
      <div className="flex sm:hidden justify-end px-4 pt-2 mb-1">
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>
      <div className="h-full overflow-y-auto px-3 pb-4 pt-2">
        {renderMenuSection("Overview", mainMenuItems)}
        {renderMenuSection("Operations", operationItems)}
        {renderMenuSection("Management", managementItems)}

        {/* Bottom decoration */}
        <div className="mt-8 mx-2 p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-100/50 dark:border-indigo-800/30">
          <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-400">
            Quick Tip
          </p>
          <p className="text-[11px] text-indigo-600/70 dark:text-indigo-400/60 mt-1 leading-relaxed">
            Use the Transactions page for quick stock movements and updates.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
