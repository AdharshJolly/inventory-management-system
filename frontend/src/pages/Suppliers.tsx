import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import api from "../api/axios";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Skeleton from "../components/ui/Skeleton";
import Modal from "../components/ui/Modal";
import Pagination from "../components/ui/Pagination";
import RoleGuard from "../components/auth/RoleGuard";
import EmptyState from "../components/ui/EmptyState";
import ConfirmModal from "../components/ui/ConfirmModal";
import { supplierSchema, type SupplierFormData } from "../schemas";
import {
  Plus,
  User,
  Mail,
  Phone,
  Edit2,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Users,
  Search,
} from "lucide-react";

const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);
  const [deletingSupplierId, setDeletingSupplierId] = useState<string | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalDocs: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
  });

  // Sorting state
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc" | null;
  }>({
    key: "name",
    direction: "asc",
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
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  const fetchSuppliers = async (currentPage = page) => {
    setLoading(true);
    try {
      const response = await api.get(`/suppliers?page=${currentPage}&limit=10`);
      setSuppliers(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error("Failed to fetch suppliers", err);
      toast.error("Failed to load suppliers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers(page);
  }, [page]);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedSuppliers = useMemo(() => {
    const filtered = suppliers.filter(
      (s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.address.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    if (sortConfig.direction) {
      return [...filtered].sort((a, b) => {
        const aValue = a[sortConfig.key] || "";
        const bValue = b[sortConfig.key] || "";

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
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
    setValue("name", supplier.name);
    setValue("contactPerson", supplier.contactPerson);
    setValue("email", supplier.email);
    setValue("phone", supplier.phone);
    setValue("address", supplier.address);
    setIsModalOpen(true);
  };

  const openDeleteModal = (id: string) => {
    setDeletingSupplierId(id);
    setIsDeleteModalOpen(true);
  };

  const onSubmit = async (data: SupplierFormData) => {
    setSubmitting(true);
    try {
      if (editingSupplier) {
        await api.put(`/suppliers/${editingSupplier._id}`, data);
        toast.success("Supplier updated successfully");
      } else {
        await api.post("/suppliers", data);
        toast.success("Supplier added successfully");
      }
      setIsModalOpen(false);
      reset();
      fetchSuppliers();
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          `Failed to ${editingSupplier ? "update" : "add"} supplier`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingSupplierId) return;

    setSubmitting(true);
    try {
      await api.delete(`/suppliers/${deletingSupplierId}`);
      toast.success("Supplier deleted successfully");
      setIsDeleteModalOpen(false);
      setDeletingSupplierId(null);
      fetchSuppliers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete supplier");
    } finally {
      setSubmitting(false);
    }
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortConfig.key !== column)
      return <ArrowUpDown size={13} className="ml-1 opacity-40" />;
    return sortConfig.direction === "asc" ? (
      <ArrowUp
        size={13}
        className="ml-1 text-indigo-600 dark:text-indigo-400"
      />
    ) : (
      <ArrowDown
        size={13}
        className="ml-1 text-indigo-600 dark:text-indigo-400"
      />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Suppliers
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your supplier network
          </p>
        </div>
        <RoleGuard allowedRoles={["warehouse-manager"]}>
          <Button className="gap-2 hidden sm:flex" onClick={openAddModal}>
            <Plus size={18} />
            Add Supplier
          </Button>
        </RoleGuard>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSupplier ? "Edit Supplier" : "Add New Supplier"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Supplier Name"
            placeholder="e.g. Acme Corp"
            {...register("name")}
            error={errors.name?.message}
          />
          <Input
            label="Contact Person"
            placeholder="John Doe"
            {...register("contactPerson")}
            error={errors.contactPerson?.message}
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="john@acme.com"
            {...register("email")}
            error={errors.email?.message}
          />
          <Input
            label="Phone Number"
            placeholder="+1 234 567 890"
            {...register("phone")}
            error={errors.phone?.message}
          />
          <Input
            label="Address"
            placeholder="123 Main St, City, Country"
            {...register("address")}
            error={errors.address?.message}
          />
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700/50">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              {editingSupplier ? "Save Changes" : "Add Supplier"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Supplier"
        message="Are you sure you want to delete this supplier? This action cannot be undone and will remove the reference from associated products."
        loading={submitting}
      />

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-2xl shadow-sm border border-gray-100/80 dark:border-gray-700/60">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-400">
            <Search size={18} />
          </div>
          <Input
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-none focus:ring-0 shadow-none"
          />
        </div>
        <RoleGuard allowedRoles={["warehouse-manager"]}>
          <Button
            className="gap-2 w-full sm:w-auto sm:hidden"
            onClick={openAddModal}
          >
            <Plus size={18} />
            Add Supplier
          </Button>
        </RoleGuard>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100/80 dark:border-gray-700/60 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : suppliers.length === 0 ? (
          <EmptyState
            title="No suppliers found"
            description="Start by adding your first supplier to manage your inventory source."
            icon={
              <Users size={48} className="text-gray-300 dark:text-gray-600" />
            }
            action={
              <RoleGuard allowedRoles={["warehouse-manager"]}>
                <Button
                  onClick={openAddModal}
                  variant="outline"
                  className="gap-2"
                >
                  <Plus size={18} />
                  Add First Supplier
                </Button>
              </RoleGuard>
            }
          />
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-gray-50/80 dark:bg-gray-800/50 border-b border-gray-100/80 dark:border-gray-700/50">
                  <tr>
                    <th
                      className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 cursor-pointer hover:bg-gray-100/60 dark:hover:bg-gray-700/40 transition-colors"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center">
                        Name <SortIcon column="name" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 cursor-pointer hover:bg-gray-100/60 dark:hover:bg-gray-700/40 transition-colors"
                      onClick={() => handleSort("contactPerson")}
                    >
                      <div className="flex items-center">
                        Contact <SortIcon column="contactPerson" />
                      </div>
                    </th>
                    <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Email
                    </th>
                    <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Phone
                    </th>
                    <RoleGuard allowedRoles={["warehouse-manager"]}>
                      <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-right">
                        Actions
                      </th>
                    </RoleGuard>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/80 dark:divide-gray-700/50">
                  {sortedSuppliers.map((s) => (
                    <tr
                      key={s._id}
                      className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="px-6 py-3.5 font-semibold text-gray-900 dark:text-white text-sm">
                        {s.name}
                      </td>
                      <td className="px-6 py-3.5 text-sm">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                          <User size={14} className="text-gray-400" />
                          {s.contactPerson}
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-sm">
                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                          <Mail size={13} />
                          {s.email}
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <Phone size={13} />
                          {s.phone}
                        </div>
                      </td>
                      <RoleGuard allowedRoles={["warehouse-manager"]}>
                        <td className="px-6 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditModal(s)}
                              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => openDeleteModal(s._id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </RoleGuard>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden divide-y divide-gray-100/80 dark:divide-gray-700/50">
              {sortedSuppliers.map((s) => (
                <div key={s._id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                        {s.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                        <User size={13} className="text-gray-400" />
                        <span>{s.contactPerson}</span>
                      </div>
                    </div>
                    <RoleGuard allowedRoles={["warehouse-manager"]}>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(s)}
                          className="p-2 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl"
                          title="Edit"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(s._id)}
                          className="p-2 text-red-600 bg-red-50 dark:bg-red-900/20 rounded-xl"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </RoleGuard>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400">
                      <Mail size={13} />
                      <span className="truncate">{s.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Phone size={13} />
                      <span>{s.phone}</span>
                    </div>
                  </div>
                </div>
              ))}
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
