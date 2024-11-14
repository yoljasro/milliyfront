import React, { useState, useEffect } from 'react';
import styles from './index.module.sass';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MdOutlineRestaurantMenu } from "react-icons/md";

export const Menu: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string>('discover');
  const router = useRouter();

  useEffect(() => {
    const path = router.pathname;
    if (path === '/') {
      setActiveMenu('discover');
    } else if (path === '/foods') {
      setActiveMenu('food');
    } else if (path === '/search') {
      setActiveMenu('search');
    } else if (path === '/profile') {
      setActiveMenu('profiles');
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
            <MdOutlineRestaurantMenu
              size={24} 
              className={`${styles.menu__icon} ${activeMenu === 'discover' ? styles.activeIcon : ''}`}
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

        <Link href={'/favorite'}>
          <div
            className={`${styles.menu__itemss} ${styles.heart} ${activeMenu === 'favorites' ? styles.active : ''}`}
            onClick={() => setActiveMenu('favorites')}
          >
            <Image
              src={'/assets/img/heart.svg'}
              alt='favorites'
              width={24}
              height={24}
              className={activeMenu === 'favorites' ? styles.activeImage : ''}
              style={{ position: 'relative', left: "13px" }} // 20px o'ngga joylashtirish
            />
            <p className={`${styles.menu__title} ${activeMenu === 'favorites' ? styles.activeText : ''}`}>
              Любимый
            </p>
          </div>
        </Link>


        <Link href={'/profile'}>
          <div
            className={`${styles.menu__itemss} ${styles.heart} ${activeMenu === 'profiles' ? styles.active : ''}`}
            onClick={() => setActiveMenu('profiles')}
          >
            <Image
              src={'/assets/img/profiles.svg'}
              alt='profiles'
              width={24}
              height={24}
              className={activeMenu === 'profiles' ? styles.activeImage : ''}
              style={{ position: 'relative', left: "13px" }} // 20px o'ngga joylashtirish
            />
            <p className={`${styles.menu__title} ${activeMenu === 'profiles' ? styles.activeText : ''}`}>
              Профиль
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};
