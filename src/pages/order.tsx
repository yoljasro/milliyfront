    import React, { useState, useEffect } from 'react';
    import { useRouter } from 'next/router';
    import Image from 'next/image';
    import styles from '../styles/order.module.sass';
    import { Snackbar, Alert } from '@mui/material';
    import { Click } from 'components/Click';
    import { FaLocationDot } from "react-icons/fa6";
    import { FaPhone } from "react-icons/fa6";

    interface CartItem {
      quantity: number;
      product: {
        image: string;
        title: string;
        price: string;
        desc: string;
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
    interface QueryItems {
      [key: string]: CartItem;
    }


    const OrderPage: React.FC = () => {
      const router = useRouter();
      const { query } = router;
      const [cartItems, setCartItems] = useState<{ [key: string]: CartItem }>({});
      const [deliveryType, setDeliveryType] = useState<string>(''); 
      const [address, setAddress] = useState<string>(''); 
      const [ paymentType , setPaymentType] = useState<string>('')
      const [phone, setPhone] = useState('+998');
      const [promocode, setPromocode] = useState<string>(''); // Promokod uchun holat
      const [alert, setAlert] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

      useEffect(() => {
        if (query.items) {
          const items: QueryItems = JSON.parse(query.items as string);
          const filteredItems = Object.entries(items).reduce((acc, [key, item]) => {
            const { image, title, price, desc } = item.product;
            acc[key] = { quantity: item.quantity, product: { image, title, price, desc } };
            return acc;
          }, {} as { [key: string]: CartItem });
          
          setCartItems(filteredItems);
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
        const total = Object.values(cartItems).reduce((total, item) => {
          const price = parseFloat(item.product.price);
          return !isNaN(price) ? total + price * item.quantity : total;
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
          return; // Stop the function
        }
      
        if (!paymentType) {
          setAlert({ open: true, message: 'Выберите способ оплаты.', severity: 'error' });
          return; // Prevent submission if paymentType is not selected
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
            router.push('/status');
          }, 1500);
      
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

      const handlePaymentTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPaymentType(e.target.value);
      };

      const sendOrderToTelegram = async (orderData: OrderData, totalPrice: number) => {
        const telegramMessage = {
          chat_id: '7965465294',
          text: `Получен новый заказ:\n\nТовары:\n${orderData.products
            .map(item => `${item.productName} - ${item.quantity}`)
            .join('\n')}\n\nОбщая стоимость: ${totalPrice} сум\nСтатус заказа: ${orderData.orderStatus}`,
        };

        try {
          const response = await fetch('https://api.telegram.org/bot7965465294:AAF2cKY7yoDVG80hySTK6bcwQocoX3BO9-U/sendMessage', {
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

      const handleQuantityChange = (id: string, operation: 'increment' | 'decrement') => {
        setCartItems((prevItems) => {
          const currentItem = prevItems[id];
          if (operation === 'increment') {
            return {
              ...prevItems,
              [id]: { ...currentItem, quantity: currentItem.quantity + 1 },
            };
          } else if (operation === 'decrement' && currentItem.quantity > 1) {
            return {
              ...prevItems,
              [id]: { ...currentItem, quantity: currentItem.quantity - 1 },
            };
          }
          return prevItems;
        });
      };

      return (
        <div className={styles.orderPage}>
          <h2 className={styles.name}>Ваш заказ</h2>
          <p className={styles.orderItemTitle}>Предметы заказа </p>
          <div className={styles.orderItems}>
            {Object.entries(cartItems).map(([id, item]) => (
              <div key={id}>
                <div className={styles.orderItem}>
                  <div className={styles.orderItemImage}>
                    <Image
                      src={item.product.image || '/fallback-image.jpg'}
                      alt="order item"
                      width={146}
                      height={121}
                      className={styles.img}
                    />
                  </div>
                  <div className={styles.orderItemDetails}>
                    <h3 className={styles.title}>{item.product.title}</h3>
                    <p className={styles.description}>{item.product.desc}</p>
                    <p className={styles.price}>{item.product.price} UZS</p>
                    <div className={styles.counter}>
                      <button onClick={() => handleQuantityChange(id, 'decrement')}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleQuantityChange(id, 'increment')}>+</button>
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
                  {/* Адрес: */}
                  <div className={styles.inputWrapper}>
                  <FaLocationDot className={styles.inputIcon}/> 
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Введите адрес"
                    />
                  </div>
                </label>
                <label>
                  {/* Телефон: */}
                  <div className={styles.inputWrapper}>
                  <FaPhone className={styles.inputIcon}/> 
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ваш телефон"
                    />
                  </div>
                </label>
              </div>
            )}
          </div>
          <div className={styles.paymentOptionContainer}>
          
          <label className={`${styles.paymentLabel} ${paymentType === 'Наличные' ? styles.active : ''}`}>
            <input
              type="radio"
              value="Наличные"
              className={styles.cashinput }
              checked={paymentType === 'Наличные'}
              onChange={handlePaymentTypeChange}
            />
            Наличные
          </label>

          <Click totalPrice={calculateTotalPrice()} onClick={handleOrder} onSuccess={() => console.log('Order was successful!')} />

        </div>
          <button onClick={handleOrder} className={styles.submitButton}>Заказать</button>

          <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert}>
            <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
              {alert.message}
            </Alert>
          </Snackbar>
        </div>
      );
    };

    export default OrderPage;
