import express from 'express';
import {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier
} from '../controllers/supplierController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// All routes protected
router.use(protect);

router.route('/')
  .get(getSuppliers)
  .post(createSupplier);

router.route('/:id')
  .get(getSupplier)
  .put(updateSupplier)
  .delete(deleteSupplier);

export default router;
