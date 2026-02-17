import { describe, it, expect, beforeEach } from 'bun:test';
import request from 'supertest';
import app from '../server';
import './setup';
import User from '../models/User';

describe('Location API', () => {
  let token: string;

  beforeEach(async () => {
    // Setup Manager User
    await User.create({
      name: 'Manager',
      email: 'manager@ims.com',
      password: 'password123',
      role: 'warehouse-manager'
    });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'manager@ims.com',
        password: 'password123'
      });
    
    token = loginRes.body.token;
  });

  const testLocation = {
    name: 'Main Warehouse',
    description: 'Primary storage for bulk items',
    type: 'Warehouse'
  };

  describe('POST /api/locations', () => {
    it('should create a new location (Manager only)', async () => {
      const res = await request(app)
        .post('/api/locations')
        .set('Authorization', `Bearer ${token}`)
        .send(testLocation);

      expect(res.status).toBe(201);
      expect(res.body.name).toBe(testLocation.name);
    });

    it('should fail for non-manager roles', async () => {
      // Create clerk
      await User.create({
        name: 'Clerk',
        email: 'clerk@ims.com',
        password: 'password123',
        role: 'store-clerk'
      });

      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'clerk@ims.com',
          password: 'password123'
        });
      
      const clerkToken = loginRes.body.token;

      const res = await request(app)
        .post('/api/locations')
        .set('Authorization', `Bearer ${clerkToken}`)
        .send(testLocation);

      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/locations', () => {
    it('should get all locations', async () => {
      // Create a location directly via model would be faster but let's use the API
      await request(app)
        .post('/api/locations')
        .set('Authorization', `Bearer ${token}`)
        .send(testLocation);

      const res = await request(app)
        .get('/api/locations')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('PUT /api/locations/:id', () => {
    it('should update a location', async () => {
      const createRes = await request(app)
        .post('/api/locations')
        .set('Authorization', `Bearer ${token}`)
        .send(testLocation);
      
      const locationId = createRes.body._id;
      const updatedName = 'Secondary Warehouse';

      const res = await request(app)
        .put(`/api/locations/${locationId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: updatedName });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe(updatedName);
    });
  });

  describe('DELETE /api/locations/:id', () => {
    it('should delete a location', async () => {
      const createRes = await request(app)
        .post('/api/locations')
        .set('Authorization', `Bearer ${token}`)
        .send(testLocation);
      
      const locationId = createRes.body._id;

      const res = await request(app)
        .delete(`/api/locations/${locationId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBeDefined();
    });
  });
});
