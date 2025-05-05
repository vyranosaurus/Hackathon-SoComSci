import React from 'react';
import styles from './TailwindTest.module.css';

const TailwindTest = () => {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>
        <div className={styles.circle}>
          <span><strong>T</strong></span>
        </div>
      </div>
      <div>
        <div className={styles.label}>Modern Styling</div>
        <p className={styles.description}>Using CSS Modules</p>
      </div>
    </div>
  );
};

export default TailwindTest; 