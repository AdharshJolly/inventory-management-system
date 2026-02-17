import { describe, it, expect, beforeEach } from 'bun:test';
import request from 'supertest';
import app from '../server';
import './setup';
import User from '../models/User';
import Supplier from '../models/Supplier';
import Product from '../models/Product';
import Stock from '../models/Stock';
import Transaction, { TransactionType } from '../models/Transaction';

describe('Transaction API', () => {
  let token: string;
  let productId: string;

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

    // Setup Product
    const supplier = await Supplier.create({ name: 'Trans Supplier' });
    const product = await Product.create({
      sku: 'TRANS-01',
      name: 'Trans Product',
      supplier: supplier._id
    });
    productId = product._id.toString();

    // Initial Stock
    await Stock.create({
      product: product._id,
      currentQuantity: 10,
      minLevel: 5
    });
  });

  describe('POST /api/transactions', () => {
    it('should record an IN transaction and increase stock', async () => {
      const res = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          product: productId,
          type: TransactionType.IN,
          quantity: 5,
          notes: 'Restock'
        });

      expect(res.status).toBe(201);
      expect(res.body.type).toBe(TransactionType.IN);

      const stock = await Stock.findOne({ product: productId });
      expect(stock?.currentQuantity).toBe(15);
    });

    it('should record an OUT transaction and decrease stock', async () => {
      const res = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          product: productId,
          type: TransactionType.OUT,
          quantity: 3,
          notes: 'Sale'
        });

      expect(res.status).toBe(201);
      
      const stock = await Stock.findOne({ product: productId });
      expect(stock?.currentQuantity).toBe(7);
    });

    it('should fail if OUT quantity exceeds current stock', async () => {
      const res = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          product: productId,
          type: TransactionType.OUT,
          quantity: 20,
          notes: 'Excessive Sale'
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Insufficient stock');

      const stock = await Stock.findOne({ product: productId });
      expect(stock?.currentQuantity).toBe(10); // Unchanged
    });
  });

  describe('GET /api/transactions', () => {
    it('should get transaction history', async () => {
      const user = await User.findOne({ email: 'admin@ims.com' });
      await Transaction.create({
        product: productId,
        type: TransactionType.IN,
        quantity: 10,
        user: user?._id,
        notes: 'Manual Entry'
      });

      const res = await request(app)
        .get('/api/transactions')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].product.name).toBeDefined(); // Populated
    });
  });
});
