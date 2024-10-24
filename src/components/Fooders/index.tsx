import React, { useState, useEffect } from 'react';
import styles from './index.module.sass';
import Image from 'next/image';
import { useRouter } from 'next/router';

const categories = [
  { title: "Первые блюда", image: "/assets/img/mastava.jpg" },
  { title: "Вторые блюда", image: "/assets/img/plov.jpg" },
  { title: "Салаты", image: "/assets/img/aciq.jpg" },
  { title: "Мучные изделия", image: "/assets/img/samsa.jpg" }
];

// Define the Product type
interface Product {
  title: string;
  desc: string;
  price: string;
  image: string;
}

const predefinedProducts: Record<string, Product[]> = {
  "Первые блюда": [
    { title: "Лагман", desc: "Вкусный Лагман", price: "12000", image: "/assets/img/lagmon.jpg" },
    { title: "Шурпа", desc: "Классические Шурпа", price: "15000", image: "/assets/img/shurva.jpg" },
    { title: "Мастава", desc: "Классические Мастава", price: "15000", image: "/assets/img/mastava.jpg" },
    { title: "Мампар", desc: "Классические Мампар", price: "15000", image: "/assets/img/mampar.jpg" },
  ],
  "Вторые блюда": [
    { title: "Плов", desc: "Традиционный плов", price: "20000", image: "/assets/img/plov.jpg" },
    { title: "вагур", desc: "Традиционный вагур", price: "20000", image: "/assets/img/vaguri.jpg" },
    { title: "норин", desc: "Традиционный норин", price: "20000", image: "/assets/img/norin.jpg" },
  ],
  "Салаты": [
    { title: "Аччичук", desc: "Традиционный Аччичук", price: "20000", image: "/assets/img/aciq.jpg" },
    { title: "Весений", desc: "Традиционный Весений", price: "20000", image: "/assets/img/bahor.jpg" },
    { title: "Хоровац", desc: "Традиционный Хоровац", price: "20000", image: "/assets/img/xaro.jpg" },
    { title: "Чирокчи", desc: "Традиционный Чирокчи", price: "20000", image: "/assets/img/ciroq.jpg" },
  ],
  "Мучные изделия": [
    { title: "Самса с мясом", desc: "Традиционный Самса с мясом", price: "18000", image: "/assets/img/samsagosh.jpg" },
    { title: "Самса с зеленью", desc: "Традиционный Самса с зеленью", price: "12000", image: "/assets/img/samsagreen.jpg" },
    { title: "лепешки ", desc: "Традиционный лепешки ", price: "5000", image: "/assets/img/leposh.jpg" },
    { title: "патыр кокандский", desc: "Традиционный патыр кокандский", price: "8000", image: "/assets/img/patir.jpg" },
  ],
};

const Fooders: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof predefinedProducts | null>(null);
  const [products, setProducts] = useState<Product[]>([]); // Use Product type here
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

  const handleAddToCart = (product: Product) => { // Use Product type here
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
              <p>No products available in this category.</p>
            ) : (
              products.map((product, idx) => (
                <div key={idx} className={styles.product__card}>
                  <Image
                    className={styles.product__img}
                    src={product.image}
                    alt={product.title}
                    width={340}
                    height={100}
                    layout="responsive"
                  />
                  <p className={styles.product__title}>{product.title}</p>
                  <p className={styles.product__desc}>{product.desc}</p>
                  <p className={styles.product__price}>{product.price} UZS</p>
                  <button
                    className={styles.product__addToCart}
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
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
