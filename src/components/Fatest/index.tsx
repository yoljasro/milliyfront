import React, { useState, useEffect } from 'react';
import styles from './index.module.sass';
import Image from 'next/image';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { useRouter } from 'next/router';

interface Product {
  _id: string;
  title: string;
  price: number;
  image: string;
}

interface CartItem {
  quantity: number;
  product: Product;
}

const Fatest: React.FC = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<{ [key: string]: CartItem }>({});
  const [animatingCard, setAnimatingCard] = useState<string | null>(null);
  const [productDetails, setProductDetails] = useState<Record<string, Product>>({});
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://ff67-213-230-78-25.ngrok-free.app/products');
        const data = await response.json();

        const productsMap = data.reduce((acc: Record<string, Product>, product: Product) => {
          acc[product._id] = {
            ...product,
            image: `https://ff67-213-230-78-25.ngrok-free.app/${product.image}`,
          };
          return acc;
        }, {});

        setProductDetails(productsMap);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favoriteItems');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const toggleFavorite = (cardId: string) => {
    setFavorites((prevFavorites) => {
      const newFavorites = prevFavorites.includes(cardId)
        ? prevFavorites.filter((id) => id !== cardId)
        : [...prevFavorites, cardId];

      localStorage.setItem('favoriteItems', JSON.stringify(newFavorites));

      return newFavorites;
    });
  };

  const addToCart = (cardId: string) => {
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
      return newCart;
    });
  };

  const removeFromCart = (cardId: string) => {
    setCart((prevCart) => {
      const newCart = {
        ...prevCart,
        [cardId]: {
          quantity: Math.max((prevCart[cardId]?.quantity || 0) - 1, 0),
          product: productDetails[cardId]
        }
      };
      return newCart;
    });
  };

  const getCartQuantity = (cardId: string) => cart[cardId]?.quantity || 0;

  const handleOrderNow = () => {
    const selectedItems = Object.entries(cart)
      .reduce((acc, [id, item]) => {
        acc[id] = item;
        return acc;
      }, {} as { [key: string]: CartItem });

    if (Object.keys(selectedItems).length > 0) {
      router.push({
        pathname: '/order',
        query: { items: JSON.stringify(selectedItems) }
      });
    }
  };

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
          <div
            key={cardId}
            className={`${styles.fatest__card} ${favorites.includes(cardId) ? styles.fatest__cardActive : ''}`}
          >
            <div className={styles.fatest__favorite} onClick={(e) => { e.stopPropagation(); toggleFavorite(cardId); }}>
              {favorites.includes(cardId) ? <AiFillHeart /> : <AiOutlineHeart />}
            </div>
            <Image
              className={styles.fatest__img}
              src={productDetails[cardId].image}
              alt={productDetails[cardId].title}
              width={270}
              height={122}
              layout="responsive"
            />
            <p className={styles.fatest__title}>{productDetails[cardId].title}</p>
            <p className={styles.fatest__price}>{productDetails[cardId].price} UZS</p>
            <div className={styles.fatest__timer}>
              <Image alt='timer' src={'/assets/img/timer.svg'} width={16} height={16} />
              <p>40-50min</p>
            </div>
            <div className={styles.fatest__cardActions}>
              {getCartQuantity(cardId) === 0 ? (
                <button
                  className={styles.fatest__addToCart}
                  onClick={(e) => { e.stopPropagation(); addToCart(cardId); }}
                >
                  Add to Cart
                </button>
              ) : (
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
      {hasItemsInCart && (
        <div className={styles.fatest__btncont}>
          <button className={styles.fatest__orderNow} onClick={handleOrderNow}>Order Now</button>
        </div>
      )}
    </div>
  );
};

export default Fatest;
