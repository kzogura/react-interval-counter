import { useState, useRef, useEffect } from 'react'

export interface UseIntervalCounterOptions {
  initialValue?: number
  step?: number
  interval?: number
  autoStart?: boolean
}

export interface UseIntervalCounterReturn {
  count: number
  isRunning: boolean
  start: () => void
  stop: () => void
  reset: () => void
}

export function useIntervalCounter(
  options?: UseIntervalCounterOptions
): UseIntervalCounterReturn {
  const initialValue = options?.initialValue ?? 0

  // Req 6.1: fallback interval to 1000 if <= 0 or NaN
  const rawInterval = options?.interval ?? 1000
  const interval = !rawInterval || rawInterval <= 0 || isNaN(rawInterval) ? 1000 : rawInterval

  // Req 6.2: fallback step to 1 if === 0
  const rawStep = options?.step ?? 1
  const step = rawStep === 0 ? 1 : rawStep

  const autoStart = options?.autoStart ?? false

  const [count, setCount] = useState<number>(initialValue)
  const [isRunning, setIsRunning] = useState<boolean>(false)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isRunningRef = useRef<boolean>(false)
  // Keep latest interval/step accessible inside timer callback without stale closure
  const intervalRef = useRef<number>(interval)
  const stepRef = useRef<number>(step)

  intervalRef.current = interval
  stepRef.current = step

  function tick() {
    setCount(prev => prev + stepRef.current)
  }

  function start() {
    if (isRunningRef.current) return
    isRunningRef.current = true
    setIsRunning(true)
    timerRef.current = setInterval(tick, intervalRef.current)
  }

  function stop() {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    isRunningRef.current = false
    setIsRunning(false)
  }

  function reset() {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    isRunningRef.current = false
    setCount(initialValue)
    setIsRunning(false)
  }

  // Restart timer when interval changes while running
  useEffect(() => {
    if (isRunningRef.current) {
      if (timerRef.current !== null) clearInterval(timerRef.current)
      timerRef.current = setInterval(tick, interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interval])

  useEffect(() => {
    if (autoStart) start()
    return () => {
      if (timerRef.current !== null) clearInterval(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { count, isRunning, start, stop, reset }
}
