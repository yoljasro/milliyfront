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
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);

  useEffect(() => {
    if (query.items) {
      setCartItems(JSON.parse(query.items as string));
    }

    // Telegram WebApp API ni tayyorlash
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
    }
  }, [query.items]);

  const handleDeliveryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setDeliveryType(value);
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

      // Telegram botga buyurtmani yuborish
      const telegramMessage = {
        chat_id: '1847596793',  // Buni o'z chat ID'ingizga almashtiring
        text: `Yangi buyurtma qabul qilindi:\n\nMahsulotlar: ${Object.values(cartItems)
          .map(item => item.product.title)
          .join(', ')}\nJami narx: ${totalPrice} UZS\nBuyurtma statusi: pending`,
      };

      await fetch(`https://api.telegram.org/bot6837472952:AAE_uj8Ovl5ult8urjEVQUWptSKSJKBzws4/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(telegramMessage),
      });

      // Buyurtma muvaffaqiyatli qabul qilingandan so‘ng
      setShowSuccessAlert(true);

      // Telegram WebApp-ni yopish
      if (window.Telegram && window.Telegram.WebApp) {
        setTimeout(() => {
          if (window.Telegram.WebApp.close) {
            window.Telegram.WebApp.close();  // WebApp oynasini yopish
          }
        }, 1500);  // 1.5 soniyadan so'ng oynani yopish
      }
      
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div className={styles.orderPage}>
      <div className={styles.orderItems}>
        <h2 className={styles.name}>Order Details</h2>
        {Object.entries(cartItems).map(([id, item]) => (
          <div key={id} className={styles.orderItem}>
            <div className={styles.orderItemImage}>
              <Image src={'/assets/img/foodlast.jpg'} alt={item.product.title} width={150} height={150} layout="intrinsic" />
            </div>
            <div className={styles.orderItemDetails}>
              <h3>{item.product.title}</h3>
              <p className={styles.price}>{item.product.price} UZS</p>
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
                required
              />
            </label>
            <label>
              Phone:
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </label>
          </div>
        )}
      </div>

      <div className={styles.orderActions}>
        <button className={styles.submitButton} onClick={handleOrder}>Place Order</button>
      </div>

      {showSuccessAlert && (
        <div className={styles.successAlert}>
          <p>Order placed successfully!</p>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
