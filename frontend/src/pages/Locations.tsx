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
import { locationSchema, type LocationFormData } from "../schemas";
import {
  Plus,
  MapPin,
  Edit2,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

const Locations: React.FC = () => {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<any>(null);
  const [deletingLocationId, setDeletingLocationId] = useState<string | null>(
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
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      type: "Warehouse",
    },
  });

  const fetchLocations = async (currentPage = page) => {
    setLoading(true);
    try {
      const response = await api.get(`/locations?page=${currentPage}&limit=10`);
      setLocations(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error("Failed to fetch locations", err);
      toast.error("Failed to load locations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations(page);
  }, [page]);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedLocations = useMemo(() => {
    if (sortConfig.direction) {
      return [...locations].sort((a, b) => {
        const aValue = a[sortConfig.key] || "";
        const bValue = b[sortConfig.key] || "";

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return locations;
  }, [locations, sortConfig]);

  const openAddModal = () => {
    setEditingLocation(null);
    reset();
    setIsModalOpen(true);
  };

  const openEditModal = (location: any) => {
    setEditingLocation(location);
    setValue("name", location.name);
    setValue("description", location.description || "");
    setValue("type", location.type);
    setIsModalOpen(true);
  };

  const openDeleteModal = (id: string) => {
    setDeletingLocationId(id);
    setIsDeleteModalOpen(true);
  };

  const onSubmit = async (data: LocationFormData) => {
    setSubmitting(true);
    try {
      if (editingLocation) {
        await api.put(`/locations/${editingLocation._id}`, data);
        toast.success("Location updated successfully");
      } else {
        await api.post("/locations", data);
        toast.success("Location added successfully");
      }
      setIsModalOpen(false);
      reset();
      fetchLocations();
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          `Failed to ${editingLocation ? "update" : "add"} location`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingLocationId) return;

    setSubmitting(true);
    try {
      await api.delete(`/locations/${deletingLocationId}`);
      toast.success("Location deleted successfully");
      setIsDeleteModalOpen(false);
      setDeletingLocationId(null);
      fetchLocations();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete location");
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
          Storage Locations
        </h1>
        <RoleGuard allowedRoles={["warehouse-manager"]}>
          <Button className="gap-2" onClick={openAddModal}>
            <Plus size={18} />
            Add Location
          </Button>
        </RoleGuard>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingLocation ? "Edit Location" : "Add New Location"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Location Name"
            placeholder="e.g. Warehouse A"
            {...register("name")}
            error={errors.name?.message}
          />
          <Input
            label="Type"
            placeholder="e.g. Warehouse, Shelf, Showroom"
            {...register("type")}
            error={errors.type?.message}
          />
          <Input
            label="Description"
            placeholder="Additional details about the area"
            {...register("description")}
            error={errors.description?.message}
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
              {editingLocation ? "Save Changes" : "Add Location"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Location"
        message="Are you sure you want to delete this storage location? This action cannot be undone and may affect stock assignments."
        loading={submitting}
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : locations.length === 0 ? (
          <EmptyState
            title="No locations found"
            description="Start by adding your first storage area to organize your stock."
            icon={
              <MapPin size={48} className="text-gray-300 dark:text-gray-600" />
            }
            action={
              <RoleGuard allowedRoles={["warehouse-manager"]}>
                <Button
                  onClick={openAddModal}
                  variant="outline"
                  className="gap-2"
                >
                  <Plus size={18} />
                  Add First Location
                </Button>
              </RoleGuard>
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs uppercase text-gray-700 dark:text-gray-300">
                  <tr>
                    <th
                      className="px-4 sm:px-6 py-3 font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center">
                        Name <SortIcon column="name" />
                      </div>
                    </th>
                    <th
                      className="px-4 sm:px-6 py-3 font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => handleSort("type")}
                    >
                      <div className="flex items-center">
                        Type <SortIcon column="type" />
                      </div>
                    </th>
                    <th className="px-4 sm:px-6 py-3 font-semibold hidden md:table-cell">Description</th>
                    <RoleGuard allowedRoles={["warehouse-manager"]}>
                      <th className="px-4 sm:px-6 py-3 font-semibold text-right">
                        Actions
                      </th>
                    </RoleGuard>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                  {sortedLocations.map((loc) => (
                    <tr
                      key={loc._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-4 sm:px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {loc.name}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400">
                          {loc.type}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-gray-500 dark:text-gray-400 hidden md:table-cell">
                        {loc.description}
                      </td>
                      <RoleGuard allowedRoles={["warehouse-manager"]}>
                        <td className="px-4 sm:px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1 sm:gap-2">
                            <button
                              onClick={() => openEditModal(loc)}
                              className="p-2 sm:p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => openDeleteModal(loc._id)}
                              className="p-2 sm:p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
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

export default Locations;
