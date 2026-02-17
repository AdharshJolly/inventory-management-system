import mongoose, { Schema, Document } from 'mongoose';

export interface IStock extends Document {
  product: mongoose.Types.ObjectId;
  currentQuantity: number;
  minLevel: number;
  location: string;
}

const StockSchema: Schema = new Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, unique: true },
  currentQuantity: { type: Number, default: 0 },
  minLevel: { type: Number, default: 5 },
  location: { type: String, trim: true }
}, {
  timestamps: true
});

export default mongoose.model<IStock>('Stock', StockSchema);
