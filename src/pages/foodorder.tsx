import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from '../styles/order.module.sass';
import { Snackbar, Alert } from '@mui/material';
import { Click } from 'components/Click';

interface FoodItem {
  id: string;
  image: string;
  title: string;
  price: string;
  desc: string;
  quantity: number; // Quantity property added
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

const Foodorder: React.FC = () => {
  const router = useRouter();
  // const { query } = router;
  const [fooders, setFooders] = useState<{ [key: string]: FoodItem }>({});
  const [deliveryType, setDeliveryType] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [phone, setPhone] = useState('+998');
  const [promocode, setPromocode] = useState<string>(''); // Promokod uchun holat
  const [alert, setAlert] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const lagman: FoodItem = {
      id: '1',
      image: '/assets/img/lagmon.jpg',
      title: 'Лагман',
      price: '45000',
      desc: 'Вкусный Лагман',
      quantity: 1, // Initialize quantity
    };

    // Har doim lagmanni ko'rsatamiz
    setFooders({ [lagman.id]: lagman });
  }, []);

  const handleDeliveryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setDeliveryType(value);
  };

  const calculateTotalPrice = () => {
    const total = Object.values(fooders).reduce((total, item) => {
      const price = parseFloat(item.price);
      return !isNaN(price) ? total + price * item.quantity : total; // Use quantity in calculation
    }, 0);

    if (promocode === 'gurman') {
      if (!alert.open) {
        setAlert({ open: true, message: 'Вы получили скидку 15%', severity: 'success' });
      }
      return total * 0.85;
    }
    return total;
  };

  const handleOrder = async () => {
    const totalPrice = calculateTotalPrice();
    if (isNaN(totalPrice)) {
      setAlert({ open: true, message: 'Invalid total price.', severity: 'error' });
      return;
    }

    const orderData: OrderData = {
      products: Object.entries(fooders).map(([productId, item]) => ({
        productId,
        productName: item.title,
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
      const response = await fetch('https://backmilliy-production.up.railway.app/orders', {
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

      setTimeout(() => {
        router.push({
          pathname: '/status',
          query: {
            orderStatus: orderData.orderStatus,
            totalPrice: orderData.totalPrice,
            deliveryType: orderData.deliveryType,
            address: orderData.address,
            phone: orderData.phone,
          },
        });
      }, 1500);
    } catch (error) {
      setAlert({ open: true, message: 'Failed to place order. Please try again.', severity: 'error' });
    }
  };

  const sendOrderToTelegram = async (orderData: OrderData, totalPrice: number) => {
    const telegramMessage = `
      New Order:
      Products: ${orderData.products.map(item => `${item.productName} (x${item.quantity})`).join(', ')}
      Delivery Type: ${orderData.deliveryType}
      Address: ${orderData.address}
      Phone: ${orderData.phone}
      Total Price: ${totalPrice} UZS
    `;

    try {
      await fetch('https://api.telegram.org/bot<YOUR_BOT_TOKEN>/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: '<YOUR_CHAT_ID>',
          text: telegramMessage,
        }),
      });
    } catch (error) {
      console.error('Failed to send order to Telegram:', error);
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const handleQuantityChange = (id: string, change: number) => {
    setFooders(prevFooders => {
      const currentFood = prevFooders[id];
      if (currentFood) {
        const newQuantity = Math.max(1, currentFood.quantity + change); // Prevent quantity from going below 1
        return {
          ...prevFooders,
          [id]: { ...currentFood, quantity: newQuantity },
        };
      }
      return prevFooders;
    });
  };

  return (
    <div className={styles.orderPage}>
      <h2 className={styles.name}>Ваш заказ</h2>
      <p className={styles.orderItemTitle}>Предметы заказа </p>
      <div className={styles.orderItems}>
        {Object.entries(fooders).map(([id, item]) => (
          <div key={id}>
            <div className={styles.orderItem}>
              <div className={styles.orderItemImage}>
                <Image
                  src={item.image || '/fallback-image.jpg'}
                  alt="order item"
                  width={146}
                  height={121}
                  className={styles.img}
                />
              </div>
              <div className={styles.orderItemDetails}>
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.description}>{item.desc}</p>
                <p className={styles.price}>{item.price} UZS</p>
                <div className={styles.counter}>
                  <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                </div>
              </div>
            </div>
            <hr />
          </div>
        ))}
      </div>

      <div className={styles.all}>
        <p className={styles.allPrice}>Итоговая сумма:</p>
        <p className={styles.allSum}>{calculateTotalPrice()} UZS</p>
      </div>
      <label className={styles.promolabel} htmlFor='promo'>есть промокод?</label>
      <input
        type="text"
        value={promocode}
        className={styles.promoinput}
        onChange={(e) => setPromocode(e.target.value)}
        placeholder="Введите промокод"
        id='promo'
      />

      <div className={styles.deliveryOptions}>
        <h2 className={styles.option}>Варианты доставки</h2>
        <div className={styles.deliveryChoices}>
          <div className={styles.choicecont}>
            <label className={`${styles.deliveryLabel} ${deliveryType === 'доставка' ? styles.active : ''}`}>
              <input
                type="radio"
                value="доставка"
                checked={deliveryType === 'доставка'}
                onChange={handleDeliveryChange}
              />
              Доставка на дом
            </label>
            <div className={styles.info}>до 5 км бесплатно</div>
          </div>
          <div className={styles.choicecont}>
            <label className={`${styles.deliveryLabel} ${deliveryType === 'самовывоз' ? styles.active : ''}`}>
              <input
                type="radio"
                value="самовывоз"
                checked={deliveryType === 'самовывоз'}
                onChange={handleDeliveryChange}
              />
              Самовывоз
            </label>
            <div className={styles.info}>включите уведомления</div>
          </div>
        </div>

        {deliveryType === 'доставка' && (
          <div className={styles.addressField}>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ваш адрес"
              className={styles.addressInput}
            />
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ваш телефон"
              className={styles.phoneInput}
            />
          </div>
        )}
      </div>
        <Click totalPrice={calculateTotalPrice()} onClick={handleOrder} onSuccess={() => {
            console.log('Order was successful!');

          }} />
          <button onClick={handleOrder} className={styles.submitButton}>Заказать</button>

          <Snackbar open={alert.open} autoHideDuration={3000} onClose={handleCloseAlert}>
            <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
              {alert.message}
            </Alert>
          </Snackbar>
        </div>
      );
    };

    export default Foodorder;
