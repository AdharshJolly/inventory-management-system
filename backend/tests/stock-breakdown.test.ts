import { describe, it, expect, beforeEach } from 'bun:test';
import request from 'supertest';
import app from '../server';
import './setup';
import User from '../models/User';
import Supplier from '../models/Supplier';
import Product from '../models/Product';
import Stock from '../models/Stock';
import Location from '../models/Location';

describe('Stock Breakdown API', () => {
  let token: string;
  let productId: string;
  let loc1Id: string;
  let loc2Id: string;

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
    const supplier = await Supplier.create({ name: 'Stock Supplier' });
    
    // Setup Locations
    const loc1 = await Location.create({ name: 'Warehouse A', type: 'Warehouse' });
    const loc2 = await Location.create({ name: 'Showroom B', type: 'Showroom' });
    loc1Id = loc1._id.toString();
    loc2Id = loc2._id.toString();

    // Setup Product
    const product = await Product.create({
      sku: 'STOCK-01',
      name: 'Stock Product',
      supplier: supplier._id
    });
    productId = product._id.toString();

    // Setup Stock
    await Stock.create({
      product: product._id,
      location: loc1._id,
      currentQuantity: 60,
      minLevel: 10
    });
    await Stock.create({
      product: product._id,
      location: loc2._id,
      currentQuantity: 40,
      minLevel: 5
    });
  });

  it('should return a breakdown of stock across locations', async () => {
    const res = await request(app)
      .get('/api/transactions/stocks/breakdown')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);

    const breakdown = res.body[0];
    expect(breakdown.name).toBe('Stock Product');
    expect(breakdown.sku).toBe('STOCK-01');
    expect(breakdown.totalQuantity).toBe(100);
    expect(breakdown.status).toBe('In Stock');
    expect(breakdown.locations.length).toBe(2);

    const locNames = breakdown.locations.map((l: any) => l.locationName);
    expect(locNames).toContain('Warehouse A');
    expect(locNames).toContain('Showroom B');

    const warehouseA = breakdown.locations.find((l: any) => l.locationName === 'Warehouse A');
    expect(warehouseA.quantity).toBe(60);
    expect(warehouseA.stockId).toBeDefined();
    expect(warehouseA.minLevel).toBe(10);
  });

  it('should correctly identify Low Stock status', async () => {
    // Modify stock to be low
    await Stock.findOneAndUpdate(
      { product: productId, location: loc1Id },
      { currentQuantity: 5 } // total will be 5 + 40 = 45. 
    );
    // Actually, status should be per product total vs total minLevel? 
    // Or if ANY location is low? 
    // Spec says: "In Stock (Green): Quantity well above minLevel.", "Low Stock (Amber): Quantity at or slightly above minLevel."
    // Let's assume it's based on total.
    
    // Create a product with very low total stock
    const supplier = await Supplier.findOne({ name: 'Stock Supplier' });
    const lowProd = await Product.create({
      sku: 'LOW-01',
      name: 'Low Product',
      supplier: supplier?._id
    });
    await Stock.create({
      product: lowProd._id,
      location: loc1Id,
      currentQuantity: 2,
      minLevel: 5
    });

    const res = await request(app)
      .get('/api/transactions/stocks/breakdown')
      .set('Authorization', `Bearer ${token}`);

    const lowBreakdown = res.body.find((b: any) => b.sku === 'LOW-01');
    expect(lowBreakdown.status).toBe('Low Stock');
  });

  it('should correctly identify Out of Stock status', async () => {
    // Create a product with no stock
    const supplier = await Supplier.findOne({ name: 'Stock Supplier' });
    const outProd = await Product.create({
      sku: 'OUT-01',
      name: 'Out Product',
      supplier: supplier?._id
    });
    // Even if a stock record exists with 0
    await Stock.create({
      product: outProd._id,
      location: loc1Id,
      currentQuantity: 0,
      minLevel: 5
    });

    const res = await request(app)
      .get('/api/transactions/stocks/breakdown')
      .set('Authorization', `Bearer ${token}`);

    const outBreakdown = res.body.find((b: any) => b.sku === 'OUT-01');
    expect(outBreakdown.status).toBe('Out of Stock');
    expect(outBreakdown.totalQuantity).toBe(0);
  });
});
