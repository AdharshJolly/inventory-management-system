import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const fixIndexes = async () => {
  try {
    console.log('Connecting to MongoDB...');
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/inventory_db';
    await mongoose.connect(uri);
    
    const db = mongoose.connection.db;
    if (!db) throw new Error('Database not found');

    const collection = db.collection('stocks');
    
    console.log('Current indexes:');
    const indexes = await collection.indexes();
    console.log(JSON.stringify(indexes, null, 2));

    // Look for the unique index on 'product' only
    const oldIndex = indexes.find(idx => idx.name === 'product_1' || (idx.key.product === 1 && Object.keys(idx.key).length === 1));

    if (oldIndex) {
      console.log(`Dropping old unique index: ${oldIndex.name}...`);
      await collection.dropIndex(oldIndex.name);
      console.log('Old index dropped successfully.');
    } else {
      console.log('No conflicting single-product unique index found.');
    }

    console.log('Ensuring new composite index (product_1_location_1)...');
    await collection.createIndex({ product: 1, location: 1 }, { unique: true });
    
    console.log('Index maintenance complete.');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing indexes:', error);
    process.exit(1);
  }
};

fixIndexes();
