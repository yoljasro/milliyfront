import { useState } from 'react';
import axios from 'axios';

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
      const response = await axios.post('http://localhost:4000/create-invoice', {
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
    <div style={{ padding: '20px', color: "black" }}>
      <h1>Tolov</h1>
      <p>Price: <span>{totalPrice} UZS</span></p>
      <button onClick={handlePayment} style={{ padding: '10px 20px' }}>
        Tolov qilish
      </button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};
