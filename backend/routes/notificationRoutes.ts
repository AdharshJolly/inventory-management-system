import express from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  streamNotifications,
} from "../controllers/notificationController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.use(protect);

router.route("/").get(getNotifications);

router.get("/stream", streamNotifications);

router.patch("/read-all", markAllAsRead);
router.patch("/:id/read", markAsRead);

export default router;
