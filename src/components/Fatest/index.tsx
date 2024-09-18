import React, { useState } from 'react';
import styles from './index.module.sass';
import Image from 'next/image';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { useRouter } from 'next/router';

interface Product {
  img: string;
  title: string;
  price: string;
  desc: string;
}

interface CartItem {
  quantity: number;
  product: Product;
}

const productDetails: Record<number, Product> = {
  1: { img: '/assets/img/fatest1.png', title: 'Crazy Taco', price: '$10', desc: 'Delicious tacos, appetizing snacks, and more...' },
  2: { img: '/assets/img/fatest1.png', title: 'Burger Bonanza', price: '$12', desc: 'Juicy burgers with a variety of toppings...' },
  3: { img: '/assets/img/fatest1.png', title: 'Pizza Party', price: '$15', desc: 'Cheesy pizza with your favorite toppings...' },
  // Add more products as needed
};

export const Fatest: React.FC = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cart, setCart] = useState<{ [key: number]: CartItem }>({});
  const [showAddButton, setShowAddButton] = useState<number | null>(null);
  const [animatingCard, setAnimatingCard] = useState<number | null>(null);
  const [showCounter, setShowCounter] = useState<number | null>(null);
  const router = useRouter();

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
    }, 300);

    setCart((prevCart) => {
      const newCart = {
        ...prevCart,
        [cardId]: {
          quantity: (prevCart[cardId]?.quantity || 0) + 1,
          product: productDetails[cardId]
        }
      };
      setShowCounter(cardId);
      setShowAddButton(null);
      return newCart;
    });
  };

  const removeFromCart = (cardId: number) => {
    setCart((prevCart) => {
      const newCart = {
        ...prevCart,
        [cardId]: {
          quantity: Math.max((prevCart[cardId]?.quantity || 0) - 1, 0),
          product: productDetails[cardId]
        }
      };
      setShowCounter(Object.keys(newCart).find(id => newCart[parseInt(id)].quantity > 0) ? cardId : null);
      if (newCart[cardId].quantity === 0) setShowAddButton(cardId);
      return newCart;
    });
  };

  const getCartQuantity = (cardId: number) => cart[cardId]?.quantity || 0;

const handleOrderNow = () => {
  const selectedItems = Object.entries(cart)
    // .filter(([_, { quantity }]) => quantity > 0)
    .reduce((acc, [id, item]) => {
      acc[parseInt(id)] = item; 
       // id ni parseInt orqali raqamga aylantiramiz
      return acc;
    }, {} as { [key: number]: CartItem });

  if (Object.keys(selectedItems).length > 0) {
    router.push({
      pathname: '/order',
      query: { items: JSON.stringify(selectedItems) }
    });
  }
};

  // Check if there are any items in the cart to show the Order Now button
  const hasItemsInCart = Object.values(cart).some(item => item.quantity > 0);

  return (
    <div className={styles.fatest}>
      <div className={styles.fatest__cont}>
        <div className={styles.fatest__content}>
          <p>Быстрая доставка 🔥</p>
          <button>Смотреть все</button>
        </div>
      </div>
      <div className={styles.fatest__cards}>
        {Object.keys(productDetails).map((cardId) => (
          <div key={cardId}
               className={`${styles.fatest__card} ${favorites.includes(parseInt(cardId)) ? styles.fatest__cardActive : ''}`}
               onMouseEnter={() => setShowAddButton(parseInt(cardId))}
               onMouseLeave={() => setShowAddButton(null)}>
            <div className={styles.fatest__favorite} onClick={(e) => { e.stopPropagation(); toggleFavorite(parseInt(cardId)); }}>
              {favorites.includes(parseInt(cardId)) ? <AiFillHeart /> : <AiOutlineHeart />}
            </div>
            <Image className={styles.fatest__img} src={productDetails[parseInt(cardId)].img} alt='fatest1' width={270} height={122} layout="responsive" />
            <p className={styles.fatest__title}>{productDetails[parseInt(cardId)].title}</p>
            <p className={styles.fatest__desc}>{productDetails[parseInt(cardId)].desc}</p>
            <div className={styles.fatest__timer}>
              <Image alt='timer' src={'/assets/img/timer.svg'} width={16} height={16} />
              <p>40-50min</p>
            </div>
            <div className={styles.fatest__cardActions}>
              {showAddButton === parseInt(cardId) && getCartQuantity(parseInt(cardId)) === 0 && (
                <button className={`${styles.fatest__addToCart} ${showAddButton === parseInt(cardId) ? styles.fatest__addToCartVisible : ''}`}
                        onClick={(e) => { e.stopPropagation(); addToCart(parseInt(cardId)); }}>
                  Add to Cart
                </button>
              )}
              {showCounter === parseInt(cardId) && getCartQuantity(parseInt(cardId)) > 0 && (
                <div className={`${styles.fatest__cartCounter} ${animatingCard === parseInt(cardId) ? styles.fatest__cartCounterAnimating : ''}`}>
                  <button onClick={(e) => { e.stopPropagation(); removeFromCart(parseInt(cardId)); }}>-</button>
                  <span>{getCartQuantity(parseInt(cardId))}</span>
                  <button onClick={(e) => { e.stopPropagation(); addToCart(parseInt(cardId)); }}>+</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {hasItemsInCart && (
        <div className={styles.fatest__btncont}>
          <button className={styles.fatest__orderNow} onClick={handleOrderNow}>Order Now</button>
        </div>
      )}
    </div>
  );
};
