import express from 'express';
import {
  getLocations,
  getLocation,
  createLocation,
  updateLocation,
  deleteLocation
} from '../controllers/locationController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getLocations)
  .post(authorize('warehouse-manager'), createLocation);

router.route('/:id')
  .get(getLocation)
  .put(authorize('warehouse-manager'), updateLocation)
  .delete(authorize('warehouse-manager'), deleteLocation);

export default router;
