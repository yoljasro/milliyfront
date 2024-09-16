import React, { useEffect, useState } from 'react';
import styles from '../styles/modal.module.sass';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: any; // Replace with a more specific type if needed
}

const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, orderData }) => {
  const [currentOrderData, setCurrentOrderData] = useState<any>(orderData);

  useEffect(() => {
    if (isOpen && orderData) {
      const fetchOrderDetails = async () => {
        try {
          const response = await fetch(`http://localhost:9000/orders/${orderData.orderId}`);
          const data = await response.json();
          if (response.ok) {
            setCurrentOrderData(data);
          } else {
            console.error('Failed to fetch order details:', data.message);
          }
        } catch (error) {
          console.error('Error fetching order details:', error);
        }
      };

      fetchOrderDetails();

      // Polling to get updated order details
      const intervalId = setInterval(fetchOrderDetails, 10000); // Poll every 10 seconds

      return () => clearInterval(intervalId); // Clean up the interval on component unmount
    }
  }, [isOpen, orderData]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>X</button>
        <h2>Order Details</h2>
        <div className={styles.orderDetails}>
          <h3>Products</h3>
          <ul>
            {currentOrderData?.products.map((item: any, index: number) => (
              <li key={index}>
                {item.productName} - Quantity: {item.quantity}
              </li>
            ))}
          </ul>
          <p><strong>Total Price:</strong> ${currentOrderData?.totalPrice.toFixed(2)}</p>
          <p><strong>Delivery Type:</strong> {currentOrderData?.deliveryType}</p>
          <p><strong>Address:</strong> {currentOrderData?.address}</p>
          <p><strong>Phone:</strong> {currentOrderData?.phone}</p>
          <p><strong>Payment Status:</strong> {currentOrderData?.paymentStatus}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
