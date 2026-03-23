import { renderHook, act } from '@testing-library/react'
import * as fc from 'fast-check'
import { useIntervalCounter } from '../useIntervalCounter'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useIntervalCounter property tests', () => {
  /**
   * 4.3.1: After n intervals, count === initialValue + step * n
   * Validates: Requirements 1.1
   */
  it('count equals initialValue + step * n after n intervals', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10 }),    // n
        fc.integer({ min: 1, max: 100 }),   // step
        fc.integer({ min: 100, max: 2000 }), // interval
        fc.integer({ min: -100, max: 100 }), // initialValue
        (n, step, interval, initialValue) => {
          const { result, unmount } = renderHook(() =>
            useIntervalCounter({ initialValue, step, interval })
          )

          act(() => {
            result.current.start()
          })

          act(() => {
            vi.advanceTimersByTime(interval * n)
          })

          const expected = initialValue + step * n
          const actual = result.current.count

          unmount()

          return actual === expected
        }
      ),
      { numRuns: 20 }
    )
  })

  /**
   * 4.3.2: reset() is idempotent: calling reset() multiple times always results in
   * count === initialValue and isRunning === false
   * Validates: Requirements 3.5
   */
  it('reset() is idempotent', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -100, max: 100 }), // initialValue
        fc.integer({ min: 1, max: 100 }),    // step
        fc.integer({ min: 100, max: 2000 }), // interval
        fc.integer({ min: 1, max: 5 }),      // number of reset calls
        (initialValue, step, interval, resetCount) => {
          const { result, unmount } = renderHook(() =>
            useIntervalCounter({ initialValue, step, interval })
          )

          act(() => {
            result.current.start()
            vi.advanceTimersByTime(interval * 3)
          })

          act(() => {
            for (let i = 0; i < resetCount; i++) {
              result.current.reset()
            }
          })

          const countOk = result.current.count === initialValue
          const runningOk = result.current.isRunning === false

          unmount()

          return countOk && runningOk
        }
      ),
      { numRuns: 20 }
    )
  })
})
