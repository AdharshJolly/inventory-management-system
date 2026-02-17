import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import { ArrowUpDown, Calendar, ClipboardList } from 'lucide-react';

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get('/transactions');
        setTransactions(response.data);
      } catch (err) {
        console.error('Failed to fetch transactions', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Inventory Log</h1>
        <Button className="gap-2" onClick={() => navigate('/transactions')}>
          <ArrowUpDown size={18} />
          New Transaction
        </Button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        {loading ? (
          <p>Loading transactions...</p>
        ) : (
          <Table headers={['Date', 'Product', 'Type', 'Qty', 'Notes', 'User']}>
            {transactions.map((t) => (
              <tr key={t._id}>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500 flex items-center gap-2">
                  <Calendar size={14} />
                  {new Date(t.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">{t.product?.name}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    t.type === 'IN' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {t.type}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono">{t.quantity}</td>
                <td className="px-6 py-4 max-w-xs truncate text-gray-500">
                  <div className="flex items-center gap-2">
                    <ClipboardList size={14} />
                    {t.notes}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500">{t.user?.name}</td>
              </tr>
            ))}
          </Table>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
