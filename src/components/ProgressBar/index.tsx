import React from 'react';
import styles from './index.module.sass';

interface ProgressBarProps {
  progress: number; // 0 dan 100 gacha bo'lgan qiymat
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className={styles.container}>
    <div className={styles.progressBarContainer}>
      <div
        className={styles.progressBar}
        style={{ width: `${progress}%` }}
      ></div>
      <span className={styles.progressLabel}>{`${progress}%`}</span>
    </div>
    </div>
  );
};

export default ProgressBar;
