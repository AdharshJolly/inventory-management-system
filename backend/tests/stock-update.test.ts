import { describe, it, expect, beforeEach } from 'bun:test';
import request from 'supertest';
import app from '../server';
import './setup';
import User from '../models/User';
import Supplier from '../models/Supplier';
import Product from '../models/Product';
import Stock from '../models/Stock';
import Location from '../models/Location';

describe('Stock Update API', () => {
  let token: string;
  let stockId: string;

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

    // Setup Supplier
    const supplier = await Supplier.create({ name: 'Update Supplier' });
    
    // Setup Location
    const location = await Location.create({ name: 'Update Location', type: 'Warehouse' });

    // Setup Product
    const product = await Product.create({
      sku: 'UPDATE-01',
      name: 'Update Product',
      supplier: supplier._id
    });

    // Setup Stock
    const stock = await Stock.create({
      product: product._id,
      location: location._id,
      currentQuantity: 10,
      minLevel: 5
    });
    stockId = stock._id.toString();
  });

  it('should update minLevel for a stock record', async () => {
    const res = await request(app)
      .put(`/api/transactions/stocks/${stockId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ minLevel: 20 });

    expect(res.status).toBe(200);
    expect(res.body.minLevel).toBe(20);

    const updatedStock = await Stock.findById(stockId);
    expect(updatedStock?.minLevel).toBe(20);
  });

  it('should return 404 for non-existent stock', async () => {
    const fakeId = '65d1c2b3e4f5a6b7c8d9e0f1';
    const res = await request(app)
      .put(`/api/transactions/stocks/${fakeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ minLevel: 20 });

    expect(res.status).toBe(404);
  });
});
