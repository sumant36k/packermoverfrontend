import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/PopupModal.css";

const PopupModal = ({ isOpen, onClose ,price}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState("");
  const prices = [price, price, price, price];
  const dates = [
    { day: "Sun", date: "22 Dec", price: `₹ ${prices[0]}` },
    { day: "Mon", date: "23 Dec", price: `₹ ${prices[1]}` },
    { day: "Tue", date: "24 Dec", price: `₹ ${prices[2]}` },
    { day: "Wed", date: "25 Dec", price: `₹ ${prices[3]}` }
];

  const slots = ["9AM", "2PM", "5PM"]; // Available time slots

  const handleConfirm = () => {
    if (selectedDate && selectedSlot) {
      alert(
        `Pickup confirmed on ${selectedDate.toLocaleDateString()} at ${selectedSlot}`
      );
      onClose();
    } else {
      alert("Please select a date and time slot.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Close Button */}
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>

        {/* Header */}
        <h3 className="modal-header">Confirm your Shifting Date & Slot</h3>

        <div className="content-wrapper">
          {/* Pickup Date Section */}
          <div className="pickup-section">
            <label className="section-label">Select Pickup Date:</label>
            <div className="date-options">
              {dates.map((item, index) => (
                <button
                  key={index}
                  className={`date-btn ${
                    selectedDate.toLocaleDateString() === item.date
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => setSelectedDate(new Date(item.date))}
                >
                  <div className="date-day">{item.day}</div>
                  <div className="date-text">{item.date}</div>
                  <div className="date-price">{item.price}</div>
                </button>
              ))}
            </div>

            {/* Pickup Slot Section */}
            <label className="section-label">Select Pickup Slot:</label>
            <div className="slot-options">
              {slots.map((slot, index) => (
                <button
                  key={index}
                  className={`slot-btn ${
                    selectedSlot === slot ? "selected" : ""
                  }`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Calendar Section */}
          <div className="calendar-wrapper">
            <label className="calendar-label">Calendar</label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              minDate={new Date()}
              className="date-picker"
              inline
            />
          </div>
        </div>

        {/* Confirm Button */}
        <button className="confirm-btn" onClick={handleConfirm}>
          Confirm
        </button>
      </div>
    </div>
  );
};

export default PopupModal;
