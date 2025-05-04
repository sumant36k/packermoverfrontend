import React from "react";
import "../styles/BookingDetailsCard.css"; // Import the CSS file

const BookingDetailsCard = ({ selectedItems, price, handleContinue }) => {
  const totalQuantity = selectedItems.reduce((total, item) => total + item.quantity, 0);
  const totalCFT = selectedItems.reduce((total, item) => total + item.quantity * item.sizeCFT, 0);

  return (
    <section className="booking-card">
      <h3>Booking Details</h3>

      <div>
        <h4>Selected Items</h4>
        {selectedItems.length > 0 ? (
          <ul>
            {selectedItems.map((item) => (
              <li key={item.itemID}>
                <span>{item.name}</span>
                <span>Qty: {item.quantity}</span>
                <span>CFT: {item.quantity * item.sizeCFT}</span>
              </li>
            ))}

            {/* Total Summary */}
            <li><strong>Total Quantity:</strong> {totalQuantity}</li>
            <li><strong>Total CFT:</strong> {totalCFT}</li>
            <li><strong>Price:</strong> ₹{price}</li>
          </ul>
        ) : (
          <p>No items selected.</p>
        )}
      </div>

      {/* Continue Button */}
      
    </section>
  );
};

export default BookingDetailsCard;
