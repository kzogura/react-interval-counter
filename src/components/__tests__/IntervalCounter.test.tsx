import { render, screen, fireEvent, act } from '@testing-library/react'
import IntervalCounter from '../IntervalCounter'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('IntervalCounter', () => {
  // 4.2.1: Initial display shows initialValue
  it('shows initialValue on initial render', () => {
    render(<IntervalCounter initialValue={42} />)
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  // 4.2.2: After clicking Start, count increases
  it('increases count after clicking Start', () => {
    render(<IntervalCounter initialValue={0} step={1} interval={1000} />)
    const startBtn = screen.getByRole('button', { name: /start/i })
    act(() => {
      fireEvent.click(startBtn)
    })
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  // 4.2.3: After clicking Stop, count stops increasing
  it('stops count after clicking Stop', () => {
    render(<IntervalCounter initialValue={0} step={1} interval={1000} />)
    const startBtn = screen.getByRole('button', { name: /start/i })
    act(() => {
      fireEvent.click(startBtn)
    })
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    const stopBtn = screen.getByRole('button', { name: /stop/i })
    act(() => {
      fireEvent.click(stopBtn)
    })
    const countAfterStop = screen.getByText('2').textContent
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(screen.getByText('2').textContent).toBe(countAfterStop)
  })

  // 4.2.4: After clicking Reset, count returns to initial value
  it('returns count to initialValue after clicking Reset', () => {
    render(<IntervalCounter initialValue={5} step={1} interval={1000} />)
    const startBtn = screen.getByRole('button', { name: /start/i })
    act(() => {
      fireEvent.click(startBtn)
    })
    act(() => {
      vi.advanceTimersByTime(4000)
    })
    const resetBtn = screen.getByRole('button', { name: /reset/i })
    act(() => {
      fireEvent.click(resetBtn)
    })
    expect(screen.getByText('5')).toBeInTheDocument()
  })
})
