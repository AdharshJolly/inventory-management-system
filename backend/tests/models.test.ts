import { describe, it, expect } from 'bun:test';
import './setup';
import mongoose from 'mongoose';
import Supplier from '../models/Supplier';
import Product from '../models/Product';
import User from '../models/User';
import Stock from '../models/Stock';
import Location from '../models/Location';
import Transaction, { TransactionType } from '../models/Transaction';

describe('Mongoose Models', () => {
  it('should create a valid supplier', async () => {
    const supplierData = {
      name: 'Global Supplies Inc',
      contactPerson: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      address: '123 Supply Lane'
    };
    const supplier = new Supplier(supplierData);
    const savedSupplier = await supplier.save();
    expect(savedSupplier._id).toBeDefined();
    expect(savedSupplier.name).toBe(supplierData.name);
  });

  it('should fail to create a supplier without required fields', async () => {
    const supplier = new Supplier({});
    let err: any;
    try {
      await supplier.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.name).toBeDefined();
  });

  it('should create a valid product with a supplier reference', async () => {
    const supplier = await new Supplier({ name: 'Test Supplier' }).save();
    const productData = {
      sku: 'SKU123',
      name: 'Gadget A',
      category: 'Electronics',
      description: 'A high-tech gadget',
      basePrice: 99.99,
      supplier: supplier._id
    };
    const product = new Product(productData);
    const savedProduct = await product.save();
    expect(savedProduct._id).toBeDefined();
    expect(savedProduct.sku).toBe(productData.sku);
  });

  it('should enforce unique SKU on products', async () => {
    const supplier = await new Supplier({ name: 'Test Supplier' }).save();
    await new Product({ sku: 'UNIQUE1', name: 'Item 1', supplier: supplier._id }).save();
    const duplicateProduct = new Product({ sku: 'UNIQUE1', name: 'Item 2', supplier: supplier._id });
    let err: any;
    try {
      await duplicateProduct.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.code).toBe(11000); // MongoDB duplicate key error code
  });

  it('should create a valid user with hashed password', async () => {
    const userData = {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123',
      role: 'warehouse-manager'
    };
    const user = new User(userData);
    const savedUser = await user.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.password).not.toBe(userData.password);
    
    const isMatch = await (savedUser as any).comparePassword(userData.password);
    expect(isMatch).toBe(true);
  });

  it('should create valid stock for a product-location pair', async () => {
    const supplier = await new Supplier({ name: 'Test Supplier' }).save();
    const location = await new Location({ name: 'Warehouse A' }).save();
    const product = await new Product({ sku: 'P1', name: 'P1', supplier: supplier._id }).save();
    const stockData = {
      product: product._id,
      location: location._id,
      currentQuantity: 100,
      minLevel: 10
    };
    const stock = new Stock(stockData);
    const savedStock = await stock.save();
    expect(savedStock._id).toBeDefined();
    expect(savedStock.currentQuantity).toBe(100);
  });

  it('should create a valid transaction', async () => {
    const user = await new User({ name: 'User', email: 'u@e.com', password: 'password' }).save();
    const supplier = await new Supplier({ name: 'S' }).save();
    const location = await new Location({ name: 'Loc' }).save();
    const product = await new Product({ sku: 'P2', name: 'P2', supplier: supplier._id }).save();
    const transactionData = {
      product: product._id,
      location: location._id,
      type: TransactionType.IN,
      quantity: 50,
      user: user._id,
      notes: 'Initial stock'
    };
    const transaction = new Transaction(transactionData);
    const savedTransaction = await transaction.save();
    expect(savedTransaction._id).toBeDefined();
    expect(savedTransaction.type).toBe(TransactionType.IN);
  });
});
