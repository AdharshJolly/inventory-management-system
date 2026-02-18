import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar onMenuClick={toggleSidebar} />
      
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm sm:hidden animate-in fade-in duration-300"
          onClick={closeSidebar}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      
      <main className="p-4 sm:ml-64 pt-24 min-h-screen transition-all duration-300 ease-in-out">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent p-3 sm:p-6 min-h-[calc(100vh-120px)]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
