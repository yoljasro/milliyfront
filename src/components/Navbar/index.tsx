import React, { useEffect, useState } from 'react';
import styles from './index.module.sass'

const Navbar: React.FC = () => {
  const [username, setUsername] = useState<string>('');


  return (
    <div className={styles.container}>
   <div>Jasurbek</div>
   <div>Telegram channel</div>
    </div>
  );
};



export default Navbar;
