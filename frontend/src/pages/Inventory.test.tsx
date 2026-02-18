import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Inventory from './Inventory';
import api from '../api/axios';
import { BrowserRouter } from 'react-router-dom';

// Mock the api
vi.mock('../api/axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

const mockInventory = [
  {
    _id: 'prod1',
    name: 'Product A',
    sku: 'SKU-A',
    totalQuantity: 100,
    totalMinLevel: 20,
    status: 'In Stock',
    locations: [
      { locationName: 'Warehouse 1', quantity: 60 },
      { locationName: 'Warehouse 2', quantity: 40 }
    ]
  },
  {
    _id: 'prod2',
    name: 'Product B',
    sku: 'SKU-B',
    totalQuantity: 5,
    totalMinLevel: 10,
    status: 'Low Stock',
    locations: [
      { locationName: 'Warehouse 1', quantity: 5 }
    ]
  }
];

describe('Inventory Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders inventory list after fetching data', async () => {
    (api.get as any).mockResolvedValue({ data: mockInventory });

    render(
      <BrowserRouter>
        <Inventory />
      </BrowserRouter>
    );

    expect(screen.getByText(/Inventory Breakdown/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Product A')).toBeInTheDocument();
      expect(screen.getByText('SKU-A')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('In Stock')).toBeInTheDocument();
      
      expect(screen.getByText('Product B')).toBeInTheDocument();
      expect(screen.getByText('Low Stock')).toBeInTheDocument();
    });
  });

  it('expands row to show location details on click', async () => {
    (api.get as any).mockResolvedValue({ data: mockInventory });

    render(
      <BrowserRouter>
        <Inventory />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Product A')).toBeInTheDocument();
    });

    // Initially location details should not be visible
    expect(screen.queryByText('Warehouse 1')).not.toBeInTheDocument();

    // Click to expand
    fireEvent.click(screen.getByText('Product A'));

    // Now location details should be visible
    expect(screen.getByText('Warehouse 1')).toBeInTheDocument();
    expect(screen.getByText('60')).toBeInTheDocument();
    expect(screen.getByText('Warehouse 2')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
  });

  it('filters inventory based on search input', async () => {
    (api.get as any).mockResolvedValue({ data: mockInventory });

    render(
      <BrowserRouter>
        <Inventory />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Product A')).toBeInTheDocument();
      expect(screen.getByText('Product B')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search inventory/i);
    fireEvent.change(searchInput, { target: { value: 'Product B' } });

    expect(screen.queryByText('Product A')).not.toBeInTheDocument();
    expect(screen.getByText('Product B')).toBeInTheDocument();
  });

  it('shows empty state when no results match search', async () => {
    (api.get as any).mockResolvedValue({ data: mockInventory });

    render(
      <BrowserRouter>
        <Inventory />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Product A')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search inventory/i);
    fireEvent.change(searchInput, { target: { value: 'Non-existent' } });

    expect(screen.getByText(/No inventory data found/i)).toBeInTheDocument();
  });
});
