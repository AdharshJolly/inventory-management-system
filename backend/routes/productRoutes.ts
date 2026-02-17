import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

// All routes protected
router.use(protect);

router.route('/')
  .get(getProducts)
  .post(authorize('warehouse-manager'), createProduct);

router.route('/:id')
  .get(getProduct)
  .put(authorize('warehouse-manager'), updateProduct)
  .delete(authorize('warehouse-manager'), deleteProduct);

export default router;
