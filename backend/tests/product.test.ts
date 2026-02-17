import { describe, it, expect, beforeEach } from 'bun:test';
import request from 'supertest';
import app from '../server';
import './setup';
import User from '../models/User';
import Supplier from '../models/Supplier';
import Product from '../models/Product';

describe('Product API', () => {
  let token: string;
  let supplierId: string;

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

    // Create a supplier for products to reference
    const supplier = await Supplier.create({
      name: 'Main Supplier',
      email: 'main@supplier.com'
    });
    supplierId = supplier._id.toString();
  });

  const getTestProduct = () => ({
    sku: 'PROD-' + Math.random().toString(36).substring(7),
    name: 'Test Product',
    category: 'General',
    description: 'A test product description',
    basePrice: 19.99,
    supplier: supplierId
  });

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const productData = getTestProduct();
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send(productData);

      expect(res.status).toBe(201);
      expect(res.body.sku).toBe(productData.sku);
      expect(res.body.supplier).toBe(supplierId);
    });

    it('should fail if SKU is missing', async () => {
      const productData = getTestProduct();
      delete (productData as any).sku;

      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send(productData);

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/products', () => {
    it('should get all products with supplier populated', async () => {
      await Product.create(getTestProduct());

      const res = await request(app)
        .get('/api/products')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.pagination).toBeDefined();
      expect(res.body.data[0].supplier.name).toBeDefined(); // Populated
    });
  });

  describe('GET /api/products/:id', () => {
    it('should get a single product by id', async () => {
      const product = await Product.create(getTestProduct());

      const res = await request(app)
        .get(`/api/products/${product._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.sku).toBe(product.sku);
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update a product', async () => {
      const product = await Product.create(getTestProduct());
      const updatedName = 'Updated Product Name';

      const res = await request(app)
        .put(`/api/products/${product._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: updatedName });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe(updatedName);
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete a product', async () => {
      const product = await Product.create(getTestProduct());

      const res = await request(app)
        .delete(`/api/products/${product._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      const deletedProduct = await Product.findById(product._id);
      expect(deletedProduct).toBeNull();
    });
  });
});
