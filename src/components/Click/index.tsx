import { useState } from 'react';
import axios from 'axios';

interface ClickProps {
  totalPrice: number; // Total price prop
  onSuccess: () => void; // To'lov muvaffaqiyatli bo'lsa chaqiriladigan callback
}

export const Click: React.FC<ClickProps> = ({ totalPrice, onSuccess }) => {
  const [merchantTransId, setMerchantTransId] = useState<string>(generateMerchantTransId()); // Order ID
  const [phoneNumber, setPhoneNumber] = useState<string>(''); // Foydalanuvchining telefon raqami
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Noyob buyurtma identifikatorini yaratish
  function generateMerchantTransId() {
    return `order_${Date.now()}`; // Hozirgi vaqtni millisekundda olish va undan noyob identifikator yaratish
  }

  const handlePayment = async () => {
    try {
      const response = await axios.post('http://localhost:4000/create-invoice', {
        amount: totalPrice, // Total price prop
        phoneNumber, // Telefon raqamini yuborish
        merchantTransId,
      });

      // Foydalanuvchini to'lov sahifasiga yo'naltirish
      window.location.href = response.data.paymentUrl;

      // To'lov muvaffaqiyatli bo'lsa callback'ni chaqiramiz
      onSuccess();
    } catch (error) {
      console.error('To\'lov yaratishda xato:', error);
      setErrorMessage('To\'lov yaratishda xato yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
    }
  };

  return (
    <div style={{ padding: '20px', color: "black" }}>
      <h1>To'lov</h1>
      <p>Price: <span>{totalPrice} UZS</span></p>
      <button onClick={handlePayment} style={{ padding: '10px 20px' }}>
        To'lov qilish
      </button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};
