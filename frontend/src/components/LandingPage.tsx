// src/components/LandingPage.tsx

import React, { useState } from 'react'
import styles from './LandingPage.module.css'

const LandingPage: React.FC = () => {
  const [data, setData] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:8000/documents')
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`)
      }

      const result = await response.json()
      setData(result.message || JSON.stringify(result))
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome to My App</h1>
        <p className={styles.subtitle}>Simple. Clean. Powerful.</p>

        <button className={styles.button} onClick={fetchData} disabled={loading}>
          {loading ? 'Loading...' : 'Get Backend Data'}
        </button>

        {error && <p className={styles.error}>❌ {error}</p>}
        {data && <p className={styles.result}>✅ {data}</p>}
      </div>
    </div>
  )
}

export default LandingPage
