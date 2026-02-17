import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Package, DollarSign, AlertTriangle } from 'lucide-react';
import Table from '../components/ui/Table';

interface DashboardStats {
  totalProducts: number;
  totalStockValue: number;
  lowStockAlerts: any[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        setStats(response.data);
        setError(null);
      } catch (err: any) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64 text-gray-500">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Inventory Overview</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase">Total Products</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.totalProducts}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase">Stock Value</p>
            <p className="text-2xl font-bold text-gray-900">${stats?.totalStockValue.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase">Low Stock Items</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.lowStockAlerts.length}</p>
          </div>
        </div>
      </div>

      {/* Low Stock Table */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <AlertTriangle size={20} className="text-amber-500" />
          Low Stock Alerts
        </h2>
        
        {stats?.lowStockAlerts.length === 0 ? (
          <p className="text-gray-500 text-sm">All products are within healthy levels.</p>
        ) : (
          <Table headers={['Product', 'SKU', 'Current Qty', 'Min Level']}>
            {stats?.lowStockAlerts.map((alert) => (
              <tr key={alert._id}>
                <td className="px-6 py-4 font-medium text-gray-900">{alert.product.name}</td>
                <td className="px-6 py-4">{alert.product.sku}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                    {alert.currentQuantity}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">{alert.minLevel}</td>
              </tr>
            ))}
          </Table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
