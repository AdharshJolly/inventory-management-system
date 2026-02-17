import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';

// Mock the api
vi.mock('../api/axios', () => ({
  default: {
    get: vi.fn(),
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() },
    },
  },
}));

const TestComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  return (
    <div>
      <div data-testid="user">{user?.name || 'no user'}</div>
      <div data-testid="auth">{isAuthenticated ? 'true' : 'false'}</div>
      <button onClick={() => login('token123', { _id: '1', name: 'Test', email: 't@t.com', role: 'store-clerk' })}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('provides initial state', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user')).toHaveTextContent('no user');
    expect(screen.getByTestId('auth')).toHaveTextContent('false');
  });

  it('updates state on login', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      screen.getByText('Login').click();
    });

    expect(screen.getByTestId('user')).toHaveTextContent('Test');
    expect(screen.getByTestId('auth')).toHaveTextContent('true');
    expect(localStorage.getItem('token')).toBe('token123');
  });

  it('updates state on logout', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      screen.getByText('Login').click();
    });

    act(() => {
      screen.getByText('Logout').click();
    });

    expect(screen.getByTestId('user')).toHaveTextContent('no user');
    expect(screen.getByTestId('auth')).toHaveTextContent('false');
    expect(localStorage.getItem('token')).toBeNull();
  });
});
