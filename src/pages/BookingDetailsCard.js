import React from "react";
import { 
  Card, CardContent, Typography, List, ListItem, Stack, 
  Button, Divider, Box, Paper 
} from "@mui/material";
import { ShoppingCart, AttachMoney, Inventory2 } from "@mui/icons-material"; // Icons

const BookingDetailsCard = ({ selectedItems,
  price,
  handleContinue,
  serviceLift,
  selectedFloor,
  vanAccessible,
  roadDistance }) => {
  const totalQuantity = selectedItems.reduce((total, item) => total + item.quantity, 0);
  const totalCFT = selectedItems.reduce((total, item) => total + item.quantity * item.sizeCFT, 0);

  return (
    <Card 
      sx={{ 
        maxWidth: 600, 
        mx: "auto", 
        p: 3, 
        boxShadow: 6, 
        borderRadius: 3, 
        bgcolor: "#fff"
      }}
    >
      <CardContent>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <ShoppingCart sx={{ color: "primary.main" }} />
          <Typography 
            variant="h6" 
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            Booking Summary
          </Typography>
        </Box>
        <Box sx={{ mt: 3, p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}>
  <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "center", mb: 2 }}>
    Booking Details Summary
  </Typography>

  <Typography variant="body1">Service Lift: {serviceLift ? serviceLift.toUpperCase() : "Not Selected"}</Typography>
  {serviceLift === "no" && selectedFloor && (
    <Typography variant="body2">Floor Charge: ₹{selectedFloor * 200}</Typography>
  )}

  <Typography variant="body1" sx={{ mt: 1 }}>Van Accessibility: {vanAccessible ? vanAccessible.toUpperCase() : "Not Selected"}</Typography>
  {vanAccessible === "no" && roadDistance && (
    <Typography variant="body2">Road Accessibility Charge: ₹500</Typography>
  )}

  <Divider sx={{ my: 2 }} />
  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
    Total Price: ₹{price}
  </Typography>
</Box>

        <Divider sx={{ mb: 3 }} />

        {/* Selected Items */}
        <Typography 
          variant="subtitle1" 
          sx={{ fontWeight: "bold", mb: 2, color: "text.primary" }}
        >
          Selected Items
        </Typography>
        
        <List disablePadding>
          {selectedItems.map((item) => (
            <ListItem key={item.itemID} disablePadding>
              <Paper 
                elevation={2} 
                sx={{ width: "100%", p: 2, borderRadius: 2, mb: 1, bgcolor: "#f9f9f9" }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Qty: {item.quantity}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    CFT: {item.quantity * item.sizeCFT}
                  </Typography>
                </Stack>
              </Paper>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 3 }} />

        {/* Total Summary */}
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body1">
              <strong>Total Quantity:</strong>
            </Typography>
            <Typography variant="body1">{totalQuantity}</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body1">
              <strong>Total CFT:</strong>
            </Typography>
            <Typography variant="body1">{totalCFT}</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <AttachMoney sx={{ color: "green" }} />
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Price:
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "green" }}>
              ₹{price}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>

      {/* Continue Button */}
      {handleContinue && (
        <Box sx={{ textAlign: "center", pb: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleContinue} 
            sx={{ px: 4, py: 1.5, fontWeight: "bold", fontSize: "1rem" }}
          >
            Continue
          </Button>
        </Box>
      )}
    </Card>
  );
};

export default BookingDetailsCard;
