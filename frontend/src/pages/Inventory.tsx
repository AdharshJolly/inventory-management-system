import React, { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import Skeleton from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import Input from "../components/ui/Input";
import SetAlertLevelModal from "../components/inventory/SetAlertLevelModal";
import {
  Search,
  Package,
  ChevronDown,
  ChevronUp,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  BellRing,
  Edit2,
} from "lucide-react";
import type { ProductStockBreakdown, StockLocationBreakdown } from "../types";

const Inventory: React.FC = () => {
  const [inventory, setInventory] = useState<ProductStockBreakdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<{
    stockId: string;
    productName: string;
    locationName: string;
    minLevel: number;
  } | null>(null);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await api.get("/transactions/stocks/breakdown");
      setInventory(res.data);
    } catch (err) {
      console.error("Failed to fetch inventory breakdown", err);
      toast.error("Failed to load inventory data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleEditAlert = (
    e: React.MouseEvent,
    item: ProductStockBreakdown,
    loc: StockLocationBreakdown,
  ) => {
    e.stopPropagation();
    setSelectedStock({
      stockId: loc.stockId,
      productName: item.name,
      locationName: loc.locationName,
      minLevel: loc.minLevel,
    });
    setIsModalOpen(true);
  };

  const filteredInventory = useMemo(() => {
    return inventory.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [inventory, searchTerm]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In Stock":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 ring-1 ring-emerald-100 dark:ring-emerald-800/30">
            <CheckCircle2 size={12} />
            In Stock
          </span>
        );
      case "Low Stock":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 ring-1 ring-amber-100 dark:ring-amber-800/30">
            <AlertTriangle size={12} />
            Low Stock
          </span>
        );
      case "Out of Stock":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 ring-1 ring-red-100 dark:ring-red-800/30">
            <XCircle size={12} />
            Out of Stock
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Inventory Breakdown
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Stock levels across all locations
          </p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl border border-gray-100/80 dark:border-gray-700/60 shadow-sm">
          Total Products:{" "}
          <span className="font-bold text-gray-900 dark:text-white">
            {inventory.length}
          </span>
        </div>
      </div>

      <div className="flex gap-3 items-center bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-2xl shadow-sm border border-gray-100/80 dark:border-gray-700/60">
        <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-400">
          <Search size={18} />
        </div>
        <Input
          placeholder="Search inventory by name or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-none focus:ring-0 shadow-none"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100/80 dark:border-gray-700/60 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : filteredInventory.length === 0 ? (
          <EmptyState
            title="No inventory data found"
            description={
              searchTerm
                ? "Try adjusting your search terms."
                : "Start by adding products and recording transactions."
            }
            icon={
              <Package size={48} className="text-gray-300 dark:text-gray-600" />
            }
          />
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-gray-50/80 dark:bg-gray-800/50 border-b border-gray-100/80 dark:border-gray-700/50">
                  <tr>
                    <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 w-10"></th>
                    <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Product
                    </th>
                    <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      SKU
                    </th>
                    <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Total Stock
                    </th>
                    <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/80 dark:divide-gray-700/50">
                  {filteredInventory.map((item) => (
                    <React.Fragment key={item._id}>
                      <tr
                        className={`hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer ${expandedRows[item._id] ? "bg-indigo-50/30 dark:bg-indigo-900/10" : ""}`}
                        onClick={() => toggleRow(item._id)}
                      >
                        <td className="px-6 py-3.5">
                          {expandedRows[item._id] ? (
                            <ChevronUp size={16} className="text-indigo-500" />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </td>
                        <td className="px-6 py-3.5 font-semibold text-gray-900 dark:text-white text-sm">
                          {item.name}
                        </td>
                        <td className="px-6 py-3.5 font-mono text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          {item.sku}
                        </td>
                        <td className="px-6 py-3.5 text-gray-900 dark:text-white font-bold text-sm">
                          {item.totalQuantity}
                        </td>
                        <td className="px-6 py-3.5">
                          {getStatusBadge(item.status)}
                        </td>
                      </tr>
                      {expandedRows[item._id] && (
                        <tr>
                          <td
                            colSpan={5}
                            className="bg-gray-50/50 dark:bg-gray-900/20 px-6 py-5"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {item.locations.map((loc, idx) => (
                                <div
                                  key={idx}
                                  className="flex flex-col p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100/80 dark:border-gray-700/50 shadow-sm hover-lift"
                                >
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                      <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
                                        <MapPin
                                          size={14}
                                          className="text-indigo-500"
                                        />
                                      </div>
                                      <span className="text-sm font-semibold">
                                        {loc.locationName}
                                      </span>
                                    </div>
                                    <span className="text-lg font-black text-gray-900 dark:text-white">
                                      {loc.quantity}
                                    </span>
                                  </div>

                                  <div className="flex items-center justify-between pt-3 border-t border-gray-100/60 dark:border-gray-700/40">
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                      <BellRing
                                        size={13}
                                        className={
                                          loc.quantity <= loc.minLevel
                                            ? "text-amber-500"
                                            : "text-gray-400"
                                        }
                                      />
                                      <span>
                                        Alert at:{" "}
                                        <span className="font-bold text-gray-700 dark:text-gray-300">
                                          {loc.minLevel}
                                        </span>
                                      </span>
                                    </div>
                                    <button
                                      onClick={(e) =>
                                        handleEditAlert(e, item, loc)
                                      }
                                      className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                                      title="Edit Alert Level"
                                    >
                                      <Edit2 size={13} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden divide-y divide-gray-100/80 dark:divide-gray-700/50">
              {filteredInventory.map((item) => (
                <div key={item._id} className="p-4">
                  <div
                    className="flex items-start justify-between cursor-pointer"
                    onClick={() => toggleRow(item._id)}
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 dark:text-white truncate">
                        {item.name}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                        {item.sku}
                      </p>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                          {item.totalQuantity}
                        </span>
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                    <div className="p-2 text-gray-400">
                      {expandedRows[item._id] ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </div>
                  </div>

                  {expandedRows[item._id] && (
                    <div className="mt-4 space-y-3 pt-4 border-t border-gray-100/60 dark:border-gray-700/40">
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest px-1">
                        Location Breakdown
                      </p>
                      <div className="grid grid-cols-1 gap-3">
                        {item.locations.map((loc, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col p-3 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100/80 dark:border-gray-700/50"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                <MapPin size={14} className="text-indigo-500" />
                                <span className="text-xs font-semibold">
                                  {loc.locationName}
                                </span>
                              </div>
                              <span className="text-base font-bold text-gray-900 dark:text-white">
                                {loc.quantity}
                              </span>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-gray-200/40 dark:border-gray-700/40">
                              <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
                                <BellRing
                                  size={12}
                                  className={
                                    loc.quantity <= loc.minLevel
                                      ? "text-amber-500"
                                      : "text-gray-400"
                                  }
                                />
                                <span>
                                  Alert Threshold:{" "}
                                  <span className="font-bold text-gray-700 dark:text-gray-300">
                                    {loc.minLevel}
                                  </span>
                                </span>
                              </div>
                              <button
                                onClick={(e) => handleEditAlert(e, item, loc)}
                                className="p-2 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl"
                                title="Edit Alert Level"
                              >
                                <Edit2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <SetAlertLevelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        stockId={selectedStock?.stockId || null}
        productName={selectedStock?.productName || ""}
        locationName={selectedStock?.locationName || ""}
        currentMinLevel={selectedStock?.minLevel || 0}
        onSuccess={fetchInventory}
      />
    </div>
  );
};

export default Inventory;
