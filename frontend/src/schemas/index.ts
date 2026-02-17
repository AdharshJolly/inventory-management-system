import { z } from 'zod';

export const supplierSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  contactPerson: z.string().min(2, 'Contact person must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(5, 'Invalid phone number'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
});

export const productSchema = z.object({
  sku: z.string().min(3, 'SKU must be at least 3 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  category: z.string().min(2, 'Category is required'),
  description: z.string().optional(),
  basePrice: z.coerce.number().positive('Price must be greater than 0'),
  supplier: z.string().min(1, 'Supplier is required'),
});

export const locationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  type: z.string().min(2, 'Type is required'), // e.g. Warehouse, Shelf, etc.
});

export type SupplierFormData = z.infer<typeof supplierSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type LocationFormData = z.infer<typeof locationSchema>;
