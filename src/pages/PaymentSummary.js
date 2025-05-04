import React from "react";
import { Box, Button, Typography, Paper, Divider, Grid } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate, useLocation } from "react-router-dom";
const PaymentSummary = ({ price,userId,bookingId}) => {
  const bookingAmount = Math.round(price * 0.15); // 15% of total price as booking amount
  const amountAtUnloading = Math.round(price * 0.85); // 85% of total price due at unloading
  const totalAmount = bookingAmount + amountAtUnloading;
  const navigate = useNavigate();
  const handleContinueToPayment = () => {
    navigate("/payment-gateway", { state: {bookingId, bookingAmount,userId  } });
  };
  const charges = [
    { label: "Base Price", amount: Math.round(price * 0.5) }, // 50% of total price
    { label: "Single-Layer Packing", amount: Math.round(price * 0.2) }, // 20% of total price
    { label: "Unpacking All The Packed Items", amount: Math.round(price * 0.15) }, // 15% of total price
    { label: "Dismantling & Reassembly Of Basic Furniture", amount: Math.round(price * 0.1) }, // 10% of total price
    { label: "Cartons (5)", amount: "Free", crossed: true },
  ];

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", p: 2 }}>
      <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
        <Typography
          variant="h6"
          sx={{ textAlign: "center", fontWeight: "bold", color: "green" }}
        >
          Pay ₹{bookingAmount} to confirm your booking
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Box textAlign="center">
            <CheckCircleIcon color="success" />
            <Typography variant="body2">Booking Amount</Typography>
            <Typography variant="subtitle2">₹{bookingAmount}</Typography>
          </Box>

          <Box textAlign="center">
            <CheckCircleIcon color="disabled" />
            <Typography variant="body2">At time of unloading</Typography>
            <Typography variant="subtitle2">₹{amountAtUnloading}</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {charges.map((item, index) => (
          <Grid container key={index} justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="body2" sx={{ textDecoration: item.crossed ? "line-through" : "none" }}>
              {item.label}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: "bold", color: item.crossed ? "green" : "black" }}>
              ₹{item.amount}
            </Typography>
          </Grid>
        ))}

        <Divider sx={{ my: 2 }} />

        <Grid container justifyContent="space-between">
          <Typography variant="body1" fontWeight="bold">Total Amount to be Paid</Typography>
          <Typography variant="body1" fontWeight="bold">₹{totalAmount}</Typography>
        </Grid>

        <Typography
          variant="body2"
          sx={{ mt: 2, color: "gray", textAlign: "center" }}
        >
          Free rescheduling till 24 hours before the pickup time.
        </Typography>

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3, backgroundColor: "blue", color: "white", "&:hover": { backgroundColor: "darkred" } }}
          onClick={handleContinueToPayment}
        >
          Confirm Booking
        </Button>

        
      </Paper>
    </Box>
  );
};

export default PaymentSummary;