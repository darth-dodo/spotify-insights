import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { AuthGuard } from '../AuthGuard'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'

// Mock the auth hooks
const mockUseAuth = vi.fn()
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}))

// Mock the loading provider
const mockUseLoading = vi.fn()
vi.mock('@/components/providers/LoadingProvider', () => ({
  useLoading: () => mockUseLoading(),
}))

// Mock components
vi.mock('../LoginPage', () => ({
  LoginPage: () => React.createElement('div', { 'data-testid': 'login-page' }, 'Login Page'),
}))

vi.mock('@/components/ui/GlobalLoader', () => ({
  GlobalLoader: () => React.createElement('div', { 'data-testid': 'global-loader' }, 'Loading...'),
}))

describe('AuthGuard', () => {
  const mockChildren = React.createElement('div', { 'data-testid': 'protected-content' }, 'Protected Content')

  const renderWithRouter = (component: React.ReactElement) => {
    return render(React.createElement(MemoryRouter, {}, component))
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseLoading.mockReturnValue({
      isLoading: false,
      loadingMessage: '',
    })
  })

  it('renders children when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: 'test-user' },
    })

    renderWithRouter(React.createElement(AuthGuard, {}, mockChildren))

    expect(screen.getByTestId('protected-content')).toBeInTheDocument()
    expect(screen.queryByTestId('login-page')).not.toBeInTheDocument()
  })

  it('renders login page when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    })

    renderWithRouter(React.createElement(AuthGuard, {}, mockChildren))

    expect(screen.getByTestId('login-page')).toBeInTheDocument()
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
  })

  it('renders global loader when authentication is loading', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: null,
    })

    renderWithRouter(React.createElement(AuthGuard, {}, mockChildren))

    expect(screen.getByTestId('global-loader')).toBeInTheDocument()
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    expect(screen.queryByTestId('login-page')).not.toBeInTheDocument()
  })

  it('renders global loader when global loading is active', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: 'test-user' },
    })

    mockUseLoading.mockReturnValue({
      isLoading: true,
      loadingMessage: 'Loading data...',
    })

    renderWithRouter(React.createElement(AuthGuard, {}, mockChildren))

    expect(screen.getByTestId('global-loader')).toBeInTheDocument()
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
  })

  it('handles authentication state changes', async () => {
    // Start unauthenticated
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    })

    const { rerender } = renderWithRouter(React.createElement(AuthGuard, {}, mockChildren))

    expect(screen.getByTestId('login-page')).toBeInTheDocument()

    // Simulate authentication
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: 'test-user' },
    })

    rerender(React.createElement(MemoryRouter, {}, React.createElement(AuthGuard, {}, mockChildren)))

    await waitFor(() => {
      expect(screen.getByTestId('protected-content')).toBeInTheDocument()
    })
    expect(screen.queryByTestId('login-page')).not.toBeInTheDocument()
  })

  it('handles loading state transitions', async () => {
    // Start with loading
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: null,
    })

    const { rerender } = renderWithRouter(React.createElement(AuthGuard, {}, mockChildren))

    expect(screen.getByTestId('global-loader')).toBeInTheDocument()

    // Finish loading, show login
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    })

    rerender(React.createElement(MemoryRouter, {}, React.createElement(AuthGuard, {}, mockChildren)))

    await waitFor(() => {
      expect(screen.getByTestId('login-page')).toBeInTheDocument()
    })
    expect(screen.queryByTestId('global-loader')).not.toBeInTheDocument()
  })

  it('prioritizes auth loading over global loading', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: null,
    })

    mockUseLoading.mockReturnValue({
      isLoading: true,
      loadingMessage: 'Loading data...',
    })

    renderWithRouter(React.createElement(AuthGuard, {}, mockChildren))

    // Should show global loader (which handles both auth and global loading)
    expect(screen.getByTestId('global-loader')).toBeInTheDocument()
    expect(screen.queryByTestId('login-page')).not.toBeInTheDocument()
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
  })

  it('handles undefined user gracefully', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: undefined,
    })

    renderWithRouter(React.createElement(AuthGuard, {}, mockChildren))

    expect(screen.getByTestId('login-page')).toBeInTheDocument()
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
  })

  it('handles multiple children', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: 'test-user' },
    })

    const multipleChildren = [
      React.createElement('div', { key: 'child1', 'data-testid': 'child-1' }, 'Child 1'),
      React.createElement('div', { key: 'child2', 'data-testid': 'child-2' }, 'Child 2'),
    ]

    renderWithRouter(React.createElement(AuthGuard, {}, ...multipleChildren))

    expect(screen.getByTestId('child-1')).toBeInTheDocument()
    expect(screen.getByTestId('child-2')).toBeInTheDocument()
  })

  it('maintains component structure during state changes', async () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    })

    const { rerender } = renderWithRouter(React.createElement(AuthGuard, {}, mockChildren))

    // Initial state
    expect(screen.getByTestId('login-page')).toBeInTheDocument()

    // Simulate loading
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: null,
    })

    rerender(React.createElement(MemoryRouter, {}, React.createElement(AuthGuard, {}, mockChildren)))

    expect(screen.getByTestId('global-loader')).toBeInTheDocument()

    // Simulate successful auth
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: 'test-user' },
    })

    rerender(React.createElement(MemoryRouter, {}, React.createElement(AuthGuard, {}, mockChildren)))

    await waitFor(() => {
      expect(screen.getByTestId('protected-content')).toBeInTheDocument()
    })
  })
}) 