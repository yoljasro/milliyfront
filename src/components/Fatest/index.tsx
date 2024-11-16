import React, { useState, useEffect } from 'react';
import styles from './index.module.sass';
import Image from 'next/image';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { useRouter } from 'next/router';
import { PuffLoader } from 'react-spinners';
import ProgressBar from '../ProgressBar'; // Progress barni import qilamiz

interface Product {
  _id: string;
  title: string;
  desc: string;
  price: number;
  minute: string;
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
  const [loading, setLoading] = useState(true); // Loading state
  const [progress, setProgress] = useState(0); // Progress state
  const router = useRouter();

  // Mahsulotlarni yuklash
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://backmilliy-production.up.railway.app/products');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        const productsMap = data.reduce((acc: Record<string, Product>, product: Product) => {
          acc[product._id] = {
            ...product,
            image: `https://backmilliy-production.up.railway.app${product.image.replace(/\\/g, '/')}`,
          };
          return acc;
        }, {});

        setProductDetails(productsMap);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false); // Loading tugashi
      }
    };

    fetchProducts();
  }, []);

  // Mahsulotlar yuklanayotganda progress barni yangilash
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress < 100) return prevProgress + 10;
          clearInterval(interval);
          return 100;
        });
      }, 500); // Har 500 msda progressni 10% oshirib borish
    }
  }, [loading]);

  const handleButtonClick = () => {
    router.push('/foods');
  };

  // Mahsulotlarni localStorage orqali yuklash
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favoriteItems');
    if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
  }, []);

  const toggleFavorite = (cardId: string) => {
    setFavorites((prevFavorites) => {
      const updatedFavorites = prevFavorites.includes(cardId)
        ? prevFavorites.filter((id) => id !== cardId)
        : [...prevFavorites, cardId];
      localStorage.setItem('favoriteItems', JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  };

  const addToCart = (cardId: string) => {
    setAnimatingCard(cardId);
    setTimeout(() => setAnimatingCard(null), 300);
    setCart((prevCart) => ({
      ...prevCart,
      [cardId]: {
        quantity: (prevCart[cardId]?.quantity || 0) + 1,
        product: productDetails[cardId],
      },
    }));
  };

  const removeFromCart = (cardId: string) => {
    setCart((prevCart) => ({
      ...prevCart,
      [cardId]: {
        quantity: Math.max((prevCart[cardId]?.quantity || 0) - 1, 0),
        product: productDetails[cardId],
      },
    }));
  };

  const getCartQuantity = (cardId: string) => cart[cardId]?.quantity || 0;

  const handleOrderNow = () => {
    const selectedItems = Object.entries(cart).reduce((acc, [id, item]) => {
      acc[id] = item;
      return acc;
    }, {} as { [key: string]: CartItem });

    if (Object.keys(selectedItems).length > 0) {
      router.push({ pathname: '/order', query: { items: JSON.stringify(selectedItems) } });
    }
  };

  const hasItemsInCart = Object.values(cart).some((item) => item.quantity > 0);

  return (
    <div className={styles.fatest}>
      {loading ? (
        <div className={styles.fatest__loader}>
          <PuffLoader color="#ff7d1a" size={100} />
          <p className={styles.fatest__load}>Загрузка...</p>
          <ProgressBar progress={progress} /> {/* Progress barni yuklash jarayonida ko'rsatish */}
        </div>
      ) : (
        <>
          <div className={styles.fatest__cont}>
            <div className={styles.fatest__content}>
              <p>Быстрая доставка 🔥</p>
              <button onClick={handleButtonClick}>Смотреть все</button>
            </div>
          </div>
          <div className={styles.fatest__cards}>
            {Object.keys(productDetails).map((cardId) => (
              <div key={cardId} className={styles.fatest__card}>
                <div
                  className={styles.fatest__favorite}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(cardId);
                  }}
                >
                  {favorites.includes(cardId) ? <AiFillHeart /> : <AiOutlineHeart />}
                </div>
                <Image
                  className={styles.fatest__img}
                  src={productDetails[cardId].image}
                  alt={productDetails[cardId].title}
                  width={270}
                  height={122}
                />
                <p className={styles.fatest__title}>{productDetails[cardId].title}</p>
                <div className={styles.fatest__desc}>
                  <p className={styles.fatest__descText}>{productDetails[cardId].desc}</p>
                </div>
                <p className={styles.fatest__price}>{productDetails[cardId].price} UZS</p>
                <div className={styles.fatest__timer}>
                  <Image alt="timer" src={'/assets/img/timer.svg'} width={16} height={16} />
                  <p>{productDetails[cardId].minute} мин</p>
                </div>
                <div className={styles.fatest__cardActions}>
                  {getCartQuantity(cardId) === 0 ? (
                    <button
                      className={styles.fatest__addToCart}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(cardId);
                      }}
                    >
                      Добавить в корзину
                    </button>
                  ) : (
                    <div
                      className={`${styles.fatest__cartCounter} ${
                        animatingCard === cardId ? styles.fatest__cartCounterAnimating : ''
                      }`}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromCart(cardId);
                        }}
                      >
                        -
                      </button>
                      <span>{getCartQuantity(cardId)}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(cardId);
                        }}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {hasItemsInCart && (
            <div className={styles.fatest__cartActions}>
              <button onClick={handleOrderNow}>Заказать сейчас</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Fatest;
