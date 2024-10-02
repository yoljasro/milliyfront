import { useState } from 'react';
import axios from 'axios';
import styles from './index.module.css';

const PaymentPage = () => {
  const [amount, setAmount] = useState(50000); // Narx UZSda (masalan, 50,000 UZS)
  const [orderId, setOrderId] = useState('ORD123456'); // Misol uchun buyurtma ID
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');

  const handlePayment = async () => {
    try {
      setLoading(true);
      const response = await axios.post('https://nationalfoodbot-production.up.railway.app/api/payment', {
        amount: amount,
        order_id: orderId,
      });

      console.log('Payment response:', response.data); // Yangi log qo'shildi

      const { paymentUrl } = response.data;

      if (!paymentUrl) {
        alert('Payment URL not received from server.');
        return;
      }

      // To'lov sahifasini yangi oynada oching
      window.open(paymentUrl, '_blank');
    } catch (error) {
      console.error('Error creating payment:', error);
      const errorMessage = error.response?.data?.error || 'Payment failed!';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.paymentContainer}>
      <h2>Mahsulot uchun to'lov</h2>
      <div className={styles.productInfo}>
        <p className={styles.title}>Mahsulot: Test Mahsulot</p>
        <p className={styles.price}>Narx: {amount} UZS</p>
      </div>
      <button className={styles.payButton} onClick={handlePayment} disabled={loading}>
        {loading ? 'Jarayon...' : 'Hozir to\'la'}
      </button>
      {paymentUrl && <p>To'lov sahifasiga yo'naltirilmoqda...</p>}
    </div>
  );
};

export default PaymentPage;
