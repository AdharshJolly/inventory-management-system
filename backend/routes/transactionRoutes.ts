import express from 'express';
import {
  getTransactions,
  createTransaction,
  getStocks
} from '../controllers/transactionController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getTransactions)
  .post(createTransaction);

router.get('/stocks', getStocks);

export default router;
