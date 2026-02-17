import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar />
      <main className="p-4 sm:ml-64 pt-24">
        <div className="rounded-lg border-2 border-dashed border-gray-200 p-4 min-h-[calc(100vh-120px)]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
