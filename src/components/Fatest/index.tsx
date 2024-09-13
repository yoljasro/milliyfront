import React, { useState } from 'react';
import styles from './index.module.sass';
import Image from 'next/image';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { useRouter } from 'next/router';

export const Fatest: React.FC = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [showAddButton, setShowAddButton] = useState<number | null>(null);
  const [animatingCard, setAnimatingCard] = useState<number | null>(null);
  const [showCounter, setShowCounter] = useState<number | null>(null);
  const router = useRouter();

  const handleCardClick = (cardId: number) => {
    const url = `https://t.me/unicornapp?card=${cardId}`;
    window.open(url, "_blank");
  };

  const toggleFavorite = (cardId: number) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(cardId)
        ? prevFavorites.filter((id) => id !== cardId)
        : [...prevFavorites, cardId]
    );
  };

  const addToCart = (cardId: number) => {
    setAnimatingCard(cardId);
    setTimeout(() => {
      setAnimatingCard(null);
    }, 300); // Reset animation state after 300ms

    setCart((prevCart) => {
      const newCart = {
        ...prevCart,
        [cardId]: (prevCart[cardId] || 0) + 1
      };
      setShowCounter(cardId); // Show counter
      setShowAddButton(null); // Hide add button
      return newCart;
    });
  };

  const removeFromCart = (cardId: number) => {
    setCart((prevCart) => {
      const newCart = {
        ...prevCart,
        [cardId]: Math.max((prevCart[cardId] || 0) - 1, 0)
      };
      setShowCounter(Object.keys(newCart).find(id => newCart[parseInt(id)] > 0) ? cardId : null);
      if (newCart[cardId] === 0) setShowAddButton(cardId); // Show add button if counter is 0
      return newCart;
    });
  };

  const getCartQuantity = (cardId: number) => cart[cardId] || 0;

  const goToOrderPage = () => {
    router.push({
      pathname: '/order',
      query: { items: JSON.stringify(cart) }
    });
  };

  return (
    <div className={styles.fatest}>
      <div className={styles.fatest__cont}>
        <div className={styles.fatest__content}>
          <p>Быстрая доставка 🔥</p>
          <button>Смотреть все</button>
        </div>
      </div>
      <div className={styles.fatest__cards}>
        {[1, 2, 3, 4, 5].map((cardId) => (
          <div key={cardId}
               className={`${styles.fatest__card} ${favorites.includes(cardId) ? styles.fatest__cardActive : ''}`}
               onMouseEnter={() => setShowAddButton(cardId)}
               onMouseLeave={() => setShowAddButton(null)}
              //  onClick={() => handleCardClick(cardId)}
          >
            <div className={styles.fatest__favorite} onClick={(e) => { e.stopPropagation(); toggleFavorite(cardId); }}>
              {favorites.includes(cardId) ? <AiFillHeart /> : <AiOutlineHeart />}
            </div>
            <Image className={styles.fatest__img} src={'/assets/img/fatest1.png'} alt='fatest1' width={270} height={122} layout="responsive" />
            <p className={styles.fatest__title}>Crazy tacko</p>
            <p className={styles.fatest__desc}>Delicious tacos, appetizing snacks, fr...</p>
            <div className={styles.fatest__timer}>
              <Image alt='timer' src={'/assets/img/timer.svg'} width={16} height={16} />
              <p>40-50min</p>
            </div>
            <div className={styles.fatest__cardActions}>
              {showAddButton === cardId && getCartQuantity(cardId) === 0 && (
                <button className={`${styles.fatest__addToCart} ${showAddButton === cardId ? styles.fatest__addToCartVisible : ''}`}
                        onClick={(e) => { e.stopPropagation(); addToCart(cardId); }}>
                  Add to Cart
                </button>
              )}
              {showCounter === cardId && getCartQuantity(cardId) > 0 && (
                <div className={`${styles.fatest__cartCounter} ${animatingCard === cardId ? styles.fatest__cartCounterAnimating : ''}`}>
                  <button onClick={(e) => { e.stopPropagation(); removeFromCart(cardId); }}>-</button>
                  <span>{getCartQuantity(cardId)}</span>
                  <button onClick={(e) => { e.stopPropagation(); addToCart(cardId); }}>+</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {Object.values(cart).some(count => count > 0) && (
        <div className={styles.fatest__btncont}>
        <button className={`${styles.fatest__orderButton} ${styles.fatest__orderButtonVisible}`} onClick={goToOrderPage}>Order Now</button>
        </div>
      )}
    </div>
  );
};
