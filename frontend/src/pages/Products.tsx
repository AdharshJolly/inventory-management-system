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
import { productSchema, type ProductFormData } from "../schemas";
import {
  Plus,
  Search,
  Tag,
  Edit2,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Package,
} from "lucide-react";

const Products: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);

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
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      sku: "",
      name: "",
      category: "",
      description: "",
      basePrice: 0,
      supplier: "",
    },
  });

  const fetchData = async (currentPage = page) => {
    setLoading(true);
    try {
      const [productsRes, suppliersRes] = await Promise.all([
        api.get(`/products?page=${currentPage}&limit=10`),
        api.get("/suppliers?limit=1000"), // Get all suppliers for the dropdown
      ]);

      // Backend returns { data, pagination }
      setProducts(productsRes.data.data);
      setPagination(productsRes.data.pagination);

      // Suppliers might also be paginated now
      setSuppliers(
        Array.isArray(suppliersRes.data)
          ? suppliersRes.data
          : suppliersRes.data.data,
      );
    } catch (err) {
      console.error("Failed to fetch data", err);
      toast.error("Failed to load products or suppliers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedProducts = useMemo(() => {
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    if (sortConfig.direction) {
      return [...filtered].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
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
    setValue("sku", product.sku);
    setValue("name", product.name);
    setValue("category", product.category);
    setValue("description", product.description || "");
    setValue("basePrice", product.basePrice);
    setValue("supplier", product.supplier?._id || product.supplier || "");
    setIsModalOpen(true);
  };

  const openDeleteModal = (id: string) => {
    setDeletingProductId(id);
    setIsDeleteModalOpen(true);
  };

  const onSubmit = async (data: ProductFormData) => {
    setSubmitting(true);
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, data);
        toast.success("Product updated successfully");
      } else {
        await api.post("/products", data);
        toast.success("Product added successfully");
      }
      setIsModalOpen(false);
      reset();
      fetchData();
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          `Failed to ${editingProduct ? "update" : "add"} product`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingProductId) return;

    setSubmitting(true);
    try {
      await api.delete(`/products/${deletingProductId}`);
      toast.success("Product deleted successfully");
      setIsDeleteModalOpen(false);
      setDeletingProductId(null);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete product");
    } finally {
      setSubmitting(false);
    }
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortConfig.key !== column)
      return <ArrowUpDown size={14} className="ml-1 opacity-50" />;
    return sortConfig.direction === "asc" ? (
      <ArrowUp size={14} className="ml-1 text-blue-600" />
    ) : (
      <ArrowDown size={14} className="ml-1 text-blue-600" />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Product Catalog
        </h1>
        <RoleGuard allowedRoles={["warehouse-manager"]}>
          <Button className="gap-2" onClick={openAddModal}>
            <Plus size={18} />
            Add Product
          </Button>
        </RoleGuard>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "Edit Product" : "Add New Product"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="SKU"
            placeholder="e.g. ELEC-001"
            {...register("sku")}
            error={errors.sku?.message}
          />
          <Input
            label="Product Name"
            placeholder="e.g. Wireless Mouse"
            {...register("name")}
            error={errors.name?.message}
          />
          <Input
            label="Category"
            placeholder="e.g. Electronics"
            {...register("category")}
            error={errors.category?.message}
          />
          <Input
            label="Base Price"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("basePrice")}
            error={errors.basePrice?.message}
          />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Supplier
            </label>
            <select
              {...register("supplier")}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 dark:text-gray-200 ${
                errors.supplier
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
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
              <p className="mt-1 text-xs text-red-500">
                {errors.supplier.message}
              </p>
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
              {editingProduct ? "Save Changes" : "Add Product"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone and will remove all associated stock and transaction history."
        loading={submitting}
      />

      <div className="flex gap-4 items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <Search className="text-gray-400" size={20} />
        <Input
          placeholder="Search by name or SKU..."
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
        ) : sortedProducts.length === 0 ? (
          <EmptyState
            title="No products found"
            description="Your inventory is empty. Start by adding your first product to track."
            icon={<Package size={48} className="text-gray-300" />}
            action={
              <RoleGuard allowedRoles={["warehouse-manager"]}>
                <Button
                  onClick={openAddModal}
                  variant="outline"
                  className="gap-2"
                >
                  <Plus size={18} />
                  Add First Product
                </Button>
              </RoleGuard>
            }
          />
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs uppercase text-gray-700 dark:text-gray-300">
                  <tr>
                    <th
                      className="px-6 py-3 font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center">
                        Product <SortIcon column="name" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => handleSort("sku")}
                    >
                      <div className="flex items-center">
                        SKU <SortIcon column="sku" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => handleSort("category")}
                    >
                      <div className="flex items-center">
                        Category <SortIcon column="category" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => handleSort("basePrice")}
                    >
                      <div className="flex items-center">
                        Price <SortIcon column="basePrice" />
                      </div>
                    </th>
                    <th className="px-6 py-3 font-semibold">Supplier</th>
                    <RoleGuard allowedRoles={["warehouse-manager"]}>
                      <th className="px-6 py-3 font-semibold text-right">
                        Actions
                      </th>
                    </RoleGuard>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                  {sortedProducts.map((p) => (
                    <tr
                      key={p._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {p.name}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">{p.sku}</td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1">
                          <Tag
                            size={12}
                            className="text-gray-400 dark:text-gray-500"
                          />
                          {p.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">
                        ${p.basePrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-blue-600 dark:text-blue-400">
                        {p.supplier?.name}
                      </td>
                      <RoleGuard allowedRoles={["warehouse-manager"]}>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(p)}
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => openDeleteModal(p._id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
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

            {/* Mobile Card View */}
            <div className="sm:hidden divide-y divide-gray-100 dark:divide-gray-700">
              {sortedProducts.map((p) => (
                <div key={p._id} className="p-4 bg-white dark:bg-gray-800">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{p.name}</h3>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">{p.sku}</p>
                    </div>
                    <RoleGuard allowedRoles={["warehouse-manager"]}>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-2 text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(p._id)}
                          className="p-2 text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </RoleGuard>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                      <Tag size={14} className="text-gray-400" />
                      <span>{p.category}</span>
                    </div>
                    <div className="flex items-center justify-end font-bold text-gray-900 dark:text-white">
                      ${p.basePrice.toFixed(2)}
                    </div>
                    <div className="col-span-2 pt-2 mt-1 border-t border-gray-50 dark:border-gray-700/50 flex justify-between items-center text-xs">
                      <span className="text-gray-400 uppercase tracking-wider font-semibold">Supplier</span>
                      <span className="text-blue-600 dark:text-blue-400 font-medium">{p.supplier?.name}</span>
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

export default Products;
