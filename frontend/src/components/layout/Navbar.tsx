import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";
import { LogOut, Menu, Package } from "lucide-react";
import NotificationCenter from "./NotificationCenter";
import ThemeToggle from "./ThemeToggle";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-gray-200/60 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/95 backdrop-blur-xl shadow-sm shadow-gray-200/30 dark:shadow-gray-900/30">
      <div className="px-3 py-2.5 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <button
              onClick={onMenuClick}
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-xl sm:hidden hover:bg-gray-100/80 dark:hover:bg-gray-700/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:text-gray-400 mr-2 transition-all"
              aria-label="Toggle sidebar"
            >
              <Menu size={22} />
            </button>
            <Link
              to="/"
              className="flex items-center gap-2.5 ml-1 md:mr-24 group"
            >
              <div className="p-1.5 rounded-xl gradient-primary shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/30 transition-shadow">
                <Package size={20} className="text-white" />
              </div>
              <span className="self-center whitespace-nowrap text-lg font-extrabold sm:text-xl tracking-tight">
                <span className="gradient-text">Inventory</span>
                <span className="text-gray-800 dark:text-gray-200">MS</span>
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-1.5 md:gap-3">
            <NotificationCenter />
            <ThemeToggle />

            <div className="h-7 w-px bg-gray-200 dark:bg-gray-700 mx-0.5 hidden sm:block"></div>

            <Link
              to="/profile"
              className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300 ml-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-sm group-hover:shadow-md transition-shadow">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <span className="hidden sm:inline font-medium">{user?.name}</span>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="gap-2 ml-1 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:text-red-400 dark:hover:border-red-800"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
