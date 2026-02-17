import mongoose, { Schema, Document } from 'mongoose';

export interface IStock extends Document {
  product: mongoose.Types.ObjectId;
  location: mongoose.Types.ObjectId;
  currentQuantity: number;
  minLevel: number;
}

const StockSchema: Schema = new Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  currentQuantity: { type: Number, default: 0 },
  minLevel: { type: Number, default: 5 },
}, {
  timestamps: true
});

// Composite unique index: product + location
StockSchema.index({ product: 1, location: 1 }, { unique: true });

export default mongoose.model<IStock>('Stock', StockSchema);
