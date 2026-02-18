import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Combobox from "../components/ui/Combobox";
import Skeleton from "../components/ui/Skeleton";
import { ArrowLeftRight, AlertCircle } from "lucide-react";

const TransactionExecution: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    product: "",
    location: "",
    type: "IN",
    quantity: 1,
    notes: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, locationsRes] = await Promise.all([
          api.get("/products?limit=1000"),
          api.get("/locations?limit=1000"),
        ]);

        const productList = productsRes.data.data || [];
        const locationList = locationsRes.data.data || [];

        setProducts(productList);
        setLocations(locationList);

        if (productList.length > 0 && locationList.length > 0) {
          setFormData((prev) => ({
            ...prev,
            product: productList[0]._id,
            location: locationList[0]._id,
          }));
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
        setError("Could not load products or locations for selection.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await api.post("/transactions", formData);
      const product = products.find((p) => p._id === formData.product);
      const location = locations.find((l) => l._id === formData.location);
      toast.success(
        `Recorded ${formData.type} for ${product?.name} at ${location?.name}`,
      );

      // Reset form but keep same product/location selected
      setFormData((prev) => ({ ...prev, quantity: 1, notes: "" }));

      // Navigate to history after a short delay
      setTimeout(() => navigate("/history"), 1000);
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Failed to execute transaction.";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );

  const productItems = products.map((p) => ({
    id: p._id,
    label: p.name,
    subLabel: p.sku,
  }));

  const locationItems = locations.map((l) => ({
    id: l._id,
    label: l.name,
    subLabel: l.type,
  }));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
          <ArrowLeftRight size={24} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Execute Stock Movement
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg flex items-center gap-2 border border-red-100 dark:border-red-800 text-sm">
            <AlertCircle size={18} className="shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Combobox
              label="Select Product"
              placeholder="Search products..."
              items={productItems}
              value={formData.product}
              onChange={(value) => setFormData({ ...formData, product: value })}
            />

            <Combobox
              label="Select Location"
              placeholder="Search locations..."
              items={locationItems}
              value={formData.location}
              onChange={(value) =>
                setFormData({ ...formData, location: value })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Movement Type
              </label>
              <div className="flex rounded-md shadow-sm h-10">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "IN" })}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-l-md border ${
                    formData.type === "IN"
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                  }`}
                >
                  STOCK IN
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "OUT" })}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-r-md border-t border-r border-b ${
                    formData.type === "OUT"
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
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
              onChange={(e) =>
                setFormData({ ...formData, quantity: parseInt(e.target.value) })
              }
            />
          </div>

          <Input
            label="Notes / Comments"
            placeholder="Reason for movement..."
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
          />

          <Button
            type="submit"
            className="w-full py-6 text-lg"
            loading={submitting}
          >
            Complete Transaction
          </Button>
        </form>
      </div>
    </div>
  );
};

export default TransactionExecution;
