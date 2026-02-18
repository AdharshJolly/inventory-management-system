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
      { stockId: 's1', locationName: 'Warehouse 1', quantity: 60, minLevel: 10 },
      { stockId: 's2', locationName: 'Warehouse 2', quantity: 40, minLevel: 5 }
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
      { stockId: 's3', locationName: 'Warehouse 1', quantity: 5, minLevel: 10 }
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
      // Both desktop and mobile views are rendered (one hidden by CSS)
      // Testing Library sees both
      expect(screen.getAllByText('Product A').length).toBeGreaterThan(0);
      expect(screen.getAllByText('SKU-A').length).toBeGreaterThan(0);
      expect(screen.getAllByText('100').length).toBeGreaterThan(0);
      expect(screen.getAllByText('In Stock').length).toBeGreaterThan(0);
      
      expect(screen.getAllByText('Product B').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Low Stock').length).toBeGreaterThan(0);
    });
  });

  it('expands row/card to show location details and alert levels', async () => {
    (api.get as any).mockResolvedValue({ data: mockInventory });

    render(
      <BrowserRouter>
        <Inventory />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByText('Product A').length).toBeGreaterThan(0);
    });

    // Initially location details should not be visible
    expect(screen.queryByText('Warehouse 1')).not.toBeInTheDocument();

    // Click to expand (first instance, likely mobile card or table row)
    fireEvent.click(screen.getAllByText('Product A')[0]);

    // Now location details and alert levels should be visible
    expect(screen.getAllByText('Warehouse 1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('60').length).toBeGreaterThan(0);
    
    // There might be multiple 5s or 10s if other products have those quantities
    // Check for the specific alert level text (supports both desktop and mobile versions)
    expect(screen.getAllByText(/Alert/i).length).toBeGreaterThan(0);
    
    expect(screen.getAllByText('Warehouse 2').length).toBeGreaterThan(0);
    expect(screen.getAllByText('40').length).toBeGreaterThan(0);
  });

  it('opens edit alert modal when clicking edit button', async () => {
    (api.get as any).mockResolvedValue({ data: mockInventory });

    render(
      <BrowserRouter>
        <Inventory />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByText('Product A').length).toBeGreaterThan(0);
    });

    // Click to expand
    fireEvent.click(screen.getAllByText('Product A')[0]);

    // Find and click the edit button
    const editButtons = screen.getAllByTitle(/Edit Alert Level/i);
    fireEvent.click(editButtons[0]);

    // Check if modal title is visible
    expect(screen.getByText(/Set Low Stock Alert Level/i)).toBeInTheDocument();
    // Modal + Page content
    expect(screen.getAllByText(/Product A/i).length).toBeGreaterThan(1);
  });

  it('filters inventory based on search input', async () => {
    (api.get as any).mockResolvedValue({ data: mockInventory });

    render(
      <BrowserRouter>
        <Inventory />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByText('Product A').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Product B').length).toBeGreaterThan(0);
    });

    const searchInput = screen.getByPlaceholderText(/Search inventory/i);
    fireEvent.change(searchInput, { target: { value: 'Product B' } });

    expect(screen.queryByText('Product A')).not.toBeInTheDocument();
    expect(screen.getAllByText('Product B').length).toBeGreaterThan(0);
  });

  it('shows empty state when no results match search', async () => {
    (api.get as any).mockResolvedValue({ data: mockInventory });

    render(
      <BrowserRouter>
        <Inventory />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByText('Product A').length).toBeGreaterThan(0);
    });

    const searchInput = screen.getByPlaceholderText(/Search inventory/i);
    fireEvent.change(searchInput, { target: { value: 'Non-existent' } });

    expect(screen.getByText(/No inventory data found/i)).toBeInTheDocument();
  });
});
