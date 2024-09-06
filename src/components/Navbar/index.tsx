import React, { useEffect, useState } from 'react';

// Telegram Web App interfeysini aniqroq tip bilan belgilash
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initDataUnsafe: {
          user: {
            username: string;
          };
        };
        ready: () => void;
      };
    };
  }
}

const Navbar: React.FC = () => {
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      if (tg.initDataUnsafe?.user?.username) {
        setUsername(tg.initDataUnsafe.user.username);
      }
      tg.ready();
    }
  }, []);

  return (
    <div style={styles.container}>
      {/* Chap blok */}
      <div style={styles.leftBlock}>
        <h2>{username}</h2> {/* Foydalanuvchining telegramdagi username'si */}
        <p>Level: <span style={styles.level}>Beginner</span></p> {/* Foydalanuvchi darajasi */}
      </div>

      {/* O'ng blok */}
      <div style={styles.rightBlock}>
        <h3>Telegram Kanalimiz</h3>
        <a href="https://t.me/kanal" target="_blank" rel="noopener noreferrer">Reklama uchun bosing</a>
      </div>

      {/* Qidiruv tizimi */}
      <div style={styles.searchContainer}>
        <input 
          type="text" 
          placeholder="Qidiruv"
          style={styles.searchInput} 
        />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px',
  },
  leftBlock: {
    padding: '10px',
    marginBottom: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    width: '80%',
    textAlign: 'center' as const,
  },
  rightBlock: {
    padding: '10px',
    marginBottom: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    width: '80%',
    textAlign: 'center' as const,
  },
  searchContainer: {
    width: '80%',
    textAlign: 'center' as const,
    marginTop: '20px',
  },
  searchInput: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '2px solid #007BFF',
    backgroundImage: 'url("https://cdn.webshopapp.com/shops/127908/files/340241030/hand-made-unusual-origina-ikat-lamp-shade-from-uzb.jpg")',
    backgroundPosition: 'right 10px center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
  },
  level: {
    color: '#4CAF50',
  }
};

export default Navbar;
