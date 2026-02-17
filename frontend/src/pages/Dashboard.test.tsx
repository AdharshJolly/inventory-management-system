import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Dashboard from './Dashboard';
import api from '../api/axios';
import { BrowserRouter } from 'react-router-dom';

// Mock the api
vi.mock('../api/axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('Dashboard Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders stats and alerts after fetching data', async () => {
    const mockData = {
      totalProducts: 10,
      totalStockValue: 1500,
      lowStockAlerts: [
        { _id: '1', product: { name: 'Hammer', sku: 'H01' }, currentQuantity: 2, minLevel: 5 },
      ],
    };

    (api.get as any).mockResolvedValue({ data: mockData });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument(); // Total Products
      expect(screen.getByText('$1500.00')).toBeInTheDocument(); // Total Value
      expect(screen.getByText('Hammer')).toBeInTheDocument(); // Low stock alert
    });
  });

  it('handles error gracefully', async () => {
    (api.get as any).mockRejectedValue(new Error('Failed to fetch'));

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to load/i)).toBeInTheDocument();
    });
  });
});
