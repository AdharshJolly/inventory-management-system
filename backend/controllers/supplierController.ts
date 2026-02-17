import { Request, Response } from 'express';
import Supplier from '../models/Supplier';

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Private
export const getSuppliers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 100;
    const skip = (page - 1) * limit;

    const totalDocs = await Supplier.countDocuments();
    const suppliers = await Supplier.find()
      .skip(skip)
      .limit(limit)
      .sort({ name: 1 });

    res.status(200).json({
      data: suppliers,
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

// @desc    Get single supplier
// @route   GET /api/suppliers/:id
// @access  Private
export const getSupplier = async (req: Request, res: Response) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      res.status(404).json({ message: 'Supplier not found' });
      return;
    }
    res.status(200).json(supplier);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new supplier
// @route   POST /api/suppliers
// @access  Private
export const createSupplier = async (req: Request, res: Response) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json(supplier);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update supplier
// @route   PUT /api/suppliers/:id
// @access  Private
export const updateSupplier = async (req: Request, res: Response) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!supplier) {
      res.status(404).json({ message: 'Supplier not found' });
      return;
    }
    res.status(200).json(supplier);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete supplier
// @route   DELETE /api/suppliers/:id
// @access  Private
export const deleteSupplier = async (req: Request, res: Response) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) {
      res.status(404).json({ message: 'Supplier not found' });
      return;
    }
    res.status(200).json({ message: 'Supplier removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
