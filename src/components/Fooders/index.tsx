import React, { useState, useEffect } from 'react';
import styles from './index.module.sass';
import Image from 'next/image';
import Link from 'next/link';

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
    { title: "Лагман", desc: "Вкусный Лагман", price: "45000", image: "/assets/img/lagmon.jpg" },
    { title: "Шурпа", desc: "Класическая Шурпа", price: "40000", image: "/assets/img/shurva.jpg" },
    { title: "Мастава", desc: "Класическая Мастава", price: "40000", image: "/assets/img/mastava.jpg" },
    { title: "Мампар", desc: "Класическая Мампар", price: "40000", image: "/assets/img/mampar.jpg" },
  ],
  "Вторые блюда": [
    { title: "Плов", desc: "Традиционная плов", price: "50000", image: "/assets/img/plov.jpg" },
    { title: "вагури", desc: "Традиционная вагури", price: "55000", image: "/assets/img/vaguri.jpg" },
    { title: "норин", desc: "Традиционная норин", price: "45000", image: "/assets/img/norin.jpg" },
  ],
  "Салаты": [
    { title: "Аччичук", desc: "Традиционная Аччичук", price: "30000", image: "/assets/img/aciq.jpg" },
    { title: "Весенний", desc: "Традиционная Весений", price: "30000", image: "/assets/img/bahor.jpg" },
    { title: "Хоровац", desc: "Традиционная Хоровац", price: "30000", image: "/assets/img/xaro.jpg" },
    { title: "Чирокчи", desc: "Традиционная Чирокчи", price: "30000", image: "/assets/img/ciroq.jpg" },
  ],
  "Мучные изделия": [
    { title: "Олот самса с мясом", desc: "Традиционный Олот самса с мясом", price: "18000", image: "/assets/img/samsagosh.jpg" },
    { title: "Олот самса с зеленью", desc: "Традиционный Олот самса с зеленью", price: "12000", image: "/assets/img/samsagreen.jpg" },
    { title: "Лепешки", desc: "Традиционный Лепешки", price: "10000", image: "/assets/img/leposh.jpg" },
    { title: "Патыр кокандский", desc: "Традиционный Патыр кокандский", price: "10000", image: "/assets/img/patir.jpg" },
  ],
};

export const Fooders: React.FC<{ addToCart: (item: Product) => void; }> = () => {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof predefinedProducts | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [cart, setCart] = useState<Record<string, number>>({});

  useEffect(() => {
    if (selectedCategory) {
      setLoading(true);
      setProducts(predefinedProducts[selectedCategory]);
      setLoading(false);
    }
  }, [selectedCategory]);

  const handleCategoryClick = (category: keyof typeof predefinedProducts) => {
    setSelectedCategory(category);
  };

  const handleAddToCart = (product: Product) => {
    console.log('Adding to cart:', product);
    setCart((prevCart) => ({
      ...prevCart,
      [product.title]: (prevCart[product.title] || 0) + 1,
    }));
  };

  const handleRemoveFromCart = (product: Product) => {
    setCart((prevCart) => {
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

  // Umumiy narxni hisoblash
  const totalPrice = Object.keys(cart).reduce((total, title) => {
    const product = products.find(p => p.title === title);
    return total + (product ? parseInt(product.price) * cart[title] : 0);
  }, 0);

  return (
    <div className={styles.fooders}>
      {!selectedCategory && <h1 className={styles.fooders__title}>Все каталоги</h1>}

      <div className={styles.fooders__cards}>
        {!selectedCategory &&
          categories.map((category, index) => (
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
              <button className={styles.fooders__backBtn} onClick={handleBackToCategories} aria-label="Back to categories">
                Назад
              </button>
              <h2 className={styles.fooders__title}>{selectedCategory}</h2>
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : products.length === 0 ? (
              <p>No products available in this category. Try another category!</p>
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
                    Добавить в корзину
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

      <Link
        href={{
          pathname: '/foodorder',
          query: { items: JSON.stringify(cart), total: totalPrice },
        }}
      >
        <div className={styles.btncont}>
          {Object.keys(cart).length > 0 && (
            <button className={styles.orderButton}>
              Заказ
            </button>
          )}
        </div>
      </Link>
    </div>
  );
};

