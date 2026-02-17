import mongoose, { Schema, Document } from 'mongoose';

export enum TransactionType {
  IN = 'IN',
  OUT = 'OUT'
}

export interface ITransaction extends Document {
  product: mongoose.Types.ObjectId;
  type: TransactionType;
  quantity: number;
  user: mongoose.Types.ObjectId;
  notes: string;
}

const TransactionSchema: Schema = new Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  type: { type: String, enum: ['IN', 'OUT'], required: true },
  quantity: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  notes: { type: String, trim: true }
}, {
  timestamps: true
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
