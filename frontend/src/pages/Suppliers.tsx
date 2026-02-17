import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import { Plus, User, Mail, Phone } from 'lucide-react';

const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await api.get('/suppliers');
        setSuppliers(response.data);
      } catch (err) {
        console.error('Failed to fetch suppliers', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Suppliers</h1>
        <Button className="gap-2">
          <Plus size={18} />
          Add Supplier
        </Button>
      </div>

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
