import React, { useEffect, useState } from 'react';
import styles from '../styles/favorite.module.sass';
import Image from 'next/image';
import { AiFillHeart } from 'react-icons/ai'; 

interface Product {
  _id: string;
  title: string;
  image: string; 
  price: number;
}

const FavoritePage: React.FC = () => {
  const [favoriteItems, setFavoriteItems] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://milliyadmin.uz/products');
        const data = await response.json();
    
        const productsMap = data.reduce((acc: Record<string, Product>, product: Product) => {
          const cleanedImagePath = product.image.replace(/\\/g, '/').replace(/^\//, '');
          acc[product._id] = {
            ...product,
            image: `https://milliyadmin.uz/${cleanedImagePath}`,
          };
          return acc;
        }, {}); 
    
        const storedFavorites = localStorage.getItem('favoriteItems');
        if (storedFavorites) {
          const favoriteIds = JSON.parse(storedFavorites);
          const filteredFavorites = favoriteIds.map((id: string) => productsMap[id]).filter((product: Product) => product);
    
          setFavoriteItems(filteredFavorites);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className={styles.favorite}>
      <h1>Любимые карты</h1>
      <div className={styles.favorite__cards}>
        {favoriteItems.map((item) => (
          <div key={item._id} className={styles.favorite__card}>
            <Image src={item.image}  alt="favorite item" width={270} height={182} />
            <div className={styles.favorite__icon}>
              <AiFillHeart size={24} color="red" />
            </div>
            <p>{item.title}</p>
            <p>{item.price} сум</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritePage;
