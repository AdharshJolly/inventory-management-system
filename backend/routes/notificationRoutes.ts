import express from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead
} from '../controllers/notificationController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getNotifications);

router.patch('/read-all', markAllAsRead);
router.patch('/:id/read', markAsRead);

export default router;
