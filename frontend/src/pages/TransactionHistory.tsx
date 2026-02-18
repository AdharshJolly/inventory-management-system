import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Button from "../components/ui/Button";
import Skeleton from "../components/ui/Skeleton";
import Pagination from "../components/ui/Pagination";
import EmptyState from "../components/ui/EmptyState";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Calendar,
  ClipboardList,
  History,
  MapPin,
} from "lucide-react";

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Pagination state
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalDocs: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
  });

  // Sorting state
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc" | null;
  }>({
    key: "createdAt",
    direction: "desc",
  });

  const fetchTransactions = async (currentPage = page) => {
    setLoading(true);
    try {
      const response = await api.get(
        `/transactions?page=${currentPage}&limit=10`,
      );
      setTransactions(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(page);
  }, [page]);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedTransactions = useMemo(() => {
    if (sortConfig.direction) {
      return [...transactions].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return transactions;
  }, [transactions, sortConfig]);

  const SortIcon = ({ column }: { column: string }) => {
    if (sortConfig.key !== column)
      return <ArrowUpDown size={14} className="ml-1 opacity-50" />;
    return sortConfig.direction === "asc" ? (
      <ArrowUp size={14} className="ml-1 text-blue-600" />
    ) : (
      <ArrowDown size={14} className="ml-1 text-blue-600" />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Inventory Log
        </h1>
        <Button className="gap-2" onClick={() => navigate("/transactions")}>
          <ArrowUpDown size={18} />
          New Transaction
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : sortedTransactions.length === 0 ? (
          <EmptyState
            title="No history found"
            description="All stock movements will appear here once you record your first transaction."
            icon={
              <History size={48} className="text-gray-300 dark:text-gray-600" />
            }
            action={
              <Button
                onClick={() => navigate("/transactions")}
                variant="outline"
                className="gap-2"
              >
                <ArrowUpDown size={18} />
                Execute First Movement
              </Button>
            }
          />
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs uppercase text-gray-700 dark:text-gray-300">
                  <tr>
                    <th
                      className="px-6 py-3 font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center">
                        Date <SortIcon column="createdAt" />
                      </div>
                    </th>
                    <th className="px-6 py-3 font-semibold">Product</th>
                    <th className="px-6 py-3 font-semibold">Location</th>
                    <th
                      className="px-6 py-3 font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => handleSort("type")}
                    >
                      <div className="flex items-center">
                        Type <SortIcon column="type" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => handleSort("quantity")}
                    >
                      <div className="flex items-center">
                        Qty <SortIcon column="quantity" />
                      </div>
                    </th>
                    <th className="px-6 py-3 font-semibold">Notes</th>
                    <th className="px-6 py-3 font-semibold">User</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                  {sortedTransactions.map((t) => (
                    <tr
                      key={t._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400 text-xs">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          {new Date(t.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {t.product?.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                          {t.product?.sku}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded w-fit">
                          <MapPin size={12} className="text-gray-400" />
                          <span className="text-xs font-medium">
                            {t.location?.name || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            t.type === "IN"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {t.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-medium text-gray-900 dark:text-white">
                        {t.quantity}
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <ClipboardList size={14} className="flex-shrink-0" />
                          <span className="truncate">{t.notes}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">
                        {t.user?.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden divide-y divide-gray-100 dark:divide-gray-700">
              {sortedTransactions.map((t) => (
                <div key={t._id} className="p-4 bg-white dark:bg-gray-800">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white truncate max-w-[200px]">
                        {t.product?.name}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">{t.product?.sku}</p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        t.type === "IN"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {t.type}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4 mt-3 text-sm">
                    <div className="col-span-2 flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <MapPin size={14} className="text-blue-500" />
                      <span className="font-medium">{t.location?.name || "N/A"}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <Calendar size={14} />
                      <span className="text-xs">{new Date(t.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-end gap-1 font-bold text-gray-900 dark:text-white">
                      <span className="text-xs font-normal text-gray-400 uppercase mr-1">Qty</span>
                      {t.quantity}
                    </div>
                    
                    {t.notes && (
                      <div className="col-span-2 pt-2 border-t border-gray-50 dark:border-gray-700/50 flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <ClipboardList size={14} className="mt-0.5 shrink-0" />
                        <span className="line-clamp-2">{t.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={(newPage) => setPage(newPage)}
              loading={loading}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
