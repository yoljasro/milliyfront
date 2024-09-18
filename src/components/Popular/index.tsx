import React, { useState, useEffect } from 'react';
import styles from './index.module.sass';
import Image from 'next/image';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'; // Yurak ikonlari

interface CardProps {
  id: number;
  imgUrl: string;
  onFavorite: (id: number) => void; // Qo'shish funksiyasi
  isFavorited: boolean; // Yoqtirilgan yoki yo'qligini tekshirish
  addToCart: (id: number) => void; // Cartga qo'shish funksiyasi
  getCartQuantity: (id: number) => number; // Cartdagi miqdorni olish
}

const Card: React.FC<CardProps> = ({ id, imgUrl, onFavorite, isFavorited, addToCart, getCartQuantity }) => {
  const [showCounter, setShowCounter] = useState(false);

  const handleAddToCart = () => {
    addToCart(id);
    setShowCounter(true);
  };

  return (
    <div className={styles.popular__card}>
      <Image
        src={imgUrl}
        alt="popular item"
        width={170}
        height={122}
        className={styles.popular__img}
      />
      <div className={styles.popular__favorite} onClick={() => onFavorite(id)}>
        {isFavorited ? (
          <AiFillHeart size={24} color="red" /> // Yurak qizil
        ) : (
          <AiOutlineHeart size={24} /> // Yurak konturli
        )}
      </div>
      {/* <div className={styles.popular__cardActions}>
        {showCounter && getCartQuantity(id) > 0 ? (
          <div className={styles.popular__cartCounter}>
            <button onClick={() => addToCart(id)} className={styles.popular__cartButton}>+</button>
            <span>{getCartQuantity(id)}</span>
            <button onClick={() => addToCart(id)} className={styles.popular__cartButton}>-</button>
          </div>
        ) : (
          <button className={styles.popular__addToCart} onClick={handleAddToCart}>
            Add to Cart
          </button>
        )}
      </div> */}
    </div>
  );
};

export const Popular: React.FC = () => {
  const [favoriteItems, setFavoriteItems] = useState<number[]>([]);
  const [cart, setCart] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favoriteItems');
    if (storedFavorites) {
      setFavoriteItems(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favoriteItems', JSON.stringify(favoriteItems));
  }, [favoriteItems]);

  const toggleFavorite = (id: number) => {
    if (favoriteItems.includes(id)) {
      setFavoriteItems(favoriteItems.filter(item => item !== id));
    } else {
      setFavoriteItems([...favoriteItems, id]);
    }
  };

  const addToCart = (id: number) => {
    setCart(prevCart => ({
      ...prevCart,
      [id]: (prevCart[id] || 0) + 1
    }));
  };

  const getCartQuantity = (id: number) => cart[id] || 0;

  const goToOrderPage = () => {
    // Order sahifasiga o'tish (keyingi funksiyada to'g'ri yo'naltirishni sozlang)
    console.log("Go to order page with cart:", cart);
  };

  return (
    <div className={styles.popular}>
      <div className={styles.popular__cont}>
        <div className={styles.popular__content}>
          <p>Популярные товары 👏</p>
          <button>Смотреть все</button>
        </div>
      </div>
      <div className={styles.popular__cards}>
        {[
          { id: 1, imgUrl: '/assets/img/spaget.png' },
          { id: 2, imgUrl: '/assets/img/burger.png' },
          { id: 3, imgUrl: '/assets/img/pizza.png' },
        ].map(card => (
          <Card
            key={card.id}
            id={card.id}
            imgUrl={card.imgUrl}
            onFavorite={toggleFavorite}
            isFavorited={favoriteItems.includes(card.id)}
            addToCart={addToCart}
            getCartQuantity={getCartQuantity}
          />
        ))}
      </div>
      {Object.values(cart).some(quantity => quantity > 0) && (
        <button className={styles.popular__orderButton} onClick={goToOrderPage}>Order Now</button>
      )}
    </div>
  );
};
