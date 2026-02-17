import mongoose, { Schema, Document } from 'mongoose';

export interface ILocation extends Document {
  name: string;
  description: string;
  type: string; // e.g., 'Warehouse', 'Showroom', 'Shelf'
}

const LocationSchema: Schema = new Schema({
  name: { type: String, required: [true, 'Please add a location name'], unique: true, trim: true },
  description: { type: String, trim: true },
  type: { type: String, default: 'Warehouse', trim: true }
}, {
  timestamps: true
});

export default mongoose.model<ILocation>('Location', LocationSchema);
