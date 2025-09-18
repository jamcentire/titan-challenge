// src/components/LandingPage.tsx

import React from 'react'
import styles from './LandingPage.module.css'

interface LandingPageProps {
  onStart?: () => void
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome to My App</h1>
        <p className={styles.subtitle}>Simple. Clean. Powerful.</p>
        <button className={styles.button} onClick={onStart}>
          Get Started
        </button>
      </div>
    </div>
  )
}

export default LandingPage
