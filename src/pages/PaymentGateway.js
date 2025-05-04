import React, { useState } from "react";

import {  Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const PaymentGateway = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const amount = location.state?.bookingAmount || 0;
  const [userId] = useState(location.state?.userId || "");
  const [bookingId] = useState(location.state?.bookingId || "");
  const [transactionId, setTransactionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ticketId, setTicketId] = useState(null);
  // Mock Payment API (Replace with real gateway integration)
  const processPayment = async () => {
    if (!amount) {
      alert("Please complete the booking first.");
      return;
    }
    setLoading(true);
    try {
     // const response = await axios.post("https://mock-payment-api.com/pay", {
       // amount,
     // });
      const  transactionId  = "526589562ABC";//response.data;
      setTransactionId(transactionId);
      saveTransaction(transactionId);
    } catch (error) {
      console.error("Payment failed", error);
    }
    setLoading(false);
  };

  // Save transaction details to database
  const saveTransaction = async (transactionId) => {
   
  				
    const paymentDetails = {
        userID: parseInt(userId, 10),
        bookingID :bookingId,
        amount: parseFloat(amount),
         paymentStatus:"Partial done",
        transactionID:transactionId,
       paymentDate:new Date().toISOString()
      };
      try {
        const response = await axios.post(
          "https://localhost:7148/api/booking/ProcessPayment",
          paymentDetails,
          { headers: { "Content-Type": "application/json" } }
        );
        if (response.status === 200) {
          alert("Payment successfully saved!");
         
        } else {
          alert("Failed to pay booking amount. Please try again.");
        }
      } catch (error) {
        console.error("Error creating payment:", error);
        alert("Error creating payment.");
      }
    };
      
  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold">Payment Gateway</h2>
      <p>Amount to Pay: ${amount}</p>
      <Button onClick={processPayment} disabled={loading}>
        {loading ? "Processing..." : "Proceed to Payment"}
      </Button>
      {transactionId && <p>Transaction ID: {transactionId}</p>}
      {ticketId && <p>Ticket ID: {ticketId}</p>}
    </div>
  );
};

export default PaymentGateway;