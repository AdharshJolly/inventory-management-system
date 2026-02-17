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
