import React, { useEffect, useState } from 'react';
import styles from '../styles/favorite.module.sass';
import Image from 'next/image';
import { AiFillHeart } from 'react-icons/ai'; 

interface Product {
  _id: string; // Product ID 
  title: string;
  image: string; // Image URL
}

// interface FavoriteItem {
//   id: string;
//   imgUrl: string;
//   title: string;
//   desc: string;
// }

const FavoritePage: React.FC = () => {
  const [favoriteItems, setFavoriteItems] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://milliy.kardise.com/products');
        const data = await response.json();

        // Map the fetched data to the productDetails format
        const productsMap = data.reduce((acc: Record<string, Product>, product: Product) => {
          acc[product._id] = {
            ...product,
            image: `http://milliy.kardise.com${product.image}`, // Full URL
          };
          return acc;
        }, {});

        // Retrieve favorite IDs from localStorage
        const storedFavorites = localStorage.getItem('favoriteItems');
        if (storedFavorites) {
          const favoriteIds = JSON.parse(storedFavorites);

          // Filter the favorite products
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

      {/* Favorite items */}
      <div className={styles.favorite__cards}>
        {favoriteItems.map((item) => (
          <div key={item._id} className={styles.favorite__card}>
            <Image src={item.image} alt="favorite item" width={270} height={122} layout="responsive" />
            <div className={styles.favorite__icon}>
              <AiFillHeart size={24} color="red" />
            </div>
            <p>{item.title}</p>
            {/* Add description if needed */}
            <p>Product Description</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritePage;
