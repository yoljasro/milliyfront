import React, { useState, useEffect } from 'react';
import styles from './index.module.sass';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router'; // Router import qilish

export const Menu: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string>('discover'); // Default active menu
  const router = useRouter(); // Router hooki

  useEffect(() => {
    // Router query parametrlariga qarab aktiv menyuni o'rnatish
    const path = router.pathname;
    if (path === '/') {
      setActiveMenu('discover');
    } else if (path === '/foods') {
      setActiveMenu('food');
    } else if (path === '/search') {
      setActiveMenu('search');
    } else if (path === '/favorite') {
      setActiveMenu('favorites');
    }
  }, [router.pathname]);

  return (
    <div className={styles.menu}>
      <div className={styles.menu__container}>
        <Link href={'/'}>
          <div
            className={`${styles.menu__items} ${activeMenu === 'discover' ? styles.active : ''}`}
            onClick={() => setActiveMenu('discover')}
          >
            <Image
              src={'/assets/img/restasvg.svg'}
              alt='discover'
              width={24}
              height={24}
              className={activeMenu === 'discover' ? styles.activeImage : ''}
            />
            <p className={`${styles.menu__titleone} ${activeMenu === 'discover' ? styles.activeText : ''}`}>
              Каталог
            </p>
          </div>
        </Link>
        <Link href={'/foods'}>
          <div
            className={`${styles.menu__items} ${activeMenu === 'food' ? styles.active : ''}`}
            onClick={() => setActiveMenu('food')}
          >
            <Image
              src={'/assets/img/discover.svg'}
              alt='food'
              width={24}
              height={24}
              className={activeMenu === 'food' ? styles.activeImage : ''}
            />
            <p className={`${styles.menu__title} ${activeMenu === 'food' ? styles.activeText : ''}`}>
              Еда
            </p>
          </div>
        </Link>

        <Link href={'/search'}>
          <div
            className={`${styles.menu__items} ${activeMenu === 'search' ? styles.active : ''}`}
            onClick={() => setActiveMenu('search')}
          >
            <Image
              src={'/assets/img/search.svg'}
              alt='search'
              width={24}
              height={24}
              className={activeMenu === 'search' ? styles.activeImage : ''}
            />
            <p className={`${styles.menu__title} ${activeMenu === 'search' ? styles.activeText : ''}`}>
              Поиск
            </p>
          </div>
        </Link>

        <Link href={'/favorite'}>
          <div
            className={`${styles.menu__items} ${styles.heart} ${activeMenu === 'favorites' ? styles.active : ''}`}
            onClick={() => setActiveMenu('favorites')}
          >
            <Image
              src={'/assets/img/heart.svg'}
              alt='favorites'
              width={24}
              height={24}
              className={activeMenu === 'favorites' ? styles.activeImage : ''}
              style={{ position: 'relative', left: "10px" }} // 20px o'ngga joylashtirish
            />
            <p className={`${styles.menu__title} ${activeMenu === 'favorites' ? styles.activeText : ''}`}>
              Любимый
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};
