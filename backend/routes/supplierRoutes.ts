import express from 'express';
import {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier
} from '../controllers/supplierController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

// All routes protected
router.use(protect);

router.route('/')
  .get(getSuppliers)
  .post(authorize('warehouse-manager'), createSupplier);

router.route('/:id')
  .get(getSupplier)
  .put(authorize('warehouse-manager'), updateSupplier)
  .delete(authorize('warehouse-manager'), deleteSupplier);

export default router;
