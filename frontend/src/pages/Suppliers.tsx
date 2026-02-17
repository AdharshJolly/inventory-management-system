import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Skeleton from '../components/ui/Skeleton';
import Modal from '../components/ui/Modal';
import Pagination from '../components/ui/Pagination';
import RoleGuard from '../components/auth/RoleGuard';
import EmptyState from '../components/ui/EmptyState';
import { supplierSchema, type SupplierFormData } from '../schemas';
import { Plus, User, Mail, Phone, Edit2, Trash2, ArrowUpDown, ArrowUp, ArrowDown, Users } from 'lucide-react';

const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);
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
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema) as any,
    defaultValues: {
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
    },
  });

  const fetchSuppliers = async (currentPage = page) => {
    setLoading(true);
    try {
      const response = await api.get(`/suppliers?page=${currentPage}&limit=10`);
      setSuppliers(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error('Failed to fetch suppliers', err);
      toast.error('Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers(page);
  }, [page]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedSuppliers = useMemo(() => {
    if (sortConfig.direction) {
      return [...suppliers].sort((a, b) => {
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return suppliers;
  }, [suppliers, sortConfig]);

  const openAddModal = () => {
    setEditingSupplier(null);
    reset();
    setIsModalOpen(true);
  };

  const openEditModal = (supplier: any) => {
    setEditingSupplier(supplier);
    setValue('name', supplier.name);
    setValue('contactPerson', supplier.contactPerson);
    setValue('email', supplier.email);
    setValue('phone', supplier.phone);
    setValue('address', supplier.address);
    setIsModalOpen(true);
  };

  const onSubmit = async (data: SupplierFormData) => {
    setSubmitting(true);
    try {
      if (editingSupplier) {
        await api.put(`/suppliers/${editingSupplier._id}`, data);
        toast.success('Supplier updated successfully');
      } else {
        await api.post('/suppliers', data);
        toast.success('Supplier added successfully');
      }
      setIsModalOpen(false);
      reset();
      fetchSuppliers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || `Failed to ${editingSupplier ? 'update' : 'add'} supplier`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await api.delete(`/suppliers/${id}`);
        toast.success('Supplier deleted successfully');
        fetchSuppliers();
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to delete supplier');
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
        <h1 className="text-2xl font-bold text-gray-800">Suppliers</h1>
        <RoleGuard allowedRoles={['warehouse-manager']}>
          <Button className="gap-2" onClick={openAddModal}>
            <Plus size={18} />
            Add Supplier
          </Button>
        </RoleGuard>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Supplier Name"
            placeholder="e.g. Acme Corp"
            {...register('name')}
            error={errors.name?.message}
          />
          <Input
            label="Contact Person"
            placeholder="John Doe"
            {...register('contactPerson')}
            error={errors.contactPerson?.message}
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="john@acme.com"
            {...register('email')}
            error={errors.email?.message}
          />
          <Input
            label="Phone Number"
            placeholder="+1 234 567 890"
            {...register('phone')}
            error={errors.phone?.message}
          />
          <Input
            label="Address"
            placeholder="123 Main St, City, Country"
            {...register('address')}
            error={errors.address?.message}
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              {editingSupplier ? 'Save Changes' : 'Add Supplier'}
            </Button>
          </div>
        </form>
      </Modal>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : suppliers.length === 0 ? (
          <EmptyState
            title="No suppliers found"
            description="Start by adding your first supplier to manage your inventory source."
            icon={<Users size={48} className="text-gray-300" />}
            action={
              <RoleGuard allowedRoles={['warehouse-manager']}>
                <Button onClick={openAddModal} variant="outline" className="gap-2">
                  <Plus size={18} />
                  Add First Supplier
                </Button>
              </RoleGuard>
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                  <tr>
                    <th className="px-6 py-3 font-semibold cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('name')}>
                      <div className="flex items-center">Name <SortIcon column="name" /></div>
                    </th>
                    <th className="px-6 py-3 font-semibold cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('contactPerson')}>
                      <div className="flex items-center">Contact <SortIcon column="contactPerson" /></div>
                    </th>
                    <th className="px-6 py-3 font-semibold">Email</th>
                    <th className="px-6 py-3 font-semibold">Phone</th>
                    <RoleGuard allowedRoles={['warehouse-manager']}>
                      <th className="px-6 py-3 font-semibold text-right">Actions</th>
                    </RoleGuard>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {sortedSuppliers.map((s) => (
                    <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{s.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-gray-400" />
                          {s.contactPerson}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-blue-600">
                          <Mail size={14} />
                          {s.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        <div className="flex items-center gap-2">
                          <Phone size={14} />
                          {s.phone}
                        </div>
                      </td>
                      <RoleGuard allowedRoles={['warehouse-manager']}>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(s)}
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(s._id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </RoleGuard>
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

export default Suppliers;
