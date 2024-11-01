import { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import styles from './index.module.css'

interface ClickProps {
  totalPrice: number; // Total price prop
  onClick: () => void; 
  onSuccess: () => void; 
}

export const Click: React.FC<ClickProps> = ({ totalPrice, onSuccess }) => {
  const [merchantTransId] = useState<string>(generateMerchantTransId()); // Order ID
  const [phoneNumber] = useState<string>(''); // Foydalanuvchining telefon raqami
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Noyob buyurtma identifikatorini yaratish
  function generateMerchantTransId() {  
    return `order_${Date.now()}`; // Hozirgi vaqtni millisekundda olish va undan noyob identifikator yaratish
  }

  const handlePayment = async () => {
    try {
      const response = await axios.post('https://backmilliy-production.up.railway.app/create-invoice', {
        amount: totalPrice,
        phoneNumber,
        merchantTransId,
      });

      window.location.href = response.data.paymentUrl;
      onSuccess();
    } catch (error) {
      console.error('To&apos;lov yaratishda xato:', error);
      setErrorMessage('To&apos;lov yaratishda xato yuz berdi. Iltimos, qaytadan urinib ko&apos;ring.');
    }
  };

  return (
    <div style={{ padding: '20px', color: "black" }} className={styles.click}>
      <h1 className={styles.title}>Оплата </h1>
      <p className={styles.price}>Цена: <span>{totalPrice} UZS</span></p>
     <Image  onClick={handlePayment} src='/assets/img/click.png' alt='clickimage' width={180} height={180}/>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};
