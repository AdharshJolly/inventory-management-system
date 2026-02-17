import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  sku: string;
  name: string;
  category: string;
  description: string;
  basePrice: number;
  supplier: mongoose.Types.ObjectId;
}

const ProductSchema: Schema = new Schema({
  sku: { type: String, required: [true, 'Please add a unique SKU'], unique: true, trim: true },
  name: { type: String, required: [true, 'Please add a product name'], trim: true },
  category: { type: String, trim: true },
  description: { type: String, trim: true },
  basePrice: { type: Number, default: 0 },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true }
}, {
  timestamps: true
});

export default mongoose.model<IProduct>('Product', ProductSchema);
