import React, { useState } from 'react';
import styles from './index.module.sass'; // Ensure this stylesheet is created

interface Product {
  id: number;
  image: string;
  title: string;
  description: string;
  price: number;
}

const productList: Product[] = [
  { id: 1, image: 'https://oshrestaurantandgrill.com/wp-content/uploads/2020/10/osh-in-the-house.jpg', title: 'Lagman', description: 'Noodle dish with meat and vegetables', price: 20 },
  { id: 2, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM-vFJfV2R-4UPcHpoLFJTfsIGH2WRwUaAOA&s', title: 'Plov', description: 'Rice dish with meat and spices', price: 15 },
  { id: 3, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnVJHeV3dgN6J1o3pEfZ0KKjs5nQPuGelwxA&s', title: 'Manti', description: 'Steamed dumplings with meat', price: 12 },
  { id: 4, image: 'https://www.willflyforfood.net/wp-content/uploads/2021/12/uzbek-food-lagman-soup.jpg.webp', title: 'Shashlik', description: 'Grilled meat skewers', price: 18 },
  { id: 5, image: 'https://www.willflyforfood.net/wp-content/uploads/2022/01/fried-chuchvara.jpg.webp', title: 'Samsa', description: 'Pastry filled with meat', price: 10 },
  { id: 6, image: 'https://oshrestaurantandgrill.com/wp-content/uploads/2020/10/osh-in-the-house.jpg', title: 'Chuchvara', description: 'Mini dumplings in broth', price: 14 },
  { id: 7, image: 'https://oshrestaurantandgrill.com/wp-content/uploads/2020/10/osh-in-the-house.jpg', title: 'Kebab', description: 'Grilled meat kebabs', price: 22 },
  { id: 8, image: 'https://oshrestaurantandgrill.com/wp-content/uploads/2020/10/osh-in-the-house.jpg', title: 'Kufta', description: 'Meatballs in sauce', price: 17 },
  { id: 9, image: 'https://oshrestaurantandgrill.com/wp-content/uploads/2020/10/osh-in-the-house.jpg', title: 'Beshbarmak', description: 'Traditional Kazakh dish with meat and pasta', price: 19 },
  { id: 10, image: 'https://oshrestaurantandgrill.com/wp-content/uploads/2020/10/osh-in-the-house.jpg', title: 'Borscht', description: 'Beet soup with sour cream', price: 13 }
];

const Products: React.FC = () => {
  const [cart, setCart] = useState<{ [key: number]: number }>({});

  const handleAddToCart = (id: number) => {
    setCart((prev) => ({
      ...prev,
      [id]: prev[id] ? prev[id] + 1 : 1,
    }));
  };

  const handleRemoveFromCart = (id: number) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[id] > 1) {
        newCart[id]--;
      } else {
        delete newCart[id];
      }
      return newCart;
    });
  };

  return (
    <div className={styles.productsContainer} id='products'>
      {productList.map((product) => (
        <div key={product.id} className={styles.card}>
          <img src={product.image} alt={product.title} className={styles.image} />
          <div className={styles.details}>
            <h3 className={styles.title}>{product.title}</h3>
            <p className={styles.description}>{product.description}</p>
            <p className={styles.price}>${product.price}</p>
            {cart[product.id] ? (
              <div className={styles.counter}>
                <button onClick={() => handleRemoveFromCart(product.id)} className={styles.counterButton}>-</button>
                <span className={styles.counterNumber}>{cart[product.id]}</span>
                <button onClick={() => handleAddToCart(product.id)} className={styles.counterButton}>+</button>
              </div>
            ) : (
              <button onClick={() => handleAddToCart(product.id)} className={styles.addButton}>
                Add
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Products;
