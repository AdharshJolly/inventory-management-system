import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Skeleton from '../components/ui/Skeleton';
import Modal from '../components/ui/Modal';
import Pagination from '../components/ui/Pagination';
import { productSchema, type ProductFormData } from '../schemas';
import { Plus, Search, Tag, Edit2, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

const Products: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

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
    key: 'name',
    direction: 'asc',
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      sku: '',
      name: '',
      category: '',
      description: '',
      basePrice: 0,
      supplier: '',
    },
  });

  const fetchData = async (currentPage = page) => {
    setLoading(true);
    try {
      const [productsRes, suppliersRes] = await Promise.all([
        api.get(`/products?page=${currentPage}&limit=10`),
        api.get('/suppliers?limit=1000'), // Get all suppliers for the dropdown
      ]);
      
      // Backend returns { data, pagination }
      setProducts(productsRes.data.data);
      setPagination(productsRes.data.pagination);
      
      // Suppliers might also be paginated now
      setSuppliers(Array.isArray(suppliersRes.data) ? suppliersRes.data : suppliersRes.data.data);
    } catch (err) {
      console.error('Failed to fetch data', err);
      toast.error('Failed to load products or suppliers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedProducts = useMemo(() => {
    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.direction) {
      return [...filtered].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [products, searchTerm, sortConfig]);

  const openAddModal = () => {
    setEditingProduct(null);
    reset();
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setValue('sku', product.sku);
    setValue('name', product.name);
    setValue('category', product.category);
    setValue('description', product.description || '');
    setValue('basePrice', product.basePrice);
    setValue('supplier', product.supplier?._id || product.supplier || '');
    setIsModalOpen(true);
  };

  const onSubmit = async (data: ProductFormData) => {
    setSubmitting(true);
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, data);
        toast.success('Product updated successfully');
      } else {
        await api.post('/products', data);
        toast.success('Product added successfully');
      }
      setIsModalOpen(false);
      reset();
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || `Failed to ${editingProduct ? 'update' : 'add'} product`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Product deleted successfully');
        fetchData();
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortConfig.key !== column) return <ArrowUpDown size={14} className="ml-1 opacity-50" />;
    return sortConfig.direction === 'asc' ? 
      <ArrowUp size={14} className="ml-1 text-blue-600" /> : 
      <ArrowDown size={14} className="ml-1 text-blue-600" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Product Catalog</h1>
        <Button className="gap-2" onClick={openAddModal}>
          <Plus size={18} />
          Add Product
        </Button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="SKU"
            placeholder="e.g. ELEC-001"
            {...register('sku')}
            error={errors.sku?.message}
          />
          <Input
            label="Product Name"
            placeholder="e.g. Wireless Mouse"
            {...register('name')}
            error={errors.name?.message}
          />
          <Input
            label="Category"
            placeholder="e.g. Electronics"
            {...register('category')}
            error={errors.category?.message}
          />
          <Input
            label="Base Price"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register('basePrice')}
            error={errors.basePrice?.message}
          />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Supplier</label>
            <select
              {...register('supplier')}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                errors.supplier ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a supplier</option>
              {suppliers.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
            {errors.supplier && (
              <p className="mt-1 text-xs text-red-500">{errors.supplier.message}</p>
            )}
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              {editingProduct ? 'Save Changes' : 'Add Product'}
            </Button>
          </div>
        </form>
      </Modal>

      <div className="flex gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <Search className="text-gray-400" size={20} />
        <Input 
          placeholder="Search by name or SKU..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-none focus:ring-0"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                  <tr>
                    <th className="px-6 py-3 font-semibold cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('name')}>
                      <div className="flex items-center">Product <SortIcon column="name" /></div>
                    </th>
                    <th className="px-6 py-3 font-semibold cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('sku')}>
                      <div className="flex items-center">SKU <SortIcon column="sku" /></div>
                    </th>
                    <th className="px-6 py-3 font-semibold cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('category')}>
                      <div className="flex items-center">Category <SortIcon column="category" /></div>
                    </th>
                    <th className="px-6 py-3 font-semibold cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('basePrice')}>
                      <div className="flex items-center">Price <SortIcon column="basePrice" /></div>
                    </th>
                    <th className="px-6 py-3 font-semibold">Supplier</th>
                    <th className="px-6 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {sortedProducts.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50 transition-colors">
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
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(p._id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
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

export default Products;
