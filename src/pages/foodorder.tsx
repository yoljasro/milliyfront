import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from '../styles/order.module.sass';
import { Snackbar, Alert } from '@mui/material';
import { Click } from 'components/Click';

interface FoodItem {
  image: string;
  title: string;
  price: string;
  desc: string;
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

interface QueryItems {
  [key: string]: FoodItem; // Change this to only expect FoodItem
}

const OrderPage: React.FC = () => {
  const router = useRouter();
  const { query } = router;
  const [fooders, setFooders] = useState<{ [key: string]: FoodItem }>({});
  const [deliveryType, setDeliveryType] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [phone, setPhone] = useState('+998');
  const [promocode, setPromocode] = useState<string>(''); // Promokod uchun holat
  const [alert, setAlert] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (query.items) {
      const items: QueryItems = JSON.parse(query.items as string);
      console.log(items); // Check the format here
      setFooders(items);
    }
  }, [query.items]);
  

  const handleDeliveryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setDeliveryType(value);
  };

  const calculateTotalPrice = () => {
    const total = Object.values(fooders).reduce((total, item) => {
      const price = parseFloat(item.price);
      return !isNaN(price) ? total + price : total; // Don't multiply by quantity since it's a food item
    }, 0);

    // Promokodni hisobga olish
    if (promocode === 'gurman') {
      // Show the alert and apply the discount only if not already applied
      if (!alert.open) {
        setAlert({ open: true, message: 'Вы получили скидку 15%', severity: 'success' });
      }
      return total * 0.85; // 15% discount
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
        quantity: 1,
      })),
      deliveryType,
      address: deliveryType === 'доставка' ? address : '',
      phone: deliveryType === 'доставка' ? phone : '',
      totalPrice: totalPrice,
      paymentStatus: deliveryType === 'самовывоз' ? 'Принял' : 'unpaid',
      orderStatus: 'Принял',
    };
  
    console.log(orderData); // Check the orderData before sending
  
    try {
      const response = await fetch('https://backmilliy-production.up.railway.app/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
  
      console.log(response); // Check the response from the backend
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
      console.error('Failed to place order:', error);
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
                  <span>1</span> {/* Quantity is fixed to 1 for food items */}
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
          <div className={styles.deliveryDetails}>
            <label>
              Адрес:
              <div className={styles.inputWrapper}>
                <img src="/assets/img/location.png" className={styles.inputIcon} />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Укажите адрес"
                  className={styles.input}
                />
              </div>
            </label>

            <label>
              Номер телефона:
              <div className={styles.inputWrapper}>
                <img src="/assets/img/phone.png" className={styles.inputIcon} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ваш номер телефона"
                  className={styles.input}
                />
              </div>
            </label>
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

  export default OrderPage;
