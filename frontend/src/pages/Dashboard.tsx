import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { Package, DollarSign, AlertTriangle } from "lucide-react";
import Table from "../components/ui/Table";
import Skeleton from "../components/ui/Skeleton";

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
        const response = await api.get("/dashboard/stats");
        setStats(response.data);
        setError(null);
      } catch (err: any) {
        setError("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        Inventory Overview
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Products */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
            <Package size={24} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">
              Total Products
            </p>
            {loading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.totalProducts}
              </p>
            )}
          </div>
        </div>

        {/* Stock Value */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
          <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
            <DollarSign size={24} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">
              Stock Value
            </p>
            {loading ? (
              <Skeleton className="h-8 w-24 mt-1" />
            ) : (
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${stats?.totalStockValue.toFixed(2)}
              </p>
            )}
          </div>
        </div>

        {/* Low Stock Items */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
            <AlertTriangle size={24} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">
              Low Stock Items
            </p>
            {loading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.lowStockAlerts.length}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Low Stock Table */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <AlertTriangle size={20} className="text-amber-500" />
          Low Stock Alerts
        </h2>

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : stats?.lowStockAlerts.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            All products are within healthy levels.
          </p>
        ) : (
          <Table headers={["Product", "SKU", "Current Qty", "Min Level"]}>
            {stats?.lowStockAlerts.map((alert) => (
              <tr key={alert._id}>
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {alert.product.name}
                </td>
                <td className="px-6 py-4">{alert.product.sku}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full bg-red-50 dark:bg-red-900/30 px-2 py-1 text-xs font-medium text-red-700 dark:text-red-400">
                    {alert.currentQuantity}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                  {alert.minLevel}
                </td>
              </tr>
            ))}
          </Table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
