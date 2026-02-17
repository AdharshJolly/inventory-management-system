import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import { LogOut, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <span className="self-center whitespace-nowrap text-xl font-bold text-blue-600 sm:text-2xl">
              InventoryMS
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <User size={18} />
              <span className="hidden sm:inline font-medium">{user?.name}</span>
            </div>
            <Button variant="outline" size="sm" onClick={logout} className="gap-2">
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
