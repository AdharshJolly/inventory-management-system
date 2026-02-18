export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'warehouse-manager' | 'procurement-officer' | 'store-clerk';
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface StockLocationBreakdown {
  locationName: string;
  quantity: number;
}

export interface ProductStockBreakdown {
  _id: string;
  name: string;
  sku: string;
  totalQuantity: number;
  totalMinLevel: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  locations: StockLocationBreakdown[];
}
