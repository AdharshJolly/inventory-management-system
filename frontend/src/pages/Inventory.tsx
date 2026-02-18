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
  Edit2
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
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleEditAlert = (e: React.MouseEvent, item: ProductStockBreakdown, loc: StockLocationBreakdown) => {
    e.stopPropagation();
    setSelectedStock({
      stockId: loc.stockId,
      productName: item.name,
      locationName: loc.locationName,
      minLevel: loc.minLevel
    });
    setIsModalOpen(true);
  };

  const filteredInventory = useMemo(() => {
    return inventory.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [inventory, searchTerm]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In Stock":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle2 size={12} />
            In Stock
          </span>
        );
      case "Low Stock":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
            <AlertTriangle size={12} />
            Low Stock
          </span>
        );
      case "Out of Stock":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Inventory Breakdown
        </h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-3 py-1 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
          Total Products: <span className="font-bold text-gray-900 dark:text-white">{inventory.length}</span>
        </div>
      </div>

      <div className="flex gap-4 items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <Search className="text-gray-400" size={20} />
        <Input
          placeholder="Search inventory by name or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-none focus:ring-0"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : filteredInventory.length === 0 ? (
          <EmptyState
            title="No inventory data found"
            description={searchTerm ? "Try adjusting your search terms." : "Start by adding products and recording transactions."}
            icon={<Package size={48} className="text-gray-300" />}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 min-w-[450px] sm:min-w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs uppercase text-gray-700 dark:text-gray-300">
                <tr>
                  <th className="px-3 sm:px-6 py-3 font-semibold w-8"></th>
                  <th className="px-3 sm:px-6 py-3 font-semibold">Product</th>
                  <th className="px-4 sm:px-6 py-3 font-semibold hidden sm:table-cell">SKU</th>
                  <th className="px-3 sm:px-6 py-3 font-semibold">Stock</th>
                  <th className="px-3 sm:px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                {filteredInventory.map((item) => (
                  <React.Fragment key={item._id}>
                    <tr 
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${expandedRows[item._id] ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                      onClick={() => toggleRow(item._id)}
                    >
                      <td className="px-3 sm:px-6 py-4">
                        {expandedRows[item._id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </td>
                      <td className="px-3 sm:px-6 py-4 font-medium text-gray-900 dark:text-white">
                        <div className="flex flex-col">
                          <span className="truncate max-w-[100px] sm:max-w-none">{item.name}</span>
                          <span className="sm:hidden text-[10px] text-gray-400 font-mono mt-0.5">{item.sku}</span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 font-mono text-xs uppercase tracking-wider hidden sm:table-cell">
                        {item.sku}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-gray-900 dark:text-white font-bold">
                        {item.totalQuantity}
                      </td>
                      <td className="px-3 sm:px-6 py-4">
                        {getStatusBadge(item.status)}
                      </td>
                    </tr>
                    {expandedRows[item._id] && (
                      <tr>
                        <td colSpan={5} className="bg-gray-50/50 dark:bg-gray-900/20 px-2 sm:px-6 py-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            {item.locations.map((loc, idx) => (
                              <div 
                                key={idx} 
                                className="flex flex-col p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                    <MapPin size={16} className="text-blue-500" />
                                    <span className="text-sm font-semibold">{loc.locationName}</span>
                                  </div>
                                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                                    {loc.quantity}
                                  </span>
                                </div>
                                
                                <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-700/50">
                                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                    <BellRing size={14} className={loc.quantity <= loc.minLevel ? "text-amber-500" : "text-gray-400"} />
                                    <span>Alert at: <span className="font-bold text-gray-700 dark:text-gray-300">{loc.minLevel}</span></span>
                                  </div>
                                  <button 
                                    onClick={(e) => handleEditAlert(e, item, loc)}
                                    className="p-2 sm:p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                                    title="Edit Alert Level"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                            {item.locations.length === 0 && (
                              <div className="col-span-full py-2 text-center text-sm text-gray-400 italic">
                                No stock records found for any location.
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
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
