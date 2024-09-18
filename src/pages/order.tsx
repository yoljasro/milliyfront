import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from '../styles/order.module.sass';

interface CartItem {
  quantity: number;
  product: {
    img: string;
    title: string;
    price: string;
  };
}

const OrderPage: React.FC = () => {
  const router = useRouter();
  const { query } = router;
  const [cartItems, setCartItems] = useState<{ [key: string]: CartItem }>({});
  const [deliveryType, setDeliveryType] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [showSubmitButton, setShowSubmitButton] = useState<boolean>(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);

  useEffect(() => {
    if (query.items) {
      setCartItems(JSON.parse(query.items as string));
    }
  }, [query.items]);

  const handleDeliveryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setDeliveryType(value);
    setShowSubmitButton(value === 'самовывоз');
  };

  const handleOrder = async () => {
    const calculateTotalPrice = () => {
      return Object.values(cartItems).reduce((total, item) => {
        const price = parseFloat(item.product.price);
        return !isNaN(price) ? total + price * item.quantity : total;
      }, 0);
    };

    const totalPrice = calculateTotalPrice();

    if (isNaN(totalPrice)) {
      alert('Invalid total price.');
      return;
    }

    const orderData = {
      products: Object.entries(cartItems).map(([cardId, item]) => ({
        productId: cardId,
        productName: item.product.title,
        quantity: item.quantity,
      })),
      deliveryType,
      address: deliveryType === 'доставка' ? address : '',
      phone: deliveryType === 'доставка' ? phone : '',
      totalPrice: totalPrice,
      paymentStatus: deliveryType === 'самовывоз' ? 'pending' : 'unpaid',
    };

    try {
      const response = await fetch('http://localhost:9000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000); // Hide alert after 3 seconds

      // Optionally, navigate to another page or refresh
    } catch (error) {
      console.error('Error:', error);
      alert(`Failed to place order. Error: ${error}`);
    }
  };

  return (
    <div className={styles.orderPage}>
      <h1>Your Order</h1>
      {Object.keys(cartItems).length > 0 ? (
        <div className={styles.orderList}>
          {Object.entries(cartItems).map(([cardId, cartItem]) => {
            const { product, quantity } = cartItem;
            return (
              quantity > 0 && (
                <div key={cardId} className={styles.orderItem}>
                  <div className={styles.orderItemImage}>
                    <Image
                      src={product.img}
                      alt={product.title}
                      width={120}
                      height={100}
                      className={styles.imglast}
                    />
                  </div>
                  <div className={styles.orderItemDetails}>
                    <h3>{product.title}</h3>
                    <p className={styles.price}>{product.price}</p>
                    <p className={styles.quantity}>Quantity: {quantity}</p>
                  </div>
                </div>
              )
            );
          })}
        </div>
      ) : (
        <p>No items in your cart.</p>
      )}

      <div className={styles.deliveryType}>
        <h2>Тип доставки</h2>
        <label>
          <input
            type="radio"
            name="deliveryType"
            value="доставка"
            checked={deliveryType === 'доставка'}
            onChange={handleDeliveryChange}
          />
          Доставка
        </label>
        <label>
          <input
            type="radio"
            name="deliveryType"
            value="самовывоз"
            checked={deliveryType === 'самовывоз'}
            onChange={handleDeliveryChange}
          />
          Самовывоз
        </label>
      </div>

      {deliveryType === 'доставка' && (
        <div className={styles.deliveryInfo}>
          <label>
            Address:
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter delivery address"
            />
          </label>
          <label>
            Phone Number:
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
            />
          </label>
        </div>
      )}

      {showSubmitButton ? (
        <button className={styles.submitButton} onClick={handleOrder}>
          Submit Order
        </button>
      ) : (
        <button className={styles.paymentButton} onClick={handleOrder}>
          Payment
        </button>
      )}

      {showSuccessAlert && (
        <div className={styles.successAlert}>
          Order placed successfully!
        </div>
      )}
    </div>
  );
};

export default OrderPage;
