import { Request, Response } from 'express';
import Product from '../models/Product';
import Stock from '../models/Stock';

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // 1. Total Products
    const totalProducts = await Product.countDocuments();

    // 2. Total Stock Value (Aggregation)
    const stockValueData = await Stock.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: 'product',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      {
        $unwind: '$productInfo'
      },
      {
        $group: {
          _id: null,
          totalValue: {
            $sum: { $multiply: ['$currentQuantity', '$productInfo.basePrice'] }
          }
        }
      }
    ]);

    const totalStockValue = stockValueData.length > 0 ? stockValueData[0].totalValue : 0;

    // 3. Low Stock Alerts
    // We can't easily do a direct comparison of two fields in a simple find() without $where (slow)
    // or aggregation. Let's use aggregation for precision.
    const lowStockAlerts = await Stock.aggregate([
      {
        $addFields: {
          isLow: { $lte: ['$currentQuantity', '$minLevel'] }
        }
      },
      {
        $match: { isLow: true }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'product',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $unwind: '$product'
      },
      {
        $project: {
          'product.name': 1,
          'product.sku': 1,
          currentQuantity: 1,
          minLevel: 1
        }
      }
    ]);

    res.status(200).json({
      totalProducts,
      totalStockValue,
      lowStockAlerts
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
