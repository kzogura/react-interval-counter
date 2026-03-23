import { useCallback, useState } from 'react'
import styles from './IntervalCounter.module.css'
import { useIntervalCounter } from '../hooks/useIntervalCounter'
import CounterDisplay from './CounterDisplay'
import CounterControls from './CounterControls'

const INTERVAL_OPTIONS = [
  { label: '10s',   value: 10000 },
  { label: '1s',    value: 1000  },
  { label: '100ms', value: 100   },
  { label: '10ms',  value: 10    },
  { label: '1ms',   value: 1     },
]

interface IntervalCounterProps {
  initialValue?: number
  step?: number
  interval?: number
  autoStart?: boolean
}

export default function IntervalCounter(props: IntervalCounterProps) {
  const [interval, setInterval] = useState(props.interval ?? 1000)
  const { count, isRunning, start, stop, reset } = useIntervalCounter({ ...props, interval })

  const handleStart = useCallback(() => start(), [start])
  const handleStop = useCallback(() => stop(), [stop])
  const handleReset = useCallback(() => reset(), [reset])

  return (
    <div className={styles.container}>
      <CounterDisplay count={count} />
      <div className={styles.intervalSelector}>
        <label htmlFor="interval-select" className={styles.intervalLabel}>Interval</label>
        <select
          id="interval-select"
          className={styles.select}
          value={interval}
          onChange={e => setInterval(Number(e.target.value))}
        >
          {INTERVAL_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <CounterControls
        isRunning={isRunning}
        onStart={handleStart}
        onStop={handleStop}
        onReset={handleReset}
      />
    </div>
  )
}
