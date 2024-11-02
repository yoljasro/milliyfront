import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import styles from "../styles/order.module.sass";
import { Snackbar, Alert } from "@mui/material";
import { Click } from "components/Click";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhone } from "react-icons/fa6";

// Interfaces
interface FoodItem {
  id: string;
  image: string;
  title: string;
  price: string;
  desc: string;
  quantity: number;
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
  const [fooders, setFooders] = useState<{ [key: string]: FoodItem }>({});
  const [deliveryType, setDeliveryType] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [phone, setPhone] = useState("+998");
  const [paymentType, setPaymentType] = useState<string>('');
  const [promocode, setPromocode] = useState<string>("");
  const [alert, setAlert] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const storedFooders = localStorage.getItem("cart");
    if (storedFooders) {
      setFooders(JSON.parse(storedFooders));
    }
  }, []);

  useEffect(() => {
    if (Object.keys(fooders).length > 0) {
      localStorage.setItem("cart", JSON.stringify(fooders));
    } else {
      localStorage.removeItem("cart");
    }
  }, [fooders]);

  const handleDeliveryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeliveryType(e.target.value);
  };

  const calculateTotalPrice = () => {
    const total = Object.values(fooders).reduce((total, item) => {
      const price = parseFloat(item.price);
      return !isNaN(price) ? total + price * item.quantity : total;
    }, 0);

    if (promocode === "gurman") {
      if (!alert.open) {
        setAlert({
          open: true,
          message: "Вы получили скидку 15%",
          severity: "success",
        });
      }
      return total * 0.85;
    }
    return total;
  };

  const handlePaymentTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentType(e.target.value);
  };

  // Function to send order data to the Telegram bot
  const sendToTelegram = async (orderData: OrderData) => {
    const message = `
      Новый заказ:
      - Заказанные продукты: ${orderData.products.map(item => `${item.productName} (кол-во: ${item.quantity})`).join(', ')}
      - Способ доставки: ${orderData.deliveryType}
      - Адрес: ${orderData.address}
      - Телефон: ${orderData.phone}
      - Общая сумма: ${orderData.totalPrice} UZS
    `;

    const chatId = '8157570693'; // Replace with your chat ID
    const botToken = '8157570693:AAH5IzcmAEZ89E9LZ5deg2AlNX5c7exS_uw'; // Replace with your bot token

    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
      });
    } catch (error) {
      console.error("Error sending message to Telegram:", error);
    }
  };

  const handleOrder = async () => {
    if (!paymentType) {
      setAlert({
        open: true,
        message: "Пожалуйста, выберите способ оплаты.",
        severity: "error",
      });
      return;
    }

    if (paymentType !== "Наличные") {
      setAlert({
        open: true,
        message: "Выберите способ оплаты 'Наличные' для завершения заказа.",
        severity: "error",
      });
      return;
    }

    const totalPrice = calculateTotalPrice();
    if (isNaN(totalPrice)) {
      setAlert({
        open: true,
        message: "Invalid total price.",
        severity: "error",
      });
      return;
    }

    const orderData: OrderData = {
      products: Object.entries(fooders).map(([productId, item]) => ({
        productId,
        productName: item.title,
        quantity: item.quantity,
      })),
      deliveryType,
      address: deliveryType === "доставка" ? address : "",
      phone: deliveryType === "доставка" ? phone : "",
      totalPrice,
      paymentStatus: "unpaid",
      orderStatus: "Принял",
    };

    try {
      const response = await fetch(
        "https://backmilliy-production.up.railway.app/orders",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      // Send order data to Telegram bot
      await sendToTelegram(orderData);

      setAlert({
        open: true,
        message: "Ваш заказ успешно оформлен!",
        severity: "success",
      });

      setTimeout(() => {
        router.push({
          pathname: "/status",
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
      setAlert({
        open: true,
        message: "Не удалось оформить заказ. Попробуйте еще раз.",
        severity: "error",
      });
    }
  };

  const handleQuantityChange = (id: string, operation: 'increment' | 'decrement') => {
    setFooders((prevItems) => {
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
                  src={item.image || "/fallback-image.jpg"}
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
      <label className={styles.promolabel} htmlFor="promo">
        есть промокод?
      </label>
      <input
        type="text"
        value={promocode}
        className={styles.promoinput}
        onChange={(e) => setPromocode(e.target.value)}
        placeholder="Введите промокод"
        id="promo"
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

export default Foodorder;
