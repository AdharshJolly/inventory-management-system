import mongoose, { Schema, Document } from 'mongoose';

export interface ISupplier extends Document {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
}

const SupplierSchema: Schema = new Schema({
  name: { type: String, required: [true, 'Please add a supplier name'], trim: true },
  contactPerson: { type: String, trim: true },
  email: { type: String, trim: true },
  phone: { type: String, trim: true },
  address: { type: String, trim: true }
}, {
  timestamps: true
});

export default mongoose.model<ISupplier>('Supplier', SupplierSchema);
