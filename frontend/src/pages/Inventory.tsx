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
          <>
            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs uppercase text-gray-700 dark:text-gray-300">
                  <tr>
                    <th className="px-6 py-3 font-semibold w-10"></th>
                    <th className="px-6 py-3 font-semibold">Product</th>
                    <th className="px-6 py-3 font-semibold">SKU</th>
                    <th className="px-6 py-3 font-semibold">Total Stock</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                  {filteredInventory.map((item) => (
                    <React.Fragment key={item._id}>
                      <tr 
                        className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${expandedRows[item._id] ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                        onClick={() => toggleRow(item._id)}
                      >
                        <td className="px-6 py-4">
                          {expandedRows[item._id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs uppercase tracking-wider">
                          {item.sku}
                        </td>
                        <td className="px-6 py-4 text-gray-900 dark:text-white font-bold">
                          {item.totalQuantity}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(item.status)}
                        </td>
                      </tr>
                      {expandedRows[item._id] && (
                        <tr>
                          <td colSpan={5} className="bg-gray-50/50 dark:bg-gray-900/20 px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {item.locations.map((loc, idx) => (
                                <div 
                                  key={idx} 
                                  className="flex flex-col p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"
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
            <div className="sm:hidden divide-y divide-gray-100 dark:divide-gray-700">
              {filteredInventory.map((item) => (
                <div key={item._id} className="p-4 bg-white dark:bg-gray-800">
                  <div 
                    className="flex items-start justify-between cursor-pointer"
                    onClick={() => toggleRow(item._id)}
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 dark:text-white truncate">{item.name}</h3>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">{item.sku}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="text-lg font-black text-blue-600 dark:text-blue-400">{item.totalQuantity}</span>
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                    <div className="p-2 text-gray-400">
                      {expandedRows[item._id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>

                  {expandedRows[item._id] && (
                    <div className="mt-4 space-y-3 pt-4 border-t border-gray-50 dark:border-gray-700/50">
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest px-1">Location Breakdown</p>
                      <div className="grid grid-cols-1 gap-3">
                        {item.locations.map((loc, idx) => (
                          <div 
                            key={idx} 
                            className="flex flex-col p-3 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-700"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                <MapPin size={14} className="text-blue-500" />
                                <span className="text-xs font-semibold">{loc.locationName}</span>
                              </div>
                              <span className="text-base font-bold text-gray-900 dark:text-white">
                                {loc.quantity}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
                              <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
                                <BellRing size={12} className={loc.quantity <= loc.minLevel ? "text-amber-500" : "text-gray-400"} />
                                <span>Alert Threshold: <span className="font-bold text-gray-700 dark:text-gray-300">{loc.minLevel}</span></span>
                              </div>
                              <button 
                                onClick={(e) => handleEditAlert(e, item, loc)}
                                className="p-2 text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
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
