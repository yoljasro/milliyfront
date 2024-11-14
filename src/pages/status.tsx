import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/status.module.sass';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

const Status: React.FC = () => {
  const router = useRouter();
  const { orderId } = router.query;
  const [progress, setProgress] = useState(0);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const statusProgressMap: { [key: string]: number } = {
    Принял: 33,
    Подготовка: 66,
    Готовый: 100,
  };

  const fetchOrderStatus = async () => {
    if (orderId) {
      try {
        const response = await axios.get(`https://backmilliy-production.up.railway.app/orders/${orderId}`);
        const status = response.data.orderStatus;
        setOrderStatus(status);
        setProgress(statusProgressMap[status] || 0);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching order status:', error);
        setError('Не удалось загрузить статус заказа');
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!orderId) return; // Agar orderId mavjud bo'lmasa, funksiyani ishlatmaydi

    fetchOrderStatus();

    // socket.io ulanishi faqat orderId mavjud bo'lganda
    socketRef.current = io('https://backmilliy-production.up.railway.app');
    socketRef.current.on('order-status-update', (data) => {
      if (data.orderId === orderId) {
        setOrderStatus(data.orderStatus);
        setProgress(statusProgressMap[data.orderStatus] || 0);
      }
    });

    // Sahifadan chiqishda socket ulanishini uzish
    return () => {
      socketRef.current?.disconnect();
    };
  }, [orderId]);

  if (isLoading) {
    return <p className={styles.loading}>Загрузка статуса заказа...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  return (
    <div className={styles.statusPage}>
      <h2 className={styles.title}>Статус заказа</h2>
      <div className={styles.progressContainer}>
        <div
          className={styles.progressBar}
          style={{ width: `${progress}%`, transition: 'width 1s ease-in-out' }}
        > 
          {progress}%
        </div>
      </div>
      <div className={styles.statusMessage}>
        <p>Статус заказа: <strong>{orderStatus || 'Неизвестно'}</strong></p>
      </div>
    </div>
  );
};

export default Status;
