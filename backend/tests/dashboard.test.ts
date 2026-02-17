import { describe, it, expect, beforeEach } from 'bun:test';
import request from 'supertest';
import app from '../server';
import './setup';
import User from '../models/User';
import Supplier from '../models/Supplier';
import Product from '../models/Product';
import Stock from '../models/Stock';
import Location from '../models/Location';

describe('Dashboard API', () => {
  let token: string;

  beforeEach(async () => {
    // Auth
    await User.create({
      name: 'Admin',
      email: 'admin@ims.com',
      password: 'password123',
      role: 'warehouse-manager'
    });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@ims.com',
        password: 'password123'
      });
    
    token = loginRes.body.token;

    // Setup Data
    const supplier = await Supplier.create({ name: 'Dash Supplier' });
    const location = await Location.create({ name: 'Warehouse X', type: 'Warehouse' });

    // Product 1: In stock, above min
    const p1 = await Product.create({ sku: 'P1', name: 'Product 1', basePrice: 10, supplier: supplier._id });
    await Stock.create({ product: p1._id, location: location._id, currentQuantity: 20, minLevel: 5 });

    // Product 2: Low stock
    const p2 = await Product.create({ sku: 'P2', name: 'Product 2', basePrice: 20, supplier: supplier._id });
    await Stock.create({ product: p2._id, location: location._id, currentQuantity: 2, minLevel: 10 });

    // Product 3: Out of stock
    const p3 = await Product.create({ sku: 'P3', name: 'Product 3', basePrice: 50, supplier: supplier._id });
    await Stock.create({ product: p3._id, location: location._id, currentQuantity: 0, minLevel: 1 });
  });

  describe('GET /api/dashboard/stats', () => {
    it('should return correct aggregation stats', async () => {
      const res = await request(app)
        .get('/api/dashboard/stats')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      
      // Total Products: 3
      expect(res.body.totalProducts).toBe(3);

      // Total Stock Value: (10*20) + (20*2) + (50*0) = 200 + 40 + 0 = 240
      expect(res.body.totalStockValue).toBe(240);

      // Low Stock Alerts: Product 2 and Product 3
      expect(res.body.lowStockAlerts).toHaveLength(2);
      const lowStockSkus = res.body.lowStockAlerts.map((item: any) => item.product.sku);
      expect(lowStockSkus).toContain('P2');
      expect(lowStockSkus).toContain('P3');
      expect(res.body.lowStockAlerts[0].location.name).toBe('Warehouse X');
    });
  });
});
