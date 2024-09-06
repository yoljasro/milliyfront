import React from 'react';

const Navbar: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Ikki yonma-yon blok */}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '60%', marginBottom: '20px' }}>
        {/* Chap blok */}
        <div style={{ flex: 1, padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h2>Username</h2>
          <p>Level: <span style={{ color: '#4CAF50' }}>Advanced</span></p>
        </div>
        
        {/* O'ng blok */}
        <div style={{ flex: 1, padding: '10px', marginLeft: '10px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h2>Telegram Kanalimiz</h2>
          <a href="https://t.me/kanal" target="_blank" rel="noopener noreferrer">Reklama uchun bosing</a>
        </div>
      </div>
      
      {/* Qidiruv inputi */}
      <div style={{ width: '60%', display: 'flex', justifyContent: 'center', position: 'relative' }}>
        <input 
          type="text" 
          placeholder="Qidiruv" 
          style={{
            width: '100%',
            padding: '10px',
            border: '2px solid #007BFF',
            borderRadius: '8px',
            backgroundImage: 'url("/images/uzbek_pattern.png")', // Milliy naqshni background image qilib olishingiz mumkin
            backgroundSize: 'contain',
            backgroundPosition: 'right 10px center',
            backgroundRepeat: 'no-repeat'
          }} 
        />
      </div>
    </div>
  );
};

export default Navbar;
