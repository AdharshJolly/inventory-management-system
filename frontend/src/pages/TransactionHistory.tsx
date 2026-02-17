import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
import { ArrowUpDown, ArrowUp, ArrowDown, Calendar, ClipboardList, History, MapPin } from 'lucide-react';

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
    limit: 10
  });

  // Sorting state
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null }>({
    key: 'createdAt',
    direction: 'desc',
  });

  const fetchTransactions = async (currentPage = page) => {
    setLoading(true);
    try {
      const response = await api.get(`/transactions?page=${currentPage}&limit=10`);
      setTransactions(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error('Failed to fetch transactions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(page);
  }, [page]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedTransactions = useMemo(() => {
    if (sortConfig.direction) {
      return [...transactions].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return transactions;
  }, [transactions, sortConfig]);

  const SortIcon = ({ column }: { column: string }) => {
    if (sortConfig.key !== column) return <ArrowUpDown size={14} className="ml-1 opacity-50" />;
    return sortConfig.direction === 'asc' ? 
      <ArrowUp size={14} className="ml-1 text-blue-600" /> : 
      <ArrowDown size={14} className="ml-1 text-blue-600" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Inventory Log</h1>
        <Button className="gap-2" onClick={() => navigate('/transactions')}>
          <ArrowUpDown size={18} />
          New Transaction
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
            icon={<History size={48} className="text-gray-300" />}
            action={
              <Button onClick={() => navigate('/transactions')} variant="outline" className="gap-2">
                <ArrowUpDown size={18} />
                Execute First Movement
              </Button>
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                  <tr>
                    <th className="px-6 py-3 font-semibold cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('createdAt')}>
                      <div className="flex items-center">Date <SortIcon column="createdAt" /></div>
                    </th>
                    <th className="px-6 py-3 font-semibold">Product</th>
                    <th className="px-6 py-3 font-semibold">Location</th>
                    <th className="px-6 py-3 font-semibold cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('type')}>
                      <div className="flex items-center">Type <SortIcon column="type" /></div>
                    </th>
                    <th className="px-6 py-3 font-semibold cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('quantity')}>
                      <div className="flex items-center">Qty <SortIcon column="quantity" /></div>
                    </th>
                    <th className="px-6 py-3 font-semibold">Notes</th>
                    <th className="px-6 py-3 font-semibold">User</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {sortedTransactions.map((t) => (
                    <tr key={t._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-xs">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          {new Date(t.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{t.product?.name}</div>
                        <div className="text-xs text-gray-500 font-mono">{t.product?.sku}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-gray-700 bg-gray-100 px-2 py-1 rounded w-fit">
                          <MapPin size={12} className="text-gray-400" />
                          <span className="text-xs font-medium">{t.location?.name || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          t.type === 'IN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-medium text-gray-900">{t.quantity}</td>
                      <td className="px-6 py-4 max-w-xs truncate text-gray-500">
                        <div className="flex items-center gap-2">
                          <ClipboardList size={14} className="flex-shrink-0" />
                          <span className="truncate">{t.notes}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">{t.user?.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
