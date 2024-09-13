import { useRouter } from 'next/router';
import styles from './order.module.css';
import React from 'react';

interface OrderProduct {
  productId: string;
  quantity: number;
}

interface Product {
  _id: string;
  title: string;
}

const OrderList: React.FC = () => {
  const router = useRouter();
  const { query } = router;
  const selectedProducts: OrderProduct[] = query.selectedProducts
    ? JSON.parse(query.selectedProducts as string)
    : [];

  // Fetch actual product details from server in a real application
  const fetchProductDetails = async (productIds: string[]) => {
    try {
      const response = await fetch('http://localhost:9000/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: productIds }),
      });
      return response.json();
    } catch (error) {
      console.error('Error fetching product details:', error);
      return [];
    }
  };

  const [products, setProducts] = React.useState<Product[]>([]);

  React.useEffect(() => {
    const productIds = selectedProducts.map(sp => sp.productId);
    fetchProductDetails(productIds).then(data => setProducts(data));
  }, [selectedProducts]);

  return (
    <div className={styles.orderListPage}>
      <h2>Order Summary</h2>
      {selectedProducts.length === 0 ? (
        <p>No products selected.</p>
      ) : (
        <div>
          {selectedProducts.map(sp => {
            const product = products.find(p => p._id === sp.productId);
            return product ? (
              <div className={styles.orderProduct} key={sp.productId}>
                <h3 className={styles.productTitle}>{product.title}</h3>
                <p className={styles.productQuantity}>Quantity: {sp.quantity}</p>
              </div>
            ) : (
              <p key={sp.productId}>Product not found</p>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderList;
