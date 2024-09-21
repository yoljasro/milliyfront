import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from '../styles/order.module.sass';

interface CartItem {
  quantity: number;
  product: {
    image: string;
    title: string;
    price: string;
    description: string;  // Yangi description qo'shildi
  };
}

interface OrderData {
  products: {
    productId: string;
    productName: string;
    quantity: number;
  }[];
  deliveryType: string;
  address: string;
  phone: string;
  totalPrice: number;
  paymentStatus: string;
  orderStatus: string;
}

const OrderPage: React.FC = () => {
  const router = useRouter();
  const { query } = router;
  const [cartItems, setCartItems] = useState<{ [key: string]: CartItem }>({});
  const [deliveryType, setDeliveryType] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);

  useEffect(() => {
    if (query.items) {
      setCartItems(JSON.parse(query.items as string));
    }

    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
    }
  }, [query.items]);

  const handleDeliveryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setDeliveryType(value);
  };

  const calculateTotalPrice = () => {
    return Object.values(cartItems).reduce((total, item) => {
      const price = parseFloat(item.product.price);
      return !isNaN(price) ? total + price * item.quantity : total;
    }, 0);
  };

  const handleOrder = async () => {
    const totalPrice = calculateTotalPrice();

    if (isNaN(totalPrice)) {
      alert('Invalid total price.');
      return;
    }

    const orderData: OrderData = {
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
      orderStatus: 'pending',
    };

    try {
      const response = await fetch('https://milliyadmin.uz/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      await sendOrderToTelegram(orderData, totalPrice);

      setShowSuccessAlert(true);

      // Tekshiruvlar qo'shilmoqda
      if (window.Telegram && window.Telegram.WebApp) {
        const webAppClose = window.Telegram.WebApp.close;
        if (typeof webAppClose === 'function') {
          setTimeout(() => {
            webAppClose();
          }, 1500);
        }
      }

    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  const sendOrderToTelegram = async (orderData: OrderData, totalPrice: number) => {
    const telegramMessage = {
      chat_id: '1847596793',
      text: `Yangi buyurtma qabul qilindi:\n\nMahsulotlar: ${orderData.products
        .map(item => item.productName)
        .join(', ')}\nJami narx: ${totalPrice} UZS\nBuyurtma statusi: pending`,
    };

    await fetch('https://api.telegram.org/bot6837472952:YOUR_BOT_TOKEN/sendMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(telegramMessage),
    });
  };

  return (
    <div className={styles.orderPage}>
      <div className={styles.orderItems}>
        <h2 className={styles.name}>Order Details</h2>
        {Object.entries(cartItems).map(([id, item]) => (
          <div key={id} className={styles.orderItem}>
            <div className={styles.orderItemImage}>
              <Image
                src={item.product.image || '/fallback-image.jpg'}
                alt="order item"
                width={270}
                height={182}
                className={styles.img}
              />
            </div>
            <div className={styles.orderItemDetails}>
              <h3>{item.product.title}</h3>
              <p className={styles.price}>{item.product.price} UZS</p>
              <p className={styles.description}>{item.product.description}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.deliveryOptions}>
        <h2>Delivery Options</h2>
        <div className={styles.deliveryChoices}>
          <label>
            <input
              type="radio"
              value="доставка"
              checked={deliveryType === 'доставка'}
              onChange={handleDeliveryChange}
            />
            Доставка
          </label>
          <label>
            <input
              type="radio"
              value="самовывоз"
              checked={deliveryType === 'самовывоз'}
              onChange={handleDeliveryChange}
            />
            Самовывоз
          </label>
        </div>

        {deliveryType === 'доставка' && (
          <div className={styles.deliveryDetails}>
            <label>
              Address:
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </label>
            <label>
              Phone:
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>
          </div>
        )}
      </div>

      <div className={styles.orderSummary}>
        <h2>Total Price: {calculateTotalPrice()} UZS</h2>
        <button className={styles.submitButton} onClick={handleOrder}>Place Order</button>
      </div>

      {showSuccessAlert && <div className={styles.successAlert}>Your order has been placed successfully!</div>}
    </div>
  );
};

export default OrderPage;
