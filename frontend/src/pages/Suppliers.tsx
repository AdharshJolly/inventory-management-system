import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Skeleton from '../components/ui/Skeleton';
import Modal from '../components/ui/Modal';
import { supplierSchema, SupplierFormData } from '../schemas';
import { Plus, User, Mail, Phone } from 'lucide-react';

const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
  });

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/suppliers');
      setSuppliers(response.data);
    } catch (err) {
      console.error('Failed to fetch suppliers', err);
      toast.error('Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const onSubmit = async (data: SupplierFormData) => {
    setSubmitting(true);
    try {
      await api.post('/suppliers', data);
      toast.success('Supplier added successfully');
      setIsModalOpen(false);
      reset();
      fetchSuppliers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add supplier');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Suppliers</h1>
        <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Add Supplier
        </Button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Supplier"
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
              Add Supplier
            </Button>
          </div>
        </form>
      </Modal>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <Table headers={['Name', 'Contact', 'Email', 'Phone']}>
            {suppliers.map((s) => (
              <tr key={s._id}>
                <td className="px-6 py-4 font-medium text-gray-900">{s.name}</td>
                <td className="px-6 py-4 flex items-center gap-2">
                  <User size={14} className="text-gray-400" />
                  {s.contactPerson}
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
              </tr>
            ))}
          </Table>
        )}
      </div>
    </div>
  );
};

export default Suppliers;
