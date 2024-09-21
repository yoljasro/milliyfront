import React, { useEffect, useState } from 'react';
import styles from './index.module.sass';

// Telegram Web App orqali username olish uchun window obyektini declare qilamiz
// declare global {
//   interface Window {
//     Telegram: {
//       WebApp: {
//         initDataUnsafe: {
//           user?: {
//             username?: string;
//           };
//         };
//         ready: () => void;
//       };
//     };
//   }
// }

const Navbar: React.FC = () => {
  const [username, setUsername] = useState<string>('<>JASURBEK<\>');
  const [level, setLevel] = useState<string>('Новичок'); // Default level

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg?.initDataUnsafe?.user?.username) {
      setUsername(tg.initDataUnsafe.user.username);
      
      // Username asosida level o'zgartirish (misol uchun)
      if (tg.initDataUnsafe.user.username === 'admin') {
        setLevel('Admin');
      } else {
        setLevel('User');
      }
    }
    tg?.ready();
  }, []);
  

  return (
    <div>
      <div className={styles.container}>
        {/* Chap taraf */}
        <div className={styles.leftBlock}>
          <div className={styles.userInfo}>
            <div className={styles.smileCircle}>
              <span className={styles.smile}>😎</span>
            </div>
            <div>
              <h2 className={styles.username}>{username}</h2>
              <p className={styles.level}>{level}</p>
            </div>
          </div>
        </div>

        {/* O'ng taraf */}
        <div className={styles.rightBlock}>
          <p className={styles.adTitle}>@poizonshop</p>
          <a href="https://t.me/kanal" target="_blank" rel="noopener noreferrer" className={styles.adLink}>
            наш Телеграм-канал
          </a>
        </div>
      </div>

      {/* Search input qo'shildi */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Qidiruv..."
        />
      </div>
    </div>
  );
};

export default Navbar;
