import React, { useEffect, useState } from 'react';
import styles from '../styles/favorite.module.sass';
import Image from 'next/image';
import { AiFillHeart } from 'react-icons/ai';

interface FavoriteItem {
  id: number;
  imgUrl: string;
}

const FavoritePage: React.FC = () => {
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);
  const [fastestItems, setFastestItems] = useState<FavoriteItem[]>([]);
  const [allItems, setAllItems] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    // localStorage dan favorite items'larni yuklash
    const storedFavorites = localStorage.getItem('favoriteItems');
    if (storedFavorites) {
      const favoriteIds = JSON.parse(storedFavorites);
      const allCards = [
        { id: 1, imgUrl: '/assets/img/spaget.png' },
        { id: 2, imgUrl: '/assets/img/burger.png' },
        { id: 3, imgUrl: '/assets/img/pizza.png' },
      ];

      // Fastest bo'limidan ma'lumot olish (mock ma'lumotlar bilan)
      const fastestCards = [
        { id: 4, imgUrl: '/assets/img/fastest1.png' },
        { id: 5, imgUrl: '/assets/img/fastest2.png' },
      ];

      // Sevimli kartalarni filtrlaymiz
      const filteredFavorites = [...allCards, ...fastestCards].filter(card => favoriteIds.includes(card.id));

      // Hammasini birlashtiramiz
      setFavoriteItems(filteredFavorites);
      setFastestItems(fastestCards);
      setAllItems(filteredFavorites);
    }
  }, []);

  return (
    <div className={styles.favorite}>
      <h1>Sevimli kartalar</h1>

      {/* Barcha itemlar */}
      <h2>Barcha kartalar</h2>
      <div className={styles.favorite__cards}>
        {allItems.map((item) => (
          <div key={item.id} className={styles.favorite__card}>
            <Image src={item.imgUrl} alt="favorite item" width={270} height={122} layout="responsive" />
            <div className={styles.favorite__icon}>
              <AiFillHeart size={24} color="red" />
            </div>
          </div>
        ))}
      </div>

      {/* Sevimli itemlar */}
      <h2>Sevimli kartalar</h2>
      <div className={styles.favorite__cards}>
        {favoriteItems.map((item) => (
          <div key={item.id} className={styles.favorite__card}>
            <Image src={item.imgUrl} alt="favorite item" width={270} height={122} layout="responsive" />
            <div className={styles.favorite__icon}>
              <AiFillHeart size={24} color="red" />
            </div>
          </div>
        ))}
      </div>

      {/* Fastest bo'limidan itemlar */}
      <h2>Tezkor kartalar</h2>
      <div className={styles.favorite__cards}>
        {fastestItems.map((item) => (
          <div key={item.id} className={styles.favorite__card}>
            <Image src={item.imgUrl} alt="fastest item" width={270} height={122} layout="responsive" />
            <div className={styles.favorite__icon}>
              <AiFillHeart size={24} color="red" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritePage;
