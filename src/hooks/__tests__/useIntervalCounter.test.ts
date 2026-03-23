import { renderHook, act } from '@testing-library/react'
import { useIntervalCounter } from '../useIntervalCounter'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useIntervalCounter', () => {
  // 4.1.1: After start(), isRunning === true
  it('sets isRunning to true after start()', () => {
    const { result } = renderHook(() => useIntervalCounter())
    act(() => {
      result.current.start()
    })
    expect(result.current.isRunning).toBe(true)
  })

  // 4.1.2: After stop(), isRunning === false and count does not change
  it('sets isRunning to false after stop() and count does not change', () => {
    const { result } = renderHook(() => useIntervalCounter({ interval: 1000, step: 1 }))
    act(() => {
      result.current.start()
    })
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    const countBeforeStop = result.current.count
    act(() => {
      result.current.stop()
    })
    expect(result.current.isRunning).toBe(false)
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(result.current.count).toBe(countBeforeStop)
  })

  // 4.1.3: After reset(), count === initialValue and isRunning === false
  it('resets count to initialValue and sets isRunning to false after reset()', () => {
    const { result } = renderHook(() => useIntervalCounter({ initialValue: 10, interval: 1000, step: 1 }))
    act(() => {
      result.current.start()
    })
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    act(() => {
      result.current.reset()
    })
    expect(result.current.count).toBe(10)
    expect(result.current.isRunning).toBe(false)
  })

  // 4.1.4: On unmount, timer is cleared (no React warnings)
  it('clears timer on unmount without React warnings', () => {
    const { result, unmount } = renderHook(() => useIntervalCounter({ interval: 1000 }))
    act(() => {
      result.current.start()
    })
    // Unmount while running — should not throw or warn
    expect(() => {
      unmount()
      act(() => {
        vi.advanceTimersByTime(3000)
      })
    }).not.toThrow()
  })

  // 4.1.5: Double start() call does not duplicate timer
  it('does not duplicate timer on double start()', () => {
    const { result } = renderHook(() => useIntervalCounter({ interval: 1000, step: 1 }))
    act(() => {
      result.current.start()
      result.current.start()
    })
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    // If timer were duplicated, count would be 6 instead of 3
    expect(result.current.count).toBe(3)
  })
})
