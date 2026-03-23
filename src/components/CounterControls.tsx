import { useCallback } from 'react'
import styles from './IntervalCounter.module.css'

interface CounterControlsProps {
  isRunning: boolean
  onStart: () => void
  onStop: () => void
  onReset: () => void
}

export default function CounterControls({ isRunning, onStart, onStop, onReset }: CounterControlsProps) {
  const handleStart = useCallback(() => onStart(), [onStart])
  const handleStop = useCallback(() => onStop(), [onStop])
  const handleReset = useCallback(() => onReset(), [onReset])

  return (
    <div className={styles.controls}>
      <button className={`${styles.button} ${styles.startButton}`} onClick={handleStart} disabled={isRunning}>Start</button>
      <button className={`${styles.button} ${styles.stopButton}`} onClick={handleStop} disabled={!isRunning}>Stop</button>
      <button className={`${styles.button} ${styles.resetButton}`} onClick={handleReset}>Reset</button>
    </div>
  )
}
