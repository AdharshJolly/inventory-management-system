import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  History, 
  ArrowLeftRight 
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Suppliers', path: '/suppliers', icon: Users },
    { name: 'Transactions', path: '/transactions', icon: ArrowLeftRight },
    { name: 'History', path: '/history', icon: History },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 pt-20 transition-transform border-r border-gray-200 bg-white">
      <div className="h-full overflow-y-auto px-3 pb-4">
        <ul className="space-y-2 font-medium">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center rounded-lg p-2 transition-colors hover:bg-gray-100 ${
                    isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                  }`}
                >
                  <Icon size={20} className={isActive ? 'text-blue-600' : 'text-gray-500'} />
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
