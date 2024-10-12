import React, { useState } from 'react';
import styles from './index.module.sass';
import Image from 'next/image';
import axios from 'axios';

const categories = [
  { title: "Первые блюда" },
  { title: "Вторые блюда" },
  { title: "Салаты" },
  { title: "Мучные изделия" }
];

// Define the Product type
interface Product {
  title: string;
  image: string;
  price: number;
}

const Fooders: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]); // Use the Product type here
  const [loading, setLoading] = useState<boolean>(false);

  const handleCategoryClick = async (category: string) => {
    setSelectedCategory(category);
    setLoading(true);

    try {
      const response = await axios.get('https://milliyadmin.uz/products', {
        params: { category: category } // Assuming the API accepts the category as a query parameter
      });

      // Ensure products is always an array
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]); // Clear products if an error occurs
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on the selected category
  const filteredProducts = Array.isArray(products)
    ? products.filter((product) =>
        product.title.toLowerCase().includes(selectedCategory?.toLowerCase() || '')
      )
    : [];

  return (
    <div className={styles.fooders}>
      <p className={styles.fooders__title}>Все каталоги</p>
      <div className={styles.fooders__cards}>
        {/* Display categories when no category is selected */}
        {!selectedCategory && categories.map((category, index) => (
          <div
            key={index}
            className={styles.fooders__card}
            onClick={() => handleCategoryClick(category.title)}
          >
            <Image
              className={styles.fooders__img}
              src={'/assets/img/bowl.png'}
              alt={category.title}
              width={270}
              height={180}
              layout="responsive"
            />
            <p className={styles.fooders__title}>{category.title}</p>
          </div>
        ))}

        {/* Display products when a category is selected */}
        {selectedCategory && (
          <div className={styles.fooders__products}>
            <p className={styles.fooders__title}>{selectedCategory}</p>
            {loading ? (
              <p>Loading...</p>
            ) : filteredProducts.length === 0 ? (
              <p>No products available in this category.</p>
            ) : (
              filteredProducts.map((product, idx) => (
                <div key={idx} className={styles.product}>
                  <Image
                    className={styles.product__img}
                    src={product.image}
                    alt={product.title}
                    width={200}
                    height={150}
                    layout="responsive"
                  />
                  <p className={styles.fooders__name}>{product.title}</p>
                  <p>{product.price} UZS</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Fooders;
