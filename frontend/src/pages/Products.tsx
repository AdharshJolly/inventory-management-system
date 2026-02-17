import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Skeleton from '../components/ui/Skeleton';
import { Plus, Search, Tag } from 'lucide-react';

const Products: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Product Catalog</h1>
        <Button className="gap-2">
          <Plus size={18} />
          Add Product
        </Button>
      </div>

      <div className="flex gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <Search className="text-gray-400" size={20} />
        <Input 
          placeholder="Search by name or SKU..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-none focus:ring-0"
        />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <Table headers={['Product', 'SKU', 'Category', 'Price', 'Supplier']}>
            {filteredProducts.map((p) => (
              <tr key={p._id}>
                <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                <td className="px-6 py-4 font-mono text-xs">{p.sku}</td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1">
                    <Tag size={12} className="text-gray-400" />
                    {p.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-900 font-semibold">${p.basePrice.toFixed(2)}</td>
                <td className="px-6 py-4 text-blue-600">{p.supplier?.name}</td>
              </tr>
            ))}
          </Table>
        )}
      </div>
    </div>
  );
};

export default Products;
