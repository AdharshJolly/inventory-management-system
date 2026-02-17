import { describe, it, expect, beforeEach } from 'bun:test';
import request from 'supertest';
import app from '../server';
import './setup';
import User from '../models/User';
import Supplier from '../models/Supplier';
import Product from '../models/Product';
import Location from '../models/Location';
import Stock from '../models/Stock';
import Notification from '../models/Notification';

describe('Notification API', () => {
  let token: string;
  let managerId: string;

  beforeEach(async () => {
    // Setup Manager
    const manager = await User.create({
      name: 'Manager',
      email: 'manager-notify@test.com',
      password: 'password123',
      role: 'warehouse-manager'
    });
    managerId = manager._id.toString();

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'manager-notify@test.com',
        password: 'password123'
      });
    
    token = loginRes.body.token;
  });

  it('should trigger notification on low stock transaction', async () => {
    // 1. Setup Product and Stock
    const supplier = await Supplier.create({ name: 'S1' });
    const location = await Location.create({ name: 'L1' });
    const product = await Product.create({
      sku: 'NOTIFY-01',
      name: 'Notify Product',
      supplier: supplier._id
    });

    // Stock starts at 10, minLevel is 5
    await Stock.create({
      product: product._id,
      location: location._id,
      currentQuantity: 10,
      minLevel: 5
    });

    // 2. Perform OUT transaction that hits low stock (Quantity 6 OUT -> 4 left)
    await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        product: product._id.toString(),
        location: location._id.toString(),
        type: 'OUT',
        quantity: 6
      });

    // 3. Check notifications
    const res = await request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].message).toContain('Low stock alert');
    expect(res.body.unreadCount).toBe(1);
  });

  it('should mark notification as read', async () => {
    const notification = await Notification.create({
      user: managerId,
      message: 'Test alert',
      type: 'INFO'
    });

    const res = await request(app)
      .patch(`/api/notifications/${notification._id}/read`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.isRead).toBe(true);

    const check = await Notification.findById(notification._id);
    expect(check?.isRead).toBe(true);
  });

  it('should mark all notifications as read', async () => {
    await Notification.create([
      { user: managerId, message: 'Alert 1' },
      { user: managerId, message: 'Alert 2' }
    ]);

    const res = await request(app)
      .patch('/api/notifications/read-all')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    
    const unreadCount = await Notification.countDocuments({ user: managerId, isRead: false });
    expect(unreadCount).toBe(0);
  });
});
