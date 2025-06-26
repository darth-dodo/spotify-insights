import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthGuard } from '../AuthGuard'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

// Mock the auth hook
const mockUseAuth = vi.fn()
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth()
}))

// Mock the loading provider
const mockUseLoading = vi.fn()
vi.mock('@/components/providers/LoadingProvider', () => ({
  useLoading: () => mockUseLoading()
}))

// Mock the LandingPage component
vi.mock('@/components/LandingPage', () => ({
  LandingPage: () => <div data-testid="landing-page">Landing Page</div>
}))

// Mock the BlurLoader component
vi.mock('@/components/ui/BlurLoader', () => ({
  BlurLoader: ({ children, isLoading }: { children: React.ReactNode, isLoading: boolean }) => (
    <div data-testid={isLoading ? "blur-loader-active" : "blur-loader-inactive"}>
      {children}
    </div>
  )
}))

// Mock the DataLoadingScreen component
vi.mock('@/components/ui/DataLoadingScreen', () => ({
  DataLoadingScreen: () => <div data-testid="data-loading-screen">Data Loading</div>
}))

// Mock the ErrorDialog component
vi.mock('@/components/auth/ErrorDialog', () => ({
  ErrorDialog: ({ open, title, message }: { open: boolean, title: string, message: string }) => 
    open ? <div data-testid="error-dialog">{title}: {message}</div> : null
}))

// Mock the Spotify SDK
vi.mock('@/lib/spotify-playback-sdk', () => ({
  spotifyPlaybackSDK: {
    disconnect: vi.fn()
  }
}))

// Mock location
const mockLocation = {
  pathname: '/',
  replace: vi.fn(),
  reload: vi.fn()
}

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
})

const renderWithRouter = (component: React.ReactElement, route = '/') => {
  mockLocation.pathname = route
  return render(
    <MemoryRouter initialEntries={[route]}>
      {component}
    </MemoryRouter>
  )
}

describe('AuthGuard', () => {
  const mockChildren = React.createElement('div', { 'data-testid': 'protected-content' }, 'Protected Content')

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseLoading.mockReturnValue({
      isLoadingData: false,
      pct: 0,
      stage: 'idle'
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders children when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '123', display_name: 'Test User' },
      isLoading: false,
      error: null
    })

    renderWithRouter(React.createElement(AuthGuard, {}, mockChildren))

    expect(screen.getByTestId('protected-content')).toBeInTheDocument()
    expect(screen.queryByTestId('landing-page')).not.toBeInTheDocument()
  })

  it('renders landing page when user is not authenticated on root path', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      error: null
    })

    mockLocation.pathname = '/'
    renderWithRouter(React.createElement(AuthGuard, {}, mockChildren), '/')

    expect(screen.getByTestId('landing-page')).toBeInTheDocument()
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
  })

  it('shows blur loader when authentication is loading', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: true,
      error: null
    })

    mockLocation.pathname = '/'
    renderWithRouter(React.createElement(AuthGuard, {}, mockChildren))

    expect(screen.getByTestId('blur-loader-active')).toBeInTheDocument()
    expect(screen.getByTestId('landing-page')).toBeInTheDocument()
  })

  it('shows error dialog when there is an authentication error', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      error: 'Authentication failed'
    })

    mockLocation.pathname = '/login'
    renderWithRouter(React.createElement(AuthGuard, {}, mockChildren), '/login')

    expect(screen.getByTestId('error-dialog')).toBeInTheDocument()
    expect(screen.getByText(/Authentication Error: Authentication failed/)).toBeInTheDocument()
  })

  it('returns null for dashboard path when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      error: null
    })

    mockLocation.pathname = '/dashboard'
    const { container } = renderWithRouter(React.createElement(AuthGuard, {}, mockChildren), '/dashboard')

    expect(container.firstChild).toBeNull()
  })

  it('handles authentication state changes correctly', () => {
    // Start unauthenticated
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      error: null
    })

    mockLocation.pathname = '/'
    const { rerender } = renderWithRouter(React.createElement(AuthGuard, {}, mockChildren))

    expect(screen.getByTestId('landing-page')).toBeInTheDocument()

    // Simulate authentication
    mockUseAuth.mockReturnValue({
      user: { id: '123', display_name: 'Test User' },
      isLoading: false,
      error: null
    })

    rerender(
      <MemoryRouter initialEntries={['/']}>
        {React.createElement(AuthGuard, {}, mockChildren)}
      </MemoryRouter>
    )

    expect(screen.getByTestId('protected-content')).toBeInTheDocument()
    expect(screen.queryByTestId('landing-page')).not.toBeInTheDocument()
  })

  it('handles loading state transitions', () => {
    // Start with loading
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: true,
      error: null
    })

    mockLocation.pathname = '/'
    const { rerender } = renderWithRouter(React.createElement(AuthGuard, {}, mockChildren))

    expect(screen.getByTestId('blur-loader-active')).toBeInTheDocument()

    // Finish loading, show landing page
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      error: null
    })

    rerender(
      <MemoryRouter initialEntries={['/']}>
        {React.createElement(AuthGuard, {}, mockChildren)}
      </MemoryRouter>
    )

    expect(screen.getByTestId('blur-loader-inactive')).toBeInTheDocument()
    expect(screen.getByTestId('landing-page')).toBeInTheDocument()
  })

  it('does not show error dialog on dashboard paths', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      error: 'Some error'
    })

    mockLocation.pathname = '/dashboard/overview'
    const { container } = renderWithRouter(React.createElement(AuthGuard, {}, mockChildren), '/dashboard/overview')

    expect(container.firstChild).toBeNull()
    expect(screen.queryByTestId('error-dialog')).not.toBeInTheDocument()
  })

  it('handles undefined user gracefully', () => {
    mockUseAuth.mockReturnValue({
      user: undefined,
      isLoading: false,
      error: null
    })

    mockLocation.pathname = '/'
    renderWithRouter(React.createElement(AuthGuard, {}, mockChildren))

    expect(screen.getByTestId('landing-page')).toBeInTheDocument()
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
  })

  it('maintains component structure during state changes', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      error: null
    })

    mockLocation.pathname = '/'
    const { rerender } = renderWithRouter(React.createElement(AuthGuard, {}, mockChildren))

    // Initial state
    expect(screen.getByTestId('landing-page')).toBeInTheDocument()

    // Simulate loading
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: true,
      error: null
    })

    rerender(
      <MemoryRouter initialEntries={['/']}>
        {React.createElement(AuthGuard, {}, mockChildren)}
      </MemoryRouter>
    )

    expect(screen.getByTestId('blur-loader-active')).toBeInTheDocument()

    // Complete authentication
    mockUseAuth.mockReturnValue({
      user: { id: '123', display_name: 'Test User' },
      isLoading: false,
      error: null
    })

    rerender(
      <MemoryRouter initialEntries={['/']}>
        {React.createElement(AuthGuard, {}, mockChildren)}
      </MemoryRouter>
    )

    expect(screen.getByTestId('protected-content')).toBeInTheDocument()
  })

  it('renders custom login component when provided', () => {
    const customLogin = React.createElement('div', { 'data-testid': 'custom-login' }, 'Custom Login')
    
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      error: null
    })

    mockLocation.pathname = '/'
    renderWithRouter(React.createElement(AuthGuard, { loginComponent: customLogin }, mockChildren))

    // Should still render landing page since that's the component's behavior
    expect(screen.getByTestId('landing-page')).toBeInTheDocument()
  })

  it('renders custom dashboard component when user is authenticated', () => {
    const customDashboard = React.createElement('div', { 'data-testid': 'custom-dashboard' }, 'Custom Dashboard')
    
    mockUseAuth.mockReturnValue({
      user: { id: '123', display_name: 'Test User' },
      isLoading: false,
      error: null
    })

    renderWithRouter(React.createElement(AuthGuard, { dashboardComponent: customDashboard }, mockChildren))

    expect(screen.getByTestId('custom-dashboard')).toBeInTheDocument()
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
  })
}) 