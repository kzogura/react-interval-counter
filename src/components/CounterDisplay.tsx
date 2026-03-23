import React from 'react'
import styles from './IntervalCounter.module.css'

interface CounterDisplayProps {
  count: number
}

const CounterDisplay = React.memo(function CounterDisplay({ count }: CounterDisplayProps) {
  return (
    <div className={styles.displayGroup}>
      <div className={styles.displayRow}>
        <span className={styles.displayLabel}>DEC</span>
        <span className={styles.display}>{count}</span>
      </div>
      <div className={styles.displayRow}>
        <span className={styles.displayLabel}>HEX</span>
        <span className={styles.display}>
          {count < 0 ? '-' : ''}{Math.abs(count).toString(16).toUpperCase()}
        </span>
      </div>
      <div className={styles.displayRow}>
        <span className={styles.displayLabel}>BIN</span>
        <span className={`${styles.display} ${styles.displayBin}`}>
          {count < 0 ? '-' : ''}{Math.abs(count).toString(2)}
        </span>
      </div>
    </div>
  )
})

export default CounterDisplay
