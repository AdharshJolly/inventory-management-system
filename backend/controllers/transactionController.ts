import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Transaction, { TransactionType } from '../models/Transaction';
import Stock from '../models/Stock';
import Product from '../models/Product';

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 100;
    const skip = (page - 1) * limit;

    const totalDocs = await Transaction.countDocuments();
    const transactions = await Transaction.find()
      .populate('product', 'name sku')
      .populate('location', 'name')
      .populate('user', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      data: transactions,
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

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
export const createTransaction = async (req: any, res: Response) => {
  const { product, location, type, quantity, notes } = req.body;

  // Use a session if not in test env (unless replica set is configured)
  const isTest = process.env.NODE_ENV === 'test';
  
  if (isTest) {
    try {
      // 1. Verify product exists
      const productDoc = await Product.findById(product);
      if (!productDoc) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // 2. Find or create stock for this product-location pair
      let stock = await Stock.findOne({ product, location });

      if (!stock) {
        if (type === TransactionType.OUT) {
          return res.status(400).json({ message: 'Cannot record OUT transaction: No stock at this location' });
        }
        stock = new Stock({ product, location, currentQuantity: 0 });
      }

      // 3. Update stock quantity
      if (type === TransactionType.IN) {
        stock.currentQuantity += Number(quantity);
      } else {
        if (stock.currentQuantity < quantity) {
          return res.status(400).json({ message: 'Insufficient stock at this location' });
        }
        stock.currentQuantity -= Number(quantity);
      }

      await stock.save();

      // 4. Create transaction
      const transaction = await Transaction.create({
        product,
        location,
        type,
        quantity,
        user: req.user._id,
        notes
      });

      return res.status(201).json(transaction);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Production path with Transactions
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const productDoc = await Product.findById(product).session(session);
    if (!productDoc) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Product not found' });
    }

    let stock = await Stock.findOne({ product, location }).session(session);

    if (!stock) {
      if (type === TransactionType.OUT) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: 'Cannot record OUT transaction: No stock at this location' });
      }
      stock = new Stock({ product, location, currentQuantity: 0 });
    }

    if (type === TransactionType.OUT && stock.currentQuantity < quantity) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Insufficient stock at this location' });
    }

    if (type === TransactionType.IN) {
      stock.currentQuantity += Number(quantity);
    } else {
      stock.currentQuantity -= Number(quantity);
    }

    await stock.save({ session });

    const transaction = await Transaction.create([{
      product,
      location,
      type,
      quantity,
      user: req.user._id,
      notes
    }], { session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(transaction[0]);
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all stock records
// @route   GET /api/stocks
// @access  Private
export const getStocks = async (req: Request, res: Response) => {
  try {
    const stocks = await Stock.find()
      .populate('product', 'name sku basePrice')
      .populate('location', 'name');
    res.status(200).json(stocks);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
