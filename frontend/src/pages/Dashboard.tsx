import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  Package,
  IndianRupee,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Boxes,
  MapPin,
} from "lucide-react";
import Table from "../components/ui/Table";
import Skeleton from "../components/ui/Skeleton";
import Button from "../components/ui/Button";

interface DashboardStats {
  totalProducts: number;
  totalStockValue: number;
  lowStockAlerts: any[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
      <div className="p-5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl border border-red-200/60 dark:border-red-800/40 flex items-center gap-3">
        <AlertTriangle size={20} />
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Your inventory at a glance
          </p>
        </div>
        <Button
          className="gap-2 hidden sm:flex"
          onClick={() => navigate("/transactions")}
        >
          <TrendingUp size={16} />
          New Transaction
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 stagger-children">
        {/* Total Products */}
        <div className="group relative overflow-hidden bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100/80 dark:border-gray-700/60 hover-lift">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/5 to-blue-500/5 dark:from-indigo-400/5 dark:to-blue-400/5 rounded-full -translate-y-10 translate-x-10" />
          <div className="relative flex items-start justify-between">
            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider">
                Total Products
              </p>
              {loading ? (
                <Skeleton className="h-9 w-20" />
              ) : (
                <p className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                  {stats?.totalProducts}
                </p>
              )}
            </div>
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl shadow-lg shadow-indigo-500/20 text-white">
              <Package size={22} />
            </div>
          </div>
          <button
            onClick={() => navigate("/products")}
            className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer"
          >
            View all products <ArrowRight size={13} />
          </button>
        </div>

        {/* Stock Value */}
        <div className="group relative overflow-hidden bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100/80 dark:border-gray-700/60 hover-lift">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/5 to-green-500/5 dark:from-emerald-400/5 dark:to-green-400/5 rounded-full -translate-y-10 translate-x-10" />
          <div className="relative flex items-start justify-between">
            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider">
                Stock Value
              </p>
              {loading ? (
                <Skeleton className="h-9 w-28" />
              ) : (
                <p className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                  ₹
                  {stats?.totalStockValue.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              )}
            </div>
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl shadow-lg shadow-emerald-500/20 text-white">
              <IndianRupee size={22} />
            </div>
          </div>
          <button
            onClick={() => navigate("/inventory")}
            className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors cursor-pointer"
          >
            View inventory <ArrowRight size={13} />
          </button>
        </div>

        {/* Low Stock Items */}
        <div className="group relative overflow-hidden bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100/80 dark:border-gray-700/60 hover-lift">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/5 to-orange-500/5 dark:from-amber-400/5 dark:to-orange-400/5 rounded-full -translate-y-10 translate-x-10" />
          <div className="relative flex items-start justify-between">
            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider">
                Low Stock Alerts
              </p>
              {loading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <p
                  className={`text-3xl sm:text-4xl font-black tracking-tight ${
                    (stats?.lowStockAlerts.length ?? 0) > 0
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {stats?.lowStockAlerts.length}
                </p>
              )}
            </div>
            <div
              className={`p-3 rounded-xl shadow-lg text-white ${
                (stats?.lowStockAlerts.length ?? 0) > 0
                  ? "bg-gradient-to-br from-amber-500 to-orange-500 shadow-amber-500/20"
                  : "bg-gradient-to-br from-gray-400 to-gray-500 shadow-gray-400/20"
              }`}
            >
              <AlertTriangle size={22} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-gray-400">
            {(stats?.lowStockAlerts.length ?? 0) > 0
              ? "Needs attention"
              : "All levels healthy"}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => navigate("/products")}
          className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100/80 dark:border-gray-700/60 hover:border-indigo-200 dark:hover:border-indigo-700 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-all group cursor-pointer"
        >
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/60 transition-colors">
            <Package size={18} />
          </div>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Products
          </span>
        </button>
        <button
          onClick={() => navigate("/inventory")}
          className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100/80 dark:border-gray-700/60 hover:border-emerald-200 dark:hover:border-emerald-700 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 transition-all group cursor-pointer"
        >
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/60 transition-colors">
            <Boxes size={18} />
          </div>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Inventory
          </span>
        </button>
        <button
          onClick={() => navigate("/suppliers")}
          className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100/80 dark:border-gray-700/60 hover:border-violet-200 dark:hover:border-violet-700 hover:bg-violet-50/50 dark:hover:bg-violet-900/20 transition-all group cursor-pointer"
        >
          <div className="p-2 rounded-xl bg-violet-50 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 group-hover:bg-violet-100 dark:group-hover:bg-violet-900/60 transition-colors">
            <TrendingUp size={18} />
          </div>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Suppliers
          </span>
        </button>
        <button
          onClick={() => navigate("/locations")}
          className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100/80 dark:border-gray-700/60 hover:border-blue-200 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all group cursor-pointer"
        >
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/60 transition-colors">
            <MapPin size={18} />
          </div>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Locations
          </span>
        </button>
      </div>

      {/* Low Stock Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100/80 dark:border-gray-700/60 overflow-hidden">
        <div className="p-5 sm:p-6 pb-0 sm:pb-0">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-xl ${(stats?.lowStockAlerts?.length ?? 0) > 0 ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" : "bg-gray-50 dark:bg-gray-700/50 text-gray-400"}`}
              >
                <AlertTriangle size={18} />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Low Stock Alerts
                </h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  Items below minimum threshold
                </p>
              </div>
            </div>
            {(stats?.lowStockAlerts?.length ?? 0) > 0 && (
              <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                {stats?.lowStockAlerts.length} items
              </span>
            )}
          </div>
        </div>

        {loading ? (
          <div className="p-5 sm:p-6 pt-0 sm:pt-0 space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : stats?.lowStockAlerts.length === 0 ? (
          <div className="px-5 sm:px-6 pb-8 text-center">
            <div className="py-8">
              <div className="mx-auto w-14 h-14 mb-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                All products are within healthy stock levels
              </p>
            </div>
          </div>
        ) : (
          <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0 sm:pt-0">
            <Table headers={["Product", "SKU", "Current Qty", "Min Level"]}>
              {stats?.lowStockAlerts.map((alert) => (
                <tr
                  key={alert._id}
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  <td className="px-6 py-3.5 font-semibold text-gray-900 dark:text-white text-sm">
                    {alert.product.name}
                  </td>
                  <td className="px-6 py-3.5 font-mono text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {alert.product.sku}
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="inline-flex items-center rounded-lg bg-red-50 dark:bg-red-900/20 px-2.5 py-1 text-xs font-bold text-red-600 dark:text-red-400 ring-1 ring-red-100 dark:ring-red-800/30">
                      {alert.currentQuantity}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {alert.minLevel}
                  </td>
                </tr>
              ))}
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
