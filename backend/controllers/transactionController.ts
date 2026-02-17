import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Transaction, { TransactionType } from '../models/Transaction';
import Stock from '../models/Stock';

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await Transaction.find()
      .populate('product', 'name sku')
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
export const createTransaction = async (req: any, res: Response) => {
  const isTest = process.env.NODE_ENV === 'test';
  
  if (isTest) {
    // Non-transactional path for testing (unless replica set is configured)
    try {
      const { product, type, quantity, notes } = req.body;
      let stock = await Stock.findOne({ product });
      if (!stock) {
        stock = new Stock({ product, currentQuantity: 0 });
      }
      if (type === TransactionType.OUT && stock.currentQuantity < quantity) {
        res.status(400).json({ message: 'Insufficient stock for this transaction' });
        return;
      }
      if (type === TransactionType.IN) {
        stock.currentQuantity += Number(quantity);
      } else {
        stock.currentQuantity -= Number(quantity);
      }
      await stock.save();
      const transaction = await Transaction.create({
        product,
        type,
        quantity,
        user: req.user._id,
        notes
      });
      res.status(201).json(transaction);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
    return;
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { product, type, quantity, notes } = req.body;

    // 1. Find the stock record
    let stock = await Stock.findOne({ product }).session(session);

    // If stock doesn't exist, create it (mainly for initial IN transactions)
    if (!stock) {
      stock = new Stock({ product, currentQuantity: 0 });
    }

    // 2. Validate OUT transaction
    if (type === TransactionType.OUT && stock.currentQuantity < quantity) {
      await session.abortTransaction();
      session.endSession();
      res.status(400).json({ message: 'Insufficient stock for this transaction' });
      return;
    }

    // 3. Update stock quantity
    if (type === TransactionType.IN) {
      stock.currentQuantity += Number(quantity);
    } else {
      stock.currentQuantity -= Number(quantity);
    }

    await stock.save({ session });

    // 4. Create transaction record
    const transaction = await Transaction.create([{
      product,
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
    const stocks = await Stock.find().populate('product', 'name sku basePrice');
    res.status(200).json(stocks);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
