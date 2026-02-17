import { describe, it, expect, beforeEach } from 'bun:test';
import request from 'supertest';
import app from '../server';
import './setup';
import User from '../models/User';
import Supplier from '../models/Supplier';

describe('Supplier API', () => {
  let token: string;

  beforeEach(async () => {
    await User.create({
      name: 'Admin',
      email: 'admin@ims.com',
      password: 'password123',
      role: 'warehouse-manager'
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@ims.com',
        password: 'password123'
      });
    
    token = res.body.token;
  });

  const testSupplier = {
    name: 'Tech Parts Ltd',
    contactPerson: 'Alice Wong',
    email: 'alice@techparts.com',
    phone: '555-0101',
    address: '45 Tech Ave'
  };

  describe('POST /api/suppliers', () => {
    it('should create a new supplier', async () => {
      const res = await request(app)
        .post('/api/suppliers')
        .set('Authorization', `Bearer ${token}`)
        .send(testSupplier);

      expect(res.status).toBe(201);
      expect(res.body.name).toBe(testSupplier.name);
    });

    it('should fail without authentication', async () => {
      const res = await request(app)
        .post('/api/suppliers')
        .send(testSupplier);

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/suppliers', () => {
    it('should get all suppliers', async () => {
      await Supplier.create(testSupplier);

      const res = await request(app)
        .get('/api/suppliers')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/suppliers/:id', () => {
    it('should get a single supplier by id', async () => {
      const supplier = await Supplier.create(testSupplier);

      const res = await request(app)
        .get(`/api/suppliers/${supplier._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.name).toBe(testSupplier.name);
    });

    it('should return 404 for non-existent supplier', async () => {
      const res = await request(app)
        .get('/api/suppliers/60d5ecb8b3928400158e2f00')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/suppliers/:id', () => {
    it('should update a supplier', async () => {
      const supplier = await Supplier.create(testSupplier);
      const updatedName = 'Updated Tech Parts Ltd';

      const res = await request(app)
        .put(`/api/suppliers/${supplier._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: updatedName });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe(updatedName);
    });
  });

  describe('DELETE /api/suppliers/:id', () => {
    it('should delete a supplier', async () => {
      const supplier = await Supplier.create(testSupplier);

      const res = await request(app)
        .delete(`/api/suppliers/${supplier._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBeDefined();

      const deletedSupplier = await Supplier.findById(supplier._id);
      expect(deletedSupplier).toBeNull();
    });
  });
});
