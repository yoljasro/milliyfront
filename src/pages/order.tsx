import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from '../styles/order.module.sass';
import { Snackbar, Alert } from '@mui/material';

interface CartItem {
  quantity: number;
  product: {
    image: string;
    title: string;
    price: string;
    description: string;
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
  const [alert, setAlert] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

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
      setAlert({ open: true, message: 'Invalid total price.', severity: 'error' });
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
      paymentStatus: deliveryType === 'самовывоз' ? 'Принял' : 'unpaid',
      orderStatus: 'Принял',
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
      setAlert({ open: true, message: 'Your order has been placed successfully!', severity: 'success' });

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
      setAlert({ open: true, message: 'Failed to place order. Please try again.', severity: 'error' });
    }
  };

  const sendOrderToTelegram = async (orderData: OrderData, totalPrice: number) => {
    const telegramMessage = {
      chat_id: '1847596793',
      text: `Получен новый заказ:\n\nТовары:\n${orderData.products
        .map(item => `${item.productName} - ${item.quantity}`)
        .join('\n')}\n\nОбщая стоимость: ${totalPrice} сум\nСтатус заказа: ${orderData.orderStatus}`,
    };

    try {
      const response = await fetch('https://api.telegram.org/botYOUR_BOT_TOKEN/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(telegramMessage),
      });

      if (!response.ok) {
        throw new Error('Failed to send message to Telegram');
      }
    } catch (error) {
      console.error('Error sending message to Telegram:', error);
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <div className={styles.orderPage}>
      <div className={styles.orderItems}>
        <h2 className={styles.name}>Информация о заказе</h2>
        {Object.entries(cartItems).map(([id, item]) => (
          <div key={id} className={styles.orderItem}>
            <div className={styles.orderItemImage}>
              <Image
                src={item.product.image || '/fallback-image.jpg'}
                alt="order item"
                width={100}
                height={100}
                className={styles.img}
              />
            </div>
            <div className={styles.orderItemDetails}>
              <h3 className={styles.title}>{item.product.title}</h3>
              <p className={styles.price}>{item.product.price} UZS</p>
              <p className={styles.description}>{item.product.description}</p>
              <p>Количество: {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.deliveryOptions}>
        <h2 className={styles.option}>Варианты доставки</h2>
        <div className={styles.deliveryChoices}>
          <label className={`${styles.deliveryLabel} ${deliveryType === 'доставка' ? styles.active : ''}`}>
            <input
              type="radio"
              value="доставка"
              checked={deliveryType === 'доставка'}
              onChange={handleDeliveryChange}
            />
            Доставка
          </label>
          <label className={`${styles.deliveryLabel} ${deliveryType === 'самовывоз' ? styles.active : ''}`}>
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
              Адрес:
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </label>
            <label>
              Телефон:
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
        <h2>Общая цена: {calculateTotalPrice()} UZS</h2>
        <button className={styles.submitButton} onClick={handleOrder}>Разместить заказ</button>
      </div>

      <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default OrderPage;
