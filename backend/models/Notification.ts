import mongoose, { Schema, Document } from 'mongoose';

export enum NotificationType {
  LOW_STOCK = 'LOW_STOCK',
  INFO = 'INFO',
  WARNING = 'WARNING',
  SUCCESS = 'SUCCESS'
}

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  message: string;
  type: NotificationType;
  link?: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: Object.values(NotificationType), 
    default: NotificationType.INFO 
  },
  link: { type: String },
  isRead: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Index for faster queries on unread notifications for a user
NotificationSchema.index({ user: 1, isRead: 1 });

export default mongoose.model<INotification>('Notification', NotificationSchema);
