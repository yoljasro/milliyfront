import React, { useState } from 'react';
import styles from './index.module.sass';
import Image from 'next/image';
import { useRouter } from 'next/router';

const categories = [
  { title: "Первые блюда", image: "/assets/img/mastava.jpg" },
  { title: "Вторые блюда", image: "/assets/img/plov.jpg" },
  { title: "Салаты", image: "/assets/img/aciq.jpg" },
  { title: "Мучные изделия", image: "/assets/img/samsa.jpg" }
];

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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [cart, setCart] = useState<Record<string, number>>({});
  const router = useRouter();

  const handleCategoryClick = (category: keyof typeof predefinedProducts) => {
    setSelectedCategory(category);
    setLoading(true);
    setProducts(predefinedProducts[category] || []);
    setLoading(false);
  };

  const handleAddToCart = (product: Product) => {
    setCart(prevCart => ({
      ...prevCart,
      [product.title]: (prevCart[product.title] || 0) + 1
    }));
  };

  const handleRemoveFromCart = (product: Product) => {
    setCart(prevCart => {
      const newCart = { ...prevCart };
      if (newCart[product.title]) {
        newCart[product.title] -= 1;
        if (newCart[product.title] === 0) {
          delete newCart[product.title];
        }
      }
      return newCart;
    });
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setCart({});
  };

  const handleOrder = () => {
    const orderItems = JSON.stringify(cart);
    localStorage.setItem('orderItems', orderItems);
    router.push('/order');
  };

  return (
    <div className={styles.fooders}>
      {!selectedCategory && <h1 className={styles.fooders__title}>Все каталоги</h1>}

      <div className={styles.fooders__cards}>
        {!selectedCategory && categories.map((category, index) => (
          <div
            key={index}
            className={styles.fooders__card}
            onClick={() => handleCategoryClick(category.title as keyof typeof predefinedProducts)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleCategoryClick(category.title as keyof typeof predefinedProducts)}
            aria-label={`Select ${category.title}`}
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
          <div className={styles.fooders__products}>
            <div>
              <button className={styles.fooders__backBtn} onClick={handleBackToCategories} aria-label="Back to categories">Назад</button>
              <h2 className={styles.fooders__title}>{selectedCategory}</h2>
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
                    aria-label={`Add ${product.title} to cart`}
                  >
                    Add to Cart
                  </button>
                  {cart[product.title] > 0 && (
                    <div className={styles.product__counter}>
                      <button onClick={() => handleRemoveFromCart(product)}>-</button>
                      <span>{cart[product.title]}</span>
                      <button onClick={() => handleAddToCart(product)}>+</button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <div className={styles.btncont}>
      
      {Object.keys(cart).length > 0 && (
        <button className={styles.orderButton} onClick={handleOrder} aria-label="Proceed to order">Order</button>
      )}
    </div>
    </div>
  );
};

export default Fooders;