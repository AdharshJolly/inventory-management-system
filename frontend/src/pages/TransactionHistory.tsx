import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Button from "../components/ui/Button";
import Skeleton from "../components/ui/Skeleton";
import Pagination from "../components/ui/Pagination";
import EmptyState from "../components/ui/EmptyState";
import Input from "../components/ui/Input"; // Added Input import
import {
  // Added Search import
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Calendar,
  ClipboardList,
  History,
  MapPin,
  Search,
} from "lucide-react";

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // Added searchTerm state
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
    const filtered = transactions.filter(
      (t) =>
        t.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.product?.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.location?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.notes?.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    if (sortConfig.direction) {
      return [...filtered].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [transactions, searchTerm, sortConfig]);

  const SortIcon = ({ column }: { column: string }) => {
    if (sortConfig.key !== column)
      return <ArrowUpDown size={13} className="ml-1 opacity-40" />;
    return sortConfig.direction === "asc" ? (
      <ArrowUp
        size={13}
        className="ml-1 text-indigo-600 dark:text-indigo-400"
      />
    ) : (
      <ArrowDown
        size={13}
        className="ml-1 text-indigo-600 dark:text-indigo-400"
      />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Inventory Log
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track all stock movements
          </p>
        </div>
        <Button
          className="gap-2 hidden sm:flex"
          onClick={() => navigate("/transactions")}
        >
          <ArrowUpDown size={16} />
          New Transaction
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-2xl shadow-sm border border-gray-100/80 dark:border-gray-700/60">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-400">
            <Search size={18} />
          </div>
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-none focus:ring-0 shadow-none"
          />
        </div>
        <Button
          className="gap-2 w-full sm:w-auto sm:hidden"
          onClick={() => navigate("/transactions")}
        >
          <ArrowUpDown size={16} />
          New Transaction
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100/80 dark:border-gray-700/60 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
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
                <thead className="bg-gray-50/80 dark:bg-gray-800/50 border-b border-gray-100/80 dark:border-gray-700/50">
                  <tr>
                    <th
                      className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 cursor-pointer hover:bg-gray-100/60 dark:hover:bg-gray-700/40 transition-colors"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center">
                        Date <SortIcon column="createdAt" />
                      </div>
                    </th>
                    <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Product
                    </th>
                    <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Location
                    </th>
                    <th
                      className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 cursor-pointer hover:bg-gray-100/60 dark:hover:bg-gray-700/40 transition-colors"
                      onClick={() => handleSort("type")}
                    >
                      <div className="flex items-center">
                        Type <SortIcon column="type" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 cursor-pointer hover:bg-gray-100/60 dark:hover:bg-gray-700/40 transition-colors"
                      onClick={() => handleSort("quantity")}
                    >
                      <div className="flex items-center">
                        Qty <SortIcon column="quantity" />
                      </div>
                    </th>
                    <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Notes
                    </th>
                    <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      User
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/80 dark:divide-gray-700/50">
                  {sortedTransactions.map((t) => (
                    <tr
                      key={t._id}
                      className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="px-6 py-3.5 whitespace-nowrap text-gray-500 dark:text-gray-400 text-xs">
                        <div className="flex items-center gap-2">
                          <Calendar size={13} />
                          {new Date(t.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="font-semibold text-gray-900 dark:text-white text-sm">
                          {t.product?.name}
                        </div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400 font-mono uppercase tracking-wider mt-0.5">
                          {t.product?.sku}
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/40 px-2.5 py-1 rounded-lg w-fit">
                          <MapPin size={12} className="text-indigo-400" />
                          <span className="text-xs font-medium">
                            {t.location?.name || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ring-1 ${
                            t.type === "IN"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 ring-emerald-100 dark:ring-emerald-800/30"
                              : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 ring-red-100 dark:ring-red-800/30"
                          }`}
                        >
                          {t.type}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 font-mono font-bold text-gray-900 dark:text-white text-sm">
                        {t.quantity}
                      </td>
                      <td className="px-6 py-3.5 max-w-xs truncate text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2 text-xs">
                          <ClipboardList size={13} className="flex-shrink-0" />
                          <span className="truncate">{t.notes}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-gray-500 dark:text-gray-400 text-xs font-medium">
                        {t.user?.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden divide-y divide-gray-100/80 dark:divide-gray-700/50">
              {sortedTransactions.map((t) => (
                <div key={t._id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate max-w-[200px]">
                        {t.product?.name}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5 uppercase tracking-wider">
                        {t.product?.sku}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ring-1 ${
                        t.type === "IN"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 ring-emerald-100 dark:ring-emerald-800/30"
                          : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 ring-red-100 dark:ring-red-800/30"
                      }`}
                    >
                      {t.type}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-y-3 gap-x-4 mt-3 text-sm">
                    <div className="col-span-2 flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <MapPin size={14} className="text-indigo-500" />
                      <span className="font-medium">
                        {t.location?.name || "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <Calendar size={13} />
                      <span className="text-xs">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-1 font-bold text-gray-900 dark:text-white">
                      <span className="text-xs font-normal text-gray-400 uppercase mr-1">
                        Qty
                      </span>
                      {t.quantity}
                    </div>

                    {t.notes && (
                      <div className="col-span-2 pt-2 border-t border-gray-100/60 dark:border-gray-700/40 flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
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
