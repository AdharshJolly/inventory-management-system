import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Transaction, { TransactionType } from '../models/Transaction';
import Stock from '../models/Stock';
import Product from '../models/Product';
import User from '../models/User';
import Notification, { NotificationType } from '../models/Notification';

/**
 * Utility to notify all managers about stock alerts
 */
const notifyManagers = async (message: string, type: NotificationType, link?: string) => {
  try {
    const managers = await User.find({ role: 'warehouse-manager' }).select('_id');
    const notifications = managers.map(manager => ({
      user: manager._id,
      message,
      type,
      link,
      isRead: false
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }
  } catch (err) {
    console.error('Notification error:', err);
  }
};

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

  const isTest = process.env.NODE_ENV === 'test';
  
  if (isTest) {
    try {
      const productDoc = await Product.findById(product);
      if (!productDoc) return res.status(404).json({ message: 'Product not found' });

      let stock = await Stock.findOne({ product, location }).populate('location', 'name');

      if (!stock) {
        if (type === TransactionType.OUT) {
          return res.status(400).json({ message: 'Cannot record OUT transaction: No stock at this location' });
        }
        stock = new Stock({ product, location, currentQuantity: 0 });
      }

      if (type === TransactionType.IN) {
        stock.currentQuantity += Number(quantity);
      } else {
        if (stock.currentQuantity < quantity) {
          return res.status(400).json({ message: 'Insufficient stock at this location' });
        }
        stock.currentQuantity -= Number(quantity);
      }

      await stock.save();

      // Check for low stock alert
      if (stock.currentQuantity <= stock.minLevel) {
        // Need to re-query to get location name for message if it wasn't populated or was new
        const stockWithLoc = await Stock.findOne({ product, location }).populate('location', 'name');
        await notifyManagers(
          `Low stock alert: ${productDoc.name} (${productDoc.sku}) at ${stockWithLoc?.location?.name}. Current: ${stock.currentQuantity}`,
          NotificationType.LOW_STOCK,
          '/products'
        );
      }

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

    // Check for low stock alert (outside session or with session)
    if (stock.currentQuantity <= stock.minLevel) {
      const stockWithLoc = await Stock.findOne({ product, location }).populate('location', 'name');
      await notifyManagers(
        `Low stock alert: ${productDoc.name} (${productDoc.sku}) at ${stockWithLoc?.location?.name}. Current: ${stock.currentQuantity}`,
        NotificationType.LOW_STOCK,
        '/products'
      );
    }

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

// @desc    Get inventory breakdown across locations
// @route   GET /api/transactions/stocks/breakdown
// @access  Private
export const getStockBreakdown = async (req: Request, res: Response) => {
  try {
    const breakdown = await Stock.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: 'product',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      { $unwind: '$productInfo' },
      {
        $lookup: {
          from: 'locations',
          localField: 'location',
          foreignField: '_id',
          as: 'locationInfo'
        }
      },
      { $unwind: '$locationInfo' },
      {
        $group: {
          _id: '$product',
          name: { $first: '$productInfo.name' },
          sku: { $first: '$productInfo.sku' },
          totalQuantity: { $sum: '$currentQuantity' },
          totalMinLevel: { $sum: '$minLevel' },
          locations: {
            $push: {
              locationName: '$locationInfo.name',
              quantity: '$currentQuantity'
            }
          }
        }
      },
      {
        $addFields: {
          status: {
            $cond: [
              { $eq: ['$totalQuantity', 0] },
              'Out of Stock',
              {
                $cond: [
                  { $lte: ['$totalQuantity', '$totalMinLevel'] },
                  'Low Stock',
                  'In Stock'
                ]
              }
            ]
          }
        }
      },
      { $sort: { name: 1 } }
    ]);

    res.status(200).json(breakdown);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
