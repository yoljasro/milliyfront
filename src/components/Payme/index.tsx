import React, { useState } from "react";
import axios from "axios";

export const Payme = () => {
  const [amount] = useState(10000);  // Example amount in the smallest unit (e.g., cents)
  const [phone] = useState("998XXXXXXXXX");  // Example phone number
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Send payment request to the backend
      const response = await axios.post("https://0298-84-54-120-223.ngrok-free.app/api/payment", {
        amount,
        phone
      });

      // Check if a URL is returned
      if (response.data.url) {
        // Redirect user to the Payme payment page
        window.location.href = response.data.url;
      } else {
        alert("Failed to initiate payment");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        // TypeScript now knows error has 'message' property
        console.error("Payment failed:", error.message);
        alert(`Payment failed. Please try again. Error: ${error.message}`);
      } else {
        console.error("Unexpected error", error);
        alert("Payment failed due to an unexpected error.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Payment Page</h1>
      <button onClick={handlePayment} disabled={loading}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};
