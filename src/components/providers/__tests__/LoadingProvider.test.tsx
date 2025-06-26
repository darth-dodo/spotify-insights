import React from 'react'
import { render, renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { LoadingProvider, useLoading } from '../LoadingProvider'

// Mock console methods to avoid noise in tests
const mockConsole = {
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn()
}

beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(mockConsole.log)
  vi.spyOn(console, 'warn').mockImplementation(mockConsole.warn)
  vi.spyOn(console, 'error').mockImplementation(mockConsole.error)
})

afterEach(() => {
  vi.restoreAllMocks()
})

const TestComponent = ({ onLoadingChange }: { onLoadingChange?: (loading: any) => void }) => {
  const loading = useLoading()
  
  React.useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(loading)
    }
  }, [loading, onLoadingChange])

  return (
    <div data-testid="test-component">
      <span data-testid="is-loading-data">{loading.isLoadingData.toString()}</span>
      <span data-testid="pct">{loading.pct}</span>
      <span data-testid="stage">{loading.stage}</span>
    </div>
  )
}

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <LoadingProvider>
      {component}
    </LoadingProvider>
  )
}

describe('LoadingProvider', () => {
  describe('useLoading hook', () => {
    it('provides initial loading state', () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: LoadingProvider
      })

      expect(result.current.isLoadingData).toBe(false)
      expect(result.current.pct).toBe(0)
      expect(result.current.stage).toBe('idle')
      expect(result.current.error).toBe(null)
    })

    it('throws error when used outside provider', () => {
      // Suppress console error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      expect(() => {
        renderHook(() => useLoading())
      }).toThrow('useLoading must be used within LoadingProvider')

      consoleSpy.mockRestore()
    })

    it('provides setStage function to update stage', () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: LoadingProvider
      })

      expect(typeof result.current.setStage).toBe('function')
    })

    it('provides bump function to update progress', () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: LoadingProvider
      })

      expect(typeof result.current.bump).toBe('function')
    })

    it('provides setIsLoadingData function to control loading state', () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: LoadingProvider
      })

      expect(typeof result.current.setIsLoadingData).toBe('function')
    })

    it('provides setError function to handle errors', () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: LoadingProvider
      })

      expect(typeof result.current.setError).toBe('function')
    })
  })

  describe('loading state management', () => {
    it('updates isLoadingData when setIsLoadingData is called', () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: LoadingProvider
      })

      act(() => {
        result.current.setIsLoadingData(true)
      })

      expect(result.current.isLoadingData).toBe(true)

      act(() => {
        result.current.setIsLoadingData(false)
      })

      expect(result.current.isLoadingData).toBe(false)
    })

    it('updates stage and automatically sets progress when setStage is called', () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: LoadingProvider
      })

      act(() => {
        result.current.setStage('oauth')
      })

      expect(result.current.stage).toBe('oauth')
      expect(result.current.pct).toBe(10)
      expect(result.current.isLoadingData).toBe(true)

      act(() => {
        result.current.setStage('profile')
      })

      expect(result.current.stage).toBe('profile')
      expect(result.current.pct).toBe(30)
      expect(result.current.isLoadingData).toBe(true)
    })

    it('updates progress with bump function', () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: LoadingProvider
      })

      act(() => {
        result.current.bump(25)
      })

      expect(result.current.pct).toBe(25)

      act(() => {
        result.current.bump(30)
      })

      expect(result.current.pct).toBe(55)
    })

    it('handles different loading stages correctly', () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: LoadingProvider
      })

      const stages = ['oauth', 'profile', 'library', 'idle'] as const

      stages.forEach((stage) => {
        act(() => {
          result.current.setStage(stage)
        })

        expect(result.current.stage).toBe(stage)

        // Each stage should have appropriate progress
        if (stage === 'oauth') {
          expect(result.current.pct).toBe(10)
          expect(result.current.isLoadingData).toBe(true)
        } else if (stage === 'profile') {
          expect(result.current.pct).toBeGreaterThanOrEqual(30)
          expect(result.current.isLoadingData).toBe(true)
        } else if (stage === 'library') {
          expect(result.current.pct).toBeGreaterThanOrEqual(30)
          expect(result.current.isLoadingData).toBe(true)
        } else if (stage === 'idle') {
          expect(result.current.pct).toBe(0)
          expect(result.current.isLoadingData).toBe(false)
        }
      })
    })

    it('completes loading when reaching 100% progress', () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: LoadingProvider
      })

      act(() => {
        result.current.setStage('oauth') // Sets to 10%
        result.current.bump(90) // Should reach 100%
      })

      expect(result.current.pct).toBe(100)
      expect(result.current.isLoadingData).toBe(false)
    })

    it('handles error state management', () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: LoadingProvider
      })

      act(() => {
        result.current.setError('Test error')
      })

      expect(result.current.error).toBe('Test error')

      act(() => {
        result.current.setError(null)
      })

      expect(result.current.error).toBe(null)
    })

    it('clears errors when progressing to new stages', () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: LoadingProvider
      })

      act(() => {
        result.current.setError('Test error')
      })

      expect(result.current.error).toBe('Test error')

      act(() => {
        result.current.setStage('oauth')
      })

      expect(result.current.error).toBe(null)
    })
  })

  describe('component integration', () => {
    it('provides loading state to child components', () => {
      let capturedLoading: any = null
      const onLoadingChange = (loading: any) => {
        capturedLoading = loading
      }

      renderWithProvider(<TestComponent onLoadingChange={onLoadingChange} />)

      expect(capturedLoading).toBeTruthy()
      expect(capturedLoading.isLoadingData).toBe(false)
      expect(capturedLoading.pct).toBe(0)
      expect(capturedLoading.stage).toBe('idle')
      expect(capturedLoading.error).toBe(null)
    })

    it('updates child components when loading state changes', () => {
      let capturedLoading: any = null
      const onLoadingChange = (loading: any) => {
        capturedLoading = loading
      }

      const { rerender } = renderWithProvider(
        <TestComponent onLoadingChange={onLoadingChange} />
      )

      // Initial state
      expect(capturedLoading.isLoadingData).toBe(false)

      // Simulate loading state change through hook
      const TestWrapper = () => {
        const loading = useLoading()
        
        React.useEffect(() => {
          loading.setStage('oauth')
          loading.bump(15)
        }, [])

        return <TestComponent onLoadingChange={onLoadingChange} />
      }

      rerender(
        <LoadingProvider>
          <TestWrapper />
        </LoadingProvider>
      )

      // Should reflect updated state
      expect(capturedLoading.isLoadingData).toBe(true)
      expect(capturedLoading.pct).toBe(25) // 10 from oauth + 15 from bump
      expect(capturedLoading.stage).toBe('oauth')
    })

    it('supports multiple consumers of the context', () => {
      const states: any[] = []
      
      const Consumer1 = () => {
        const loading = useLoading()
        React.useEffect(() => {
          states.push({ component: 'consumer1', ...loading })
        })
        return <div data-testid="consumer1">Consumer 1</div>
      }

      const Consumer2 = () => {
        const loading = useLoading()
        React.useEffect(() => {
          states.push({ component: 'consumer2', ...loading })
        })
        return <div data-testid="consumer2">Consumer 2</div>
      }

      renderWithProvider(
        <>
          <Consumer1 />
          <Consumer2 />
        </>
      )

      // Both consumers should have access to the same state
      const consumer1State = states.find(s => s.component === 'consumer1')
      const consumer2State = states.find(s => s.component === 'consumer2')

      expect(consumer1State).toBeTruthy()
      expect(consumer2State).toBeTruthy()
      expect(consumer1State.isLoadingData).toBe(consumer2State.isLoadingData)
      expect(consumer1State.pct).toBe(consumer2State.pct)
      expect(consumer1State.stage).toBe(consumer2State.stage)
    })
  })

  describe('edge cases and error handling', () => {
    it('handles rapid state changes without issues', () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: LoadingProvider
      })

      act(() => {
        // Rapid fire state changes
        result.current.setIsLoadingData(true)
        result.current.setStage('oauth')
        result.current.bump(10)
        result.current.setStage('profile')
        result.current.setIsLoadingData(false)
        result.current.setIsLoadingData(true)
        result.current.bump(70)
      })

      // Should end up in the final state
      expect(result.current.isLoadingData).toBe(false) // bump to 100% should set this false
      expect(result.current.pct).toBe(100)
      expect(result.current.stage).toBe('profile')
    })

    it('handles boundary values for progress', () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: LoadingProvider
      })

      // Test 0%
      act(() => {
        result.current.setStage('idle')
      })
      expect(result.current.pct).toBe(0)

      // Test 100%
      act(() => {
        result.current.bump(100)
      })
      expect(result.current.pct).toBe(100)

      // Test that bump doesn't exceed 100%
      act(() => {
        result.current.bump(50)
      })
      expect(result.current.pct).toBe(100) // Should stay at 100
    })

    it('handles stage transitions correctly', () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: LoadingProvider
      })

      act(() => {
        result.current.setStage('profile') // Should set to 30%
      })
      expect(result.current.pct).toBe(30)

      act(() => {
        result.current.setStage('oauth') // Should set to 10%
      })
      expect(result.current.pct).toBe(10)

      act(() => {
        result.current.bump(25) // Now at 35%
        result.current.setStage('profile') // Should keep higher value
      })
      expect(result.current.pct).toBe(35) // Should maintain higher progress
    })

    it('maintains state consistency across re-renders', () => {
      let renderCount = 0
      const capturedStates: any[] = []

      const TestComponent = () => {
        renderCount++
        const loading = useLoading()
        capturedStates.push({ render: renderCount, ...loading })
        return <div>Render #{renderCount}</div>
      }

      const { rerender } = renderWithProvider(<TestComponent />)

      // Force re-renders
      rerender(
        <LoadingProvider>
          <TestComponent />
        </LoadingProvider>
      )
      
      rerender(
        <LoadingProvider>
          <TestComponent />
        </LoadingProvider>
      )

      // All renders should have consistent state
      expect(capturedStates.length).toBeGreaterThan(1)
      const firstState = capturedStates[0]
      capturedStates.forEach(state => {
        expect(state.isLoadingData).toBe(firstState.isLoadingData)
        expect(state.pct).toBe(firstState.pct)
        expect(state.stage).toBe(firstState.stage)
      })
    })
  })

  describe('realistic usage scenarios', () => {
    it('simulates a complete loading sequence', async () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: LoadingProvider
      })

      // Start loading
      act(() => {
        result.current.setStage('oauth')
      })
      expect(result.current.isLoadingData).toBe(true)
      expect(result.current.pct).toBe(10)
      expect(result.current.stage).toBe('oauth')

      // Progress through OAuth
      act(() => {
        result.current.bump(15)
      })
      expect(result.current.pct).toBe(25)

      // Profile loading
      act(() => {
        result.current.setStage('profile')
      })
      expect(result.current.pct).toBe(30)
      expect(result.current.stage).toBe('profile')

      // Progress through profile
      act(() => {
        result.current.bump(20)
      })
      expect(result.current.pct).toBe(50)

      // Library data loading
      act(() => {
        result.current.setStage('library')
      })
      expect(result.current.stage).toBe('library')

      // Complete loading
      act(() => {
        result.current.bump(50)
      })
      expect(result.current.pct).toBe(100)
      expect(result.current.isLoadingData).toBe(false) // Auto-set when reaching 100%

      // Reset to idle
      act(() => {
        result.current.setStage('idle')
      })
      expect(result.current.isLoadingData).toBe(false)
      expect(result.current.pct).toBe(0)
      expect(result.current.stage).toBe('idle')
    })

    it('handles loading interruption and restart', () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: LoadingProvider
      })

      // Start loading
      act(() => {
        result.current.setStage('oauth')
        result.current.bump(15)
      })

      expect(result.current.isLoadingData).toBe(true)
      expect(result.current.pct).toBe(25)

      // Interrupt loading
      act(() => {
        result.current.setStage('idle')
      })

      expect(result.current.isLoadingData).toBe(false)
      expect(result.current.pct).toBe(0)

      // Restart loading
      act(() => {
        result.current.setStage('oauth')
      })

      expect(result.current.isLoadingData).toBe(true)
      expect(result.current.pct).toBe(10)
      expect(result.current.stage).toBe('oauth')
    })

    it('handles error scenarios during loading', () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: LoadingProvider
      })

      // Start loading
      act(() => {
        result.current.setStage('oauth')
      })

      // Encounter an error
      act(() => {
        result.current.setError('Authentication failed')
      })

      expect(result.current.error).toBe('Authentication failed')
      expect(result.current.stage).toBe('oauth')

      // Retry - error should clear when progressing
      act(() => {
        result.current.setStage('profile')
      })

      expect(result.current.error).toBe(null)
      expect(result.current.stage).toBe('profile')
    })
  })
}) 