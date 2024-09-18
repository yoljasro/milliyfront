import React from 'react';
import styles from './index.module.sass';

const Balls: React.FC = () => {
  const handleOrderClick = () => {
    const targetElement = document.getElementById('orderSection');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.ballsContainer}>
      <div className={styles.card}>
        <div className={styles.cardContent}>
          <div className={styles.points}>0 баллов</div>
        </div>
      </div>
<a className={styles.link} href={'#products'}>
      <button  className={styles.button} onClick={handleOrderClick}>
        Выбрать и заказать
      </button>
      </a>
    </div>
  );
};

export default Balls;
