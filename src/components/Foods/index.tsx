import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './index.module.css';

interface Product {
  _id: string;
  image: string;
  title: string;
  price: number;
}

interface OrderProduct {
  productId: string;
  quantity: number;
}

interface Order {
  products: OrderProduct[];
  deliveryType: 'доставка' | 'самовывоз';
  address?: string;
  phone?: string;
  name?: string; // Added for delivery
  location?: string;
}

const Food: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<OrderProduct[]>([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [orderSent, setOrderSent] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'click' | 'cash'>('cash');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:9000/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddButtonClick = (product: Product) => {
    setSelectedProducts(prev => {
      const existingProduct = prev.find(p => p.productId === product._id);
      if (existingProduct) {
        return prev.map(p =>
          p.productId === product._id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }
      return [...prev, { productId: product._id, quantity: 1 }];
    });
  };

  const handleRemoveButtonClick = (product: Product) => {
    setSelectedProducts(prev => {
      const existingProduct = prev.find(p => p.productId === product._id);
      if (existingProduct && existingProduct.quantity > 1) {
        return prev.map(p =>
          p.productId === product._id
            ? { ...p, quantity: p.quantity - 1 }
            : p
        );
      }
      return prev.filter(p => p.productId !== product._id);
    });
  };

  const submitOrder = async () => {
    if (!order) return;

    try {
      const response = await axios.post('http://localhost:9000/orders', order);
      console.log('Order response:', response.data);
      setOrderSent(true);
      // Send order details to Telegram bot
      await axios.post('https://api.telegram.org/bot6837472952:AAE_uj8Ovl5ult8urjEVQUWptSKSJKBzws4/sendMessage', {
        chat_id: '1847596793',
        text: `New order received:\nProducts: ${JSON.stringify(order.products)}\nDelivery Type: ${order.deliveryType}\nAddress: ${order.address}\nPhone: ${order.phone}\nName: ${order.name}\nLocation: ${order.location}`
      });
    } catch (error) {
      console.error('Error submitting order:', error);
    }
  };

  const handlePayment = () => {
    if (paymentMethod === 'click') {
      // Simulating Click Uzbekistan payment process
      axios.post('https://api.click.uz/payments', {
        amount: 299.99, // Adjust this amount as needed
        description: 'Test payment',
        callback_url: 'http://localhost:9000/orders',
        test: true
      })
      .then((response) => {
        console.log('Payment success:', response);
        submitOrder();
      })
      .catch((error) => {
        console.error('Payment error:', error);
      });
    } else {
      // Handle cash payment
      submitOrder();
    }
  };

  const renderOrderModal = () => (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={() => setShowOrderModal(false)}>×</button>
        <h2 className={styles.order}>Your Order</h2>
        <ul className={styles.orderList}>
          {selectedProducts.map(p => {
            const product = products.find(prod => prod._id === p.productId);
            return product ? (
              <li key={p.productId} className={styles.orderItem}>
                <img
                  src={`http://localhost:9000${product.image.replace(/\\/g, '/')}`}
                  alt={product.title}
                  className={styles.orderImage}
                />
                <div className={styles.orderDetails}>
                  <span>{product.title} x {p.quantity}</span>
                </div>
              </li>
            ) : null;
          })}
        </ul>
        <div className={styles.orderForm}>
          <label>
            Delivery Type:
            <select
              value={order?.deliveryType || ''}
              onChange={e =>
                setOrder(prev =>
                  prev
                    ? { ...prev, deliveryType: e.target.value as 'доставка' | 'самовывоз' }
                    : null
                )
              }
            >
              <option value="доставка">Доставка</option>
              <option value="самовывоз">Самовывоз</option>
            </select>
          </label>
          {order?.deliveryType === 'доставка' && (
            <>
              <label>
                Name:
                <input
                  type="text"
                  value={order?.name || ''}
                  onChange={e =>
                    setOrder(prev => (prev ? { ...prev, name: e.target.value } : null))
                  }
                />
              </label>
              <label>
                Address:
                <input
                  type="text"
                  value={order?.address || ''}
                  onChange={e =>
                    setOrder(prev => (prev ? { ...prev, address: e.target.value } : null))
                  }
                />
              </label>
              <label>
                Phone:
                <input
                  type="text"
                  value={order?.phone || ''}
                  onChange={e =>
                    setOrder(prev => (prev ? { ...prev, phone: e.target.value } : null))
                  }
                />
              </label>
              <label>
                Location:
                <input
                  type="text"
                  value={order?.location || ''}
                  onChange={e =>
                    setOrder(prev => (prev ? { ...prev, location: e.target.value } : null))
                  }
                />
              </label>
            </>
          )}
          {order?.deliveryType === 'самовывоз' && (
            <>
              <label>
                Payment Method:
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as 'click' | 'cash')}
                >
                  <option value="cash">Cash</option>
                  <option value="click">Click Uzbekistan</option>
                </select>
              </label>
              {paymentMethod === 'click' && (
                <button className={styles.submitOrderButton} onClick={handlePayment}>
                  Pay with Click Uzbekistan
                </button>
              )}
              {paymentMethod === 'cash' && (
                <button className={styles.submitOrderButton} onClick={handlePayment}>
                  Pay with Cash
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderProduct = (product: Product) => {
    const quantity = selectedProducts.find(p => p.productId === product._id)?.quantity || 0;

    return (
      <div className={styles.productCard} key={product._id}>
        <img
          className={styles.productImage}
          src={`http://localhost:9000${product.image.replace(/\\/g, '/')}`}
          alt={product.title}
        />
        <div className={styles.productInfo}>
          <h3 className={styles.productTitle}>{product.title}</h3>
          <p className={styles.productPrice}>{product.price} USD</p>
        </div>
        {quantity > 0 ? (
          <div className={styles.counterWrapper}>
            <button
              className={styles.counterButton}
              onClick={() => handleRemoveButtonClick(product)}
            >
              -
            </button>
            <span className={styles.counter}>{quantity}</span>
            <button
              className={styles.counterButton}
              onClick={() => handleAddButtonClick(product)}
            >
              +
            </button>
          </div>
        ) : (
          <button className={styles.addButton} onClick={() => handleAddButtonClick(product)}>
            Add
          </button>
        )}
      </div>
    );
  };

  return (
    <div className={styles.app}>
      <div className={styles.products}>
        {products.map(renderProduct)}
      </div>
      <button className={styles.orderButton} onClick={() => setShowOrderModal(true)}>
        View Order
      </button>
      {showOrderModal && renderOrderModal()}
      {orderSent && <p>Buyurtma yuborildi!</p>}
    </div>
  );
};

export default Food;
