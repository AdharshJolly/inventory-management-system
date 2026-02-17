import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { ArrowLeftRight, Package, AlertCircle } from 'lucide-react';

const TransactionExecution: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    product: '',
    type: 'IN',
    quantity: 1,
    notes: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products?limit=1000');
        const productList = response.data.data || [];
        setProducts(productList);
        if (productList.length > 0) {
          setFormData(prev => ({ ...prev, product: productList[0]._id }));
        }
      } catch (err) {
        console.error('Failed to fetch products', err);
        setError('Could not load products for selection.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await api.post('/transactions', formData);
      const product = products.find(p => p._id === formData.product);
      toast.success(`Successfully recorded ${formData.type} transaction for ${product?.name}`);
      setSuccess('Transaction recorded successfully!');
      // Reset form but keep same product selected
      setFormData(prev => ({ ...prev, quantity: 1, notes: '' }));
      
      // Navigate to history after a short delay
      setTimeout(() => navigate('/history'), 1500);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to execute transaction.';
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading products...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
          <ArrowLeftRight size={24} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Execute Stock Movement</h1>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2 border border-red-100">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 text-green-600 p-4 rounded-lg border border-green-100 font-medium">
            {success} Redirecting to history...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Select Product</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Package size={18} />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.product}
                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                required
              >
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.sku})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Movement Type</label>
              <div className="flex rounded-md shadow-sm">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'IN' })}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-l-md border ${
                    formData.type === 'IN'
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  STOCK IN
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'OUT' })}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-r-md border-t border-r border-b ${
                    formData.type === 'OUT'
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  STOCK OUT
                </button>
              </div>
            </div>

            <Input
              label="Quantity"
              type="number"
              min="1"
              required
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
            />
          </div>

          <Input
            label="Notes / Comments"
            placeholder="Reason for movement (e.g. Restock from supplier, Store sale...)"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />

          <Button type="submit" className="w-full py-6 text-lg" loading={submitting}>
            Complete Transaction
          </Button>
        </form>
      </div>
    </div>
  );
};

export default TransactionExecution;
