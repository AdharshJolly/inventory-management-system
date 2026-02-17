import { Request, Response } from 'express';
import Location from '../models/Location';

// @desc    Get all locations
// @route   GET /api/locations
// @access  Private
export const getLocations = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 100;
    const skip = (page - 1) * limit;

    const totalDocs = await Location.countDocuments();
    const locations = await Location.find()
      .skip(skip)
      .limit(limit)
      .sort({ name: 1 });

    res.status(200).json({
      data: locations,
      pagination: {
        totalDocs,
        totalPages: Math.ceil(totalDocs / limit),
        currentPage: page,
        limit
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single location
// @route   GET /api/locations/:id
// @access  Private
export const getLocation = async (req: Request, res: Response) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      res.status(404).json({ message: 'Location not found' });
      return;
    }
    res.status(200).json(location);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new location
// @route   POST /api/locations
// @access  Private/Manager
export const createLocation = async (req: Request, res: Response) => {
  try {
    const location = await Location.create(req.body);
    res.status(201).json(location);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update location
// @route   PUT /api/locations/:id
// @access  Private/Manager
export const updateLocation = async (req: Request, res: Response) => {
  try {
    const location = await Location.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!location) {
      res.status(404).json({ message: 'Location not found' });
      return;
    }
    res.status(200).json(location);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete location
// @route   DELETE /api/locations/:id
// @access  Private/Manager
export const deleteLocation = async (req: Request, res: Response) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    if (!location) {
      res.status(404).json({ message: 'Location not found' });
      return;
    }
    res.status(200).json({ message: 'Location removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
