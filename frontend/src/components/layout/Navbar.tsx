import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";
import { LogOut, User } from "lucide-react";
import NotificationCenter from "./NotificationCenter";
import ThemeToggle from "./ThemeToggle";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <Link to="/" className="flex ml-2 md:mr-24">
              <span className="self-center whitespace-nowrap text-xl font-bold text-blue-600 dark:text-blue-400 sm:text-2xl">
                InventoryMS
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <NotificationCenter />
            <ThemeToggle />

            <div className="h-8 w-px bg-gray-100 dark:bg-gray-700 mx-1 hidden sm:block"></div>

            <Link
              to="/profile"
              className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 ml-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <User size={18} className="text-gray-400 dark:text-gray-500" />
              <span className="hidden sm:inline font-medium">{user?.name}</span>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="gap-2"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
