import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";
import api from "../../api/axios";
import toast from "react-hot-toast";

interface SetAlertLevelModalProps {
  isOpen: boolean;
  onClose: () => void;
  stockId: string | null;
  productName: string;
  locationName: string;
  currentMinLevel: number;
  onSuccess: () => void;
}

const SetAlertLevelModal: React.FC<SetAlertLevelModalProps> = ({
  isOpen,
  onClose,
  stockId,
  productName,
  locationName,
  currentMinLevel,
  onSuccess,
}) => {
  const [minLevel, setMinLevel] = useState<number>(currentMinLevel);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMinLevel(currentMinLevel);
    }
  }, [isOpen, currentMinLevel]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockId) return;

    setLoading(true);
    try {
      await api.put(`/transactions/stocks/${stockId}`, { minLevel });
      toast.success("Alert level updated successfully");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update alert level");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Set Low Stock Alert Level">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Set the minimum quantity for <span className="font-semibold text-gray-900 dark:text-white">{productName}</span> at <span className="font-semibold text-gray-900 dark:text-white">{locationName}</span> before a low stock alert is triggered.
          </p>
          <Input
            label="Minimum Stock Level"
            type="number"
            min="0"
            value={minLevel}
            onChange={(e) => setMinLevel(parseInt(e.target.value) || 0)}
            required
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SetAlertLevelModal;
