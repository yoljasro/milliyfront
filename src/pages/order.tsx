// pages/order.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import styles from '../styles/order.module.sass'; // Ensure this path matches your file structure

interface Card {
  id: number;
  imgUrl: string;
  title: string;
  price: string;
  description: string;
}

const OrderPage: React.FC = () => {
  const router = useRouter();
  const { query } = router;
  const [cartItems, setCartItems] = useState<{ [key: number]: number }>({});
  const [favorites, setFavorites] = useState<number[]>([]);

  // Dummy data for card details
  const cardDetails: { [key: number]: Card } = {
    1: { id: 1, imgUrl: '/assets/img/fatest1.png', title: 'Crazy Taco', price: '$10', description: 'Delicious tacos, appetizing snacks, and more...' },
    2: { id: 2, imgUrl: '/assets/img/fatest2.png', title: 'Burger Bonanza', price: '$12', description: 'Juicy burgers with a variety of toppings...' },
    3: { id: 3, imgUrl: '/assets/img/fatest3.png', title: 'Pizza Party', price: '$15', description: 'Cheesy pizza with your favorite toppings...' },
    // Add more items as needed
  };

  useEffect(() => {
    if (query.items) {
      setCartItems(JSON.parse(query.items as string));
    }
  }, [query.items]);

  useEffect(() => {
    // Load favorites from local storage or other source
    const storedFavorites = localStorage.getItem('favoriteItems');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const toggleFavorite = (cardId: number) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(cardId)
        ? prevFavorites.filter((id) => id !== cardId)
        : [...prevFavorites, cardId]
    );
    localStorage.setItem('favoriteItems', JSON.stringify(favorites));
  };

  return (
    <div className={styles.orderPage}>
      <h1>Your Order</h1>
      {Object.keys(cartItems).length > 0 ? (
        <div className={styles.orderList}>
          {Object.entries(cartItems).map(([cardId, quantity]) => {
            const card = cardDetails[parseInt(cardId)];
            if (!card) return null;

            return (
              quantity > 0 && (
                <div key={cardId} className={styles.orderItem}>
                  <div className={styles.orderItem__img}>
                    <Image src={card.imgUrl} alt={card.title} width={150} height={100} />
                  </div>
                  <div className={styles.orderItem__details}>
                    <h2>{card.title}</h2>
                    <p>{card.description}</p>
                    <p><strong>Price:</strong> {card.price}</p>
                    <p><strong>Quantity:</strong> {quantity}</p>
                    <button
                      className={`${styles.favoriteButton} ${favorites.includes(card.id) ? styles.favoriteActive : ''}`}
                      onClick={() => toggleFavorite(card.id)}
                    >
                      {favorites.includes(card.id) ? <AiFillHeart /> : <AiOutlineHeart />}
                    </button>
                  </div>
                </div>
              )
            );
          })}
        </div>
      ) : (
        <p>No items in the cart.</p>
      )}
    </div>
  );
};

export default OrderPage;
