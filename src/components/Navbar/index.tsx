import React, { useEffect, useState } from 'react';

// Telegram Web App orqali username olish
declare global {
  interface Window {
    Telegram: any;
  }
}

const Navbar: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  
  useEffect(() => {
    console.log(window.Telegram); // Bu yerda API yuklanganligini tekshiring
    const tg = window.Telegram?.WebApp;
    if (tg?.initDataUnsafe?.user?.username) {
      setUsername(tg.initDataUnsafe.user.username);
    }
    tg?.ready();
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
    flexDirection: 'column' as 'column',
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
    textAlign: 'center' as 'center',
  },
  rightBlock: {
    padding: '10px',
    marginBottom: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    width: '80%',
    textAlign: 'center' as 'center',
  },
  searchContainer: {
    width: '80%',
    textAlign: 'center' as 'center',
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
