import React, { useState, useEffect } from 'react';
import styles from '../styles/search.module.sass';
import { FaSearch } from 'react-icons/fa';
import Fatest from '../components/Fatest'; // Fatest componentini yuklash

interface Product {
  _id: string;
  title: string;
  price: number;
  image: string;
}

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState<string>(''); // Qidiruv inputi
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // Qidirilgan mahsulotlar
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await fetch('https://milliyadmin.uz/products');
        if (response.ok) {
          const data = await response.json();
          const products = data.map((product: Product) => ({
            ...product,
            image: `https://milliyadmin.uz/${product.image.replace(/\\/g, '/')}`
          }));
          setAllProducts(products);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchAllProducts();
  }, []);

  // Qidiruv funksiyasi
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = event.target.value.toLowerCase();
    setQuery(searchQuery);

    const results = allProducts.filter((product) =>
      product.title.toLowerCase().includes(searchQuery)
    );
    setFilteredProducts(results);
  };

  return (
    <div className={styles.searchPage}>
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Search for products..."
          value={query}
          onChange={handleSearch}
          className={styles.searchInput}
        />
        <button className={styles.searchButton}>
          <FaSearch />
        </button>
      </div>

      {query && filteredProducts.length > 0 ? (
        <div className={styles.results}>
          <h3>Search Results for {query}:</h3>
          {/* Fatest componentiga filteredProducts ni props orqali yuborish */}
          <Fatest products={filteredProducts} />
        </div>
      ) : (
        query && (
          <div className={styles.noResults}>
            <h3>No results found for {query}</h3>
          </div>
        )
      )}

      {!query && (
        <div className={styles.recommended}>
          <h3>Recommended Products</h3>
          {/* Fatest komponentini render qilish */}
          <Fatest products={allProducts} />
        </div>
      )}
    </div>
  );
};

export default SearchPage;
