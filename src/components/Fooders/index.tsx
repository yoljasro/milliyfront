import React, { useState, useEffect } from 'react';
import styles from './index.module.sass';
import Image from 'next/image';
import { useRouter } from 'next/router';

// Define the type for a product
interface Product {
  title: string;
  desc: string;
  price: string;
  image: string;
}

const categories = [
  { title: "Первые блюда", image: "/assets/img/mastava.jpg" },
  { title: "Вторые блюда", image: "/assets/img/plov.jpg" },
  { title: "Салаты", image: "/assets/img/aciq.jpg" },
  { title: "Мучные изделия", image: "/assets/img/samsa.jpg" }
];

const predefinedProducts: Record<string, Product[]> = {
  "Первые блюда": [
    { title: "Лагман", desc: "Вкусный Лагман", price: "12000", image: "/assets/img/lagmon.jpg" },
    { title: "Шурпа", desc: "Классические Шурпа", price: "15000", image: "/assets/img/shurva.jpg" },
    { title: "Мастава", desc: "Классические Мастава", price: "15000", image: "/assets/img/mastava.jpg" },
    { title: "Мампар", desc: "Классические Мампар", price: "15000", image: "/assets/img/mampar.jpg" },
  ],
  // Add the rest of the categories similarly...
};

const Fooders: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof predefinedProducts | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const router = useRouter();

  const handleCategoryClick = (category: keyof typeof predefinedProducts) => {
    setSelectedCategory(category);
    setLoading(true);

    setTimeout(() => {
      setProducts(predefinedProducts[category] || []);
      setLoading(false);
    }, 500);
  };

  const handleAddToCart = (product: Product) => {
    router.push({
      pathname: '/order',
      query: { ...product },
    });
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  useEffect(() => {
    if (!selectedCategory) {
      setIsLoaded(true);
    }
  }, [selectedCategory]);

  return (
    <div className={styles.fooders}>
      {!selectedCategory && (
        <p className={styles.fooders__title}>Все каталоги</p>
      )}

      <div className={`${styles.fooders__cards} ${isLoaded ? styles.show : ''}`}>
        {!selectedCategory && categories.map((category, index) => (
          <div
            key={index}
            className={styles.fooders__card}
            onClick={() => handleCategoryClick(category.title as keyof typeof predefinedProducts)}
          >
            <Image
              className={styles.fooders__img}
              src={category.image}
              alt={category.title}
              width={270}
              height={180}
            />
            <p className={styles.fooders__title}>{category.title}</p>
          </div>
        ))}

        {selectedCategory && (
          <div className={`${styles.fooders__products} ${isLoaded ? styles.show : ''}`}>
            <div>
              <button className={styles.fooders__backBtn} onClick={handleBackToCategories}>Назад</button>
              <p className={styles.fooders__title}>{selectedCategory}</p>
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : products.length === 0 ? (
              <p>Продукты не найдены</p>
            ) : (
              <div className={styles.fooders__productList}>
                {products.map((product, index) => (
                  <div key={index} className={styles.fooders__product} onClick={() => handleAddToCart(product)}>
                    <Image
                      className={styles.fooders__img}
                      src={product.image}
                      alt={product.title}
                      width={150}
                      height={150}
                    />
                    <p className={styles.fooders__title}>{product.title}</p>
                    <p className={styles.fooders__desc}>{product.desc}</p>
                    <p className={styles.fooders__price}>{product.price} UZS</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Fooders;
