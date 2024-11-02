// pages/status.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/status.module.sass';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io('https://backmilliy-production.up.railway.app'); // Replace with your server URL

const Status: React.FC = () => {
  const router = useRouter();   
  const { orderId } = router.query; // Get orderId from query parameters
  const [progress, setProgress] = useState(0);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);

  // Mapping order statuses to progress values
  const statusProgressMap: { [key: string]: number } = {
    Принял: 33,
    Подготовка: 66,
    Готовый: 100,
  };

  // Function to fetch initial order status
   const fetchOrderStatus = async () => {
    if (orderId) {
      try {
        const response = await axios.get(`https://backmilliy-production.up.railway.app/api/orders/${orderId}`); // Adjust API endpoint accordingly
        const status = response.data.orderStatus;
        setOrderStatus(status);
        setProgress(statusProgressMap[status] || 0); // Update progress based on the fetched status
      } catch (error) {
        console.error('Error fetching order status:', error);
      }
    }
  };

  useEffect(() => {
    fetchOrderStatus();

    // Listen for order status updates from the server
    socket.on('order-status-update', (data) => {
      if (data.orderId === orderId) {
        setOrderStatus(data.orderStatus);
        setProgress(statusProgressMap[data.orderStatus] || 0); // Update progress based on the received status
      }
    });

    // Clean up the listener on unmount
    return () => {
      socket.off('order-status-update');
    };
  }, [orderId]);

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
        <p>Статус заказа: <strong>{orderStatus}</strong></p>
      </div>
    </div>
  );
};

export default Status;
