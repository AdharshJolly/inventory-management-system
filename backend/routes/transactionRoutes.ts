import express from 'express';
import {
  getTransactions,
  createTransaction,
  getStocks,
  getStockBreakdown
} from '../controllers/transactionController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getTransactions)
  .post(createTransaction);

router.get('/stocks', getStocks);
router.get('/stocks/breakdown', getStockBreakdown);

export default router;
